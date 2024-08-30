import Button from '@components/button/Button';
import { ArrowSmallLeft, ListCheck } from '@components/icons';
import { Loader } from '@components/index';
import Pagination from '@components/pagination/Pagination';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE, endPoint, ROUTES } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import ChildProgressModal from '@views/studentManagement/studentProgress';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { PaginationParams } from 'src/types/common';

interface WeekData {
	totalSpentTime: number;
	totalCompletedLessons: number;
}

interface Scores {
	[week: string]: WeekData;
}

interface SubjectScores {
	[topic: string]: Scores;
}

interface StudentData {
	id: number;
	name: string;
	uuid: string;
	topics: SubjectScores;
}

const StudentTable: React.FC = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [studentData, setStudentData] = useState<StudentData[]>([]);
	const [count, setCount] = useState<number>(0);
	const [editData, setEditData] = useState<StudentData | null>(null);
	const [month, setMonth] = useState<Nullable<Date>>(new Date());
	const [isShownChildProgress, setIsShownChildProgress] = useState<boolean>(false);
	const [isLoadClassroomProgress, setIsLoadClassroomProgress] = useState<boolean>(false);
	const [filterProgressData, setFilterProgressData] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	/**
	 * Extract all unique subjects
	 */
	const topics = Array.from(new Set(studentData.flatMap((student) => Object.keys(student.topics))));

	/**
	 * Find the unique weeks
	 */
	const allWeeks = studentData.flatMap((student) => topics.flatMap((subject) => Object.keys(student.topics[subject] || {})));
	const uniqueWeeks = Array.from(new Set(allWeeks));

	useEffect(() => {
		if (params?.viewId) {
			setIsLoadClassroomProgress(true);
			APIService.getData(`${URL_PATHS.classroom}/${endPoint.childProgress}?page=${filterProgressData.page}&limit=${filterProgressData.limit}&classRoomId=${params?.viewId}&month=${moment(month).format('MM/YYYY').slice(0, 2)}&year=${moment(month).format('MM/YYYY').slice(3, 7)}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setStudentData(response?.data?.data?.studentData);
						setCount(response?.data?.data?.count);
					}
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
				})
				.finally(() => setIsLoadClassroomProgress(false));
		}
	}, [params?.viewId, month, filterProgressData]);

	/**
	 * Method used to open the modal
	 */
	const childProgressHandler = useCallback((data: StudentData) => {
		setEditData(data);
		setIsShownChildProgress(true);
	}, []);

	/**
	 * Method used to close the modal
	 */
	const onCloseHandler = useCallback(() => {
		setIsShownChildProgress(false);
	}, []);

	/**
	 * Method used to handle the date on change
	 */
	const onChangeDateHandler = useCallback(
		(e: { value: React.SetStateAction<Nullable<Date>> }) => {
			setMonth(e.value);
		},
		[month]
	);

	/**
	 * Method used to redirect the page
	 */
	const navigateToClassroomList = useCallback(() => {
		if (params?.schoolId && params?.teacherId) {
			navigate(`/${ROUTES.app}/${ROUTES.classroom}/${ROUTES.list}`, { state: { schoolId: params?.schoolId, teacherId: params?.teacherId } });
		}
	}, [params.schoolId, params.teacherId]);

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onStudentPageDrpSelect = useCallback(
		(e: string) => {
			setFilterProgressData({ ...filterProgressData, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterProgressData]
	);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleStudentPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterProgressData({ ...filterProgressData, page: event.selected + 1 });
		},
		[filterProgressData]
	);

	/**
	 * Method used to convert minutes into hours
	 * @param minutes
	 * @returns
	 */
	const convertToHours = (minutes: number) => {
		if (minutes > 60) {
			const duration = moment.duration(minutes, 'minutes');
			const hours = Math.floor(duration.asHours());
			const mins = duration.minutes();
			return `${hours} hr ${mins.toString().padStart(2, '0')} mins`;
		}
		return `${minutes} mins`;
	};

	return (
		<>
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				{isLoadClassroomProgress && <Loader />}
				<div className='border-b px-3 py-2'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' title='Back to classroom' onClick={navigateToClassroomList}>
							<ArrowSmallLeft />
						</Button>
						<ListCheck className='inline-block mr-2 text-primary' />
						<span>{params?.className} Classroom Progress</span>
					</h6>
				</div>
				<div className='flex flex-col md:flex-row md:items-center justify-between p-3'>
					<div>
						<label htmlFor={'month'} className='font-bold text-gray-700'>
							Filter date
						</label>
						<Calendar value={month} onChange={onChangeDateHandler} view='month' dateFormat='mm/yy' placeholder='MM/YYYY' maxDate={new Date()} showIcon />
					</div>
					<ShowEntries onChange={onStudentPageDrpSelect} value={filterProgressData.limit} />
				</div>
				<div className='overflow-x-auto px-3 py-2'>
					<table className='min-w-full divide-y divide-gray-200 '>
						<thead className='bg-gray-50'>
							<tr>
								<th rowSpan={2} className='px-3 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider sticky -left-4 bg-gray-50 z-10'>
									Student Name
								</th>
								{topics.map((subject) => (
									<th key={subject} colSpan={uniqueWeeks.length} className='px-3 py-2 text-center text-xs font-semibold text-gray-900 tracking-wider sticky'>
										{subject}
									</th>
								))}
							</tr>
							<tr>
								{topics.map((subject) =>
									uniqueWeeks.map((week) => (
										<th key={`${subject}-${week}`} className='px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase tracking-wider'>
											{week}
										</th>
									))
								)}
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{studentData.map((student, index) => (
								<tr key={`${index + 1}`}>
									<td id={student.uuid} className='px-3 py-2 text-sm font-medium text-primary cursor-pointer underline decoration-primary max-w-48 overflow-hidden text-ellipsis whitespace-nowrap sticky -left-4 bg-white z-10 hover:bg-gray-50' title={student.name} onClick={() => childProgressHandler(student)}>
										{student.name}
									</td>
									{topics.map((subject) =>
										uniqueWeeks.map((week) => (
											<td key={`${student.name}-${subject}-${week}`} className='px-3 py-2 whitespace-nowrap text-sm text-gray-600'>
												{student.topics[subject]?.[week] ? (
													<div>
														<div>Time spent: {`${student.topics[subject][week]?.totalSpentTime ? convertToHours(student.topics[subject][week]?.totalSpentTime) : student.topics[subject][week]?.totalSpentTime}`}</div>
														<div>Lessons completed: {student.topics[subject][week]?.totalCompletedLessons}</div>
													</div>
												) : (
													'-'
												)}
											</td>
										))
									)}
								</tr>
							))}
						</tbody>
					</table>
					{!studentData?.length && <p className='text-center'>No Data Found</p>}
				</div>
			</div>
			<Pagination length={count} onSelect={handleStudentPageClick} limit={filterProgressData.limit} />
			{isShownChildProgress && <ChildProgressModal onClose={onCloseHandler} childId={`${editData?.uuid}`} />}
		</>
	);
};

export default StudentTable;
