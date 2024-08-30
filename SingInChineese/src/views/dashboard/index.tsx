import React, { useCallback, useEffect, useState } from 'react';
import { Briefcase, Child, CreditCard, Document, Edit, ListCheck, Man, User, UsersAlt } from '@components/icons';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { URL_PATHS } from '@config/variables';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode, sortOrderValues } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { googleAnalyticsResponse, kidsAgeType, planListType } from 'src/types/dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleAnalyticsApp from './googleAnalytics';
import ShowEntries from '@components/showEntriesDropdown/ShowEntries';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { PaginationParams } from 'src/types/common';
import Pagination from '@components/pagination/Pagination';
import moment from 'moment';
import { SchoolDueDateList } from 'src/types/schools';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { Nullable } from 'primereact/ts-helpers';

const Dashboard = () => {
	const userDetails = localStorage.getItem('userDetails');
	const schoolAdmin = userDetails && JSON.parse(userDetails);
	const [loading, setLoading] = useState<boolean>(false);
	const [schoolDueDateList, setSchoolDueDateList] = useState<SchoolDueDateList>();
	const [dashboardDetails, setDashboardDetails] = useState({
		noOfUsers: 0,
		noOfKids: 0,
		noOfTopics: 0,
		noOfLessons: 0,
		noOfActiveSubscriptions: 0,
		noOfTraditionalChineseLerner: 0,
		noOfSimplifiedChineseLerner: 0,
	});
	const [dashboardRevenue, setDashboardRevenue] = useState({
		noOfRevenue: 0,
	});
	const [subscriptionData, setSubscriptionData] = useState({
		subscriptionForMonth: 0,
		subscriptionForYear: 0,
		planList: [],
	});
	const [avgAge, setAvgAge] = useState<kidsAgeType[]>();
	const [kidsGender, setKidsGender] = useState<number[]>();
	const [googleAnalyticsData, setGoogleAnalyticsData] = useState<googleAnalyticsResponse[]>([]);
	const [dashboardSchoolDetails, setDashboardSchoolDetails] = useState({
		noOfKids: 0,
		noOfTeacher: 0,
		noOfClassRooms: 0,
	});
	const [dashboardTeacherDetails, setDashboardTeacherDetails] = useState({
		noOfStudents: 0,
		noOfTopics: 0,
		noOfLessons: 0,
	});

	const [avgAgeOptions, setAvgAgeOptions] = useState<ApexOptions>({
		chart: {
			type: 'bar',
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		colors: ['var(--default)', 'var(--primary-dark)'],
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '50%',
				borderRadius: 2,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		yaxis: {
			title: {
				text: 'Number of Kids',
			},
		},
		fill: {
			opacity: 1,
		},
	});

	const kidsGenderOptions: ApexOptions = {
		chart: {
			type: 'pie',
		},
		labels: ['Girls', 'Boys'],
		colors: ['var(--primary)', 'var(--accent)'],
		legend: {
			position: 'bottom',
		},
		dataLabels: {
			textAnchor: 'middle',
		},
	};

	const [filterSchoolDueDate, setFilterSchoolDueDate] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrderValues.asc,
		search: '',
	});

	const [schoolRevenueData, setSchoolRevenueData] = useState<{ xLabel: string; yValue: number }[]>([]);
	const [startDate, setStartDate] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'));
	const [endDate, setEndDate] = useState<string>(moment().format('YYYY-MM-DD'));
	const initialDates = [moment(startDate).toDate(), moment(endDate).toDate()];
	const [dates, setDates] = useState<Nullable<(Date | null)[]>>(initialDates);

	const getDashboardDetails = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardDetails)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardDetails(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardRevenue = (filter: string) => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.dashboardRevenue}?filter=${filter}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardRevenue(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardSubscription = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardSubscriptionPlan)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setSubscriptionData(responseData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardKidsAgeGraph = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardKidsGraph)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					const girlData = responseData.girls;
					const boyData = responseData.boys;
					const chartData = [
						{
							name: 'Girls',
							data: Object.values(girlData),
						},
						{
							name: 'Boys',
							data: Object.values(boyData),
						},
					];
					setAvgAgeOptions({
						...avgAgeOptions,
						xaxis: {
							categories: Object.keys(girlData),
						},
					});

					setAvgAge(chartData as kidsAgeType[]);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	const getDashboardKidsGenderGraph = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardKidsGenderGraph)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					const chartData = [responseData.girls || 0, responseData.boys || 0];
					setKidsGender(chartData);
				} else {
					toast.error(response?.data?.message);
				}
				setLoading(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoading(false);
			});
	};

	/**
	 * Method used to fetch the school admin dashboard details
	 */
	const getDashboardSchoolAdmin = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardSchool)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardSchoolDetails(responseData);
				}
			})
			.catch((err) => toast.error(err?.response?.data?.message))
			.finally(() => setLoading(false));
	};

	/**
	 * Method used to fetch the teacher admin dashboard details
	 */
	const getDashboardTeacherAdmin = () => {
		setLoading(true);
		APIService.getData(URL_PATHS.dashboardTeacher)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data.data;
					setDashboardTeacherDetails(responseData);
				}
			})
			.catch((err) => toast.error(err?.response?.data?.message))
			.finally(() => setLoading(false));
	};

	/**
	 * Method used to fetch the school due date near by list.
	 */
	const getDashboardSchoolDueDateList = () => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.dashboardSchoolDueDate}?page=${filterSchoolDueDate.page}&limit=${filterSchoolDueDate.limit}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const responseData = response.data;
					setSchoolDueDateList(responseData);
				}
			})
			.catch((err) => toast.error(err?.response?.data?.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (schoolAdmin.adminData && !schoolAdmin.adminData?.teacherUUID) {
			getDashboardSchoolAdmin();
		} else if (schoolAdmin.adminData?.teacherUUID) {
			getDashboardTeacherAdmin();
		} else {
			getDashboardDetails();
			getDashboardRevenue('daily');
			getDashboardSubscription();
			getDashboardKidsAgeGraph();
			getDashboardKidsGenderGraph();
		}
	}, []);

	useEffect(() => {
		if (!schoolAdmin.adminData && !schoolAdmin.adminData?.teacherUUID) {
			getDashboardSchoolDueDateList();
		}
	}, [filterSchoolDueDate]);
	/**
	 * Method to handle google anlytics
	 */
	const googleAnalyticsDataHandler = useCallback((data: googleAnalyticsResponse[]) => setGoogleAnalyticsData(data), [googleAnalyticsData]);

	/**
	 * Method to handle loader for google anlytics
	 */
	const googleAnalyticsLoader = useCallback((loading: boolean) => setLoading(loading), [loading]);

	/**
	 * Method used for change dropdown for page limit
	 * @param e
	 */
	const onStudentPageDrpSelect = useCallback(
		(e: string) => {
			setFilterSchoolDueDate({ ...filterSchoolDueDate, limit: Number(e), page: DEFAULT_PAGE });
		},
		[filterSchoolDueDate]
	);

	/**
	 * Method used for on Pagination Change.
	 * @param event
	 */
	const handleStudentPageClick = useCallback(
		(event: { selected: number }) => {
			setFilterSchoolDueDate({ ...filterSchoolDueDate, page: event.selected + 1 });
		},
		[filterSchoolDueDate]
	);

	/**
	 * Method is used to handle the dates on change and set the values of startDate and endDate
	 */
	const dateRangeHandler = useCallback((e: { value: React.SetStateAction<Nullable<(Date | null)[]>> }) => {
		setDates(e.value);
		if (e.value && Array.isArray(e.value) && e.value[0] && e.value[1]) {
			setStartDate(moment(e.value[0]).format('YYYY-MM-DD'));
			setEndDate(moment(e.value[1]).format('YYYY-MM-DD'));
		}
	}, []);

	/**
	 * Method is used to fetch the school revenue data
	 */
	const getDashboardSchoolRevenue = useCallback(() => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.dashboardSchoolRevenue}?startDate=${startDate}&endDate=${endDate}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const { data } = response.data;
					setSchoolRevenueData(data);
				}
			})
			.catch((err) => toast.error(err?.response?.data?.message))
			.finally(() => setLoading(false));
	}, [startDate, endDate]);

	useEffect(() => {
		if (!schoolAdmin.adminData && !schoolAdmin.adminData?.teacherUUID && endDate) {
			getDashboardSchoolRevenue();
		}
	}, [startDate, endDate, getDashboardSchoolRevenue]);

	/**
	 *
	 * @returns Method ued to handle the width of the graph columns
	 */
	const widthHandlerForGraph = () => {
		if (schoolRevenueData.length > 10) {
			return '50%';
		}
		return '20%';
	};

	const chartOptions: ApexOptions = {
		chart: {
			type: 'bar',
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		colors: ['var(--default)'],
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: widthHandlerForGraph(),
				borderRadius: 2,
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ['transparent'],
		},
		yaxis: {
			title: {
				text: 'Revenue Earned',
			},
		},
		fill: {
			opacity: 1,
		},
		xaxis: {
			categories: schoolRevenueData?.map((data) => data?.xLabel),
		},
	};

	/**
	 * Method is used to set the series data fro school renvue graph
	 */
	const seriesData = [{ name: 'Revenue', data: schoolRevenueData?.map((data) => data?.yValue) }];

	return (
		<>
			{loading && <Loader />}
			{!schoolAdmin.adminData && (
				<div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 xl:gap-6 md:grid-cols-3 2xl:grid-cols-4'>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-green-100 text-green-500 grid place-content-center text-4xl mr-5'>
								<Man />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfUsers || 0}</span>
								<h6 className='text-gray-600'>Number of Users</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-pink-100 text-pink-500 grid place-content-center text-4xl mr-5'>
								<Child />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfKids || 0}</span>
								<h6 className='text-gray-600'>Number of Kids</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-purple-100 text-purple-500 grid place-content-center text-4xl mr-5'>
								<Document />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfTopics || 0}</span>
								<h6 className='text-gray-600'>Number of Topics</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-orange-100 text-orange-500 grid place-content-center text-4xl mr-5'>
								<Edit />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfLessons || 0}</span>
								<h6 className='text-gray-600'>Number of Lessons</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-yellow-100 text-yellow-500 grid place-content-center text-4xl mr-5'>
								<UsersAlt />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfActiveSubscriptions || 0}</span>
								<h6 className='text-gray-600'>Number of Active Subscriptions</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-teal-100 text-teal-500 grid place-content-center text-4xl mr-5'>
								<ListCheck />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfTraditionalChineseLerner || 0}</span>
								<h6 className='text-gray-600'>No. of Traditional Chinese Learner</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-lime-100 text-lime-500 grid place-content-center text-4xl mr-5'>
								<UsersAlt />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardDetails.noOfSimplifiedChineseLerner || 0}</span>
								<h6 className='text-gray-600'>No. of Simplified Chinese Learner</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-indigo-100 text-indigo-500 grid place-content-center text-4xl mr-5'>
								<Briefcase />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>$ {dashboardRevenue.noOfRevenue || 0}</span>
								<h6 className='text-gray-600'>Revenue Generated</h6>
								<select className='border rounded px-1 py-1 mt-2 ml-auto' onChange={(e) => getDashboardRevenue(e.target.value)}>
									<option value='daily'>Today</option>
									<option value='monthly'>This Month</option>
									<option value='yearly'>This Year</option>
									<option value='all'>Total</option>
								</select>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-orange-100 text-warning grid place-content-center text-4xl mr-5'>
								<CreditCard />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{schoolDueDateList?.data?.count ?? 0}</span>
								<h6 className='text-gray-600'>Pending Dues for school</h6>
							</div>
						</div>
					</div>
					<div className='mb-3 bg-white shadow-lg rounded-lg mt-8 hidden'>
						<div className='border-b p-3 flex items-center justify-between'>
							<h6 className='font-medium'>Google Analytics Report</h6>
							<GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID ?? ''}>
								<GoogleAnalyticsApp setAnalyticsData={googleAnalyticsDataHandler} setLoader={googleAnalyticsLoader} />
							</GoogleOAuthProvider>
						</div>
						<div className='p-3 overflow-auto w-full' style={{ maxHeight: '500px' }}>
							<table>
								<thead>
									<tr>
										<th scope='col'>Sr.No</th>
										<th scope='col'>Platform</th>
										<th scope='col'>Country</th>
										<th scope='col'>Active Users(1 Day)</th>
										<th scope='col'>Active Users(7 day)</th>
										<th scope='col'>Active Users(28 Day)</th>
										<th scope='col'>New Users</th>
										<th scope='col'>Total Users</th>
										<th scope='col'>App Crashes</th>
										<th scope='col'>App Stability</th>
										<th scope='col'>User Engagement Duration</th>
										<th scope='col'>Engage Session Per User</th>
									</tr>
								</thead>
								{googleAnalyticsData.length > 0 ? (
									<tbody>
										{googleAnalyticsData.map((val, idx) => (
											<tr className='bg-white border-b' key={`${idx + 1}`}>
												<td className='border px-3 py-2'>{idx + 1}</td>
												<td className='border px-3 py-2'>
													<b>{val.dimensionValues[0].value}</b>
												</td>
												<td className='border px-3 py-2'>
													<b>{val.dimensionValues[1].value}</b>
												</td>
												<td className='border px-3 py-2'>{val.metricValues[0].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[1].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[2].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[3].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[4].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[5].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[6].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[7].value}</td>
												<td className='border px-3 py-2'>{val.metricValues[8].value}</td>
											</tr>
										))}
									</tbody>
								) : (
									<tbody>
										<tr className='bg-white border-b text-center'>
											<td colSpan={12}>No Data!</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-2 lg:gap-6 xl:gap-6 lg:grid-cols-2 xl:grid-cols-2 mt-8'>
						<div className='bg-white shadow-lg rounded-lg'>
							<div className='border-b p-3 flex items-center justify-between'>
								<h6 className='font-medium'>
									School List <span className='font-light text-sm'>(Due date near by)</span>
								</h6>
								<ShowEntries onChange={onStudentPageDrpSelect} value={filterSchoolDueDate.limit} />
							</div>
							<div className='p-3 overflow-auto w-full'>
								<table>
									<thead>
										<tr>
											<th scope='col'>Name</th>
											<th scope='col'>End Date</th>
											<th scope='col'>Expired In Days</th>
										</tr>
									</thead>
									<tbody>
										{schoolDueDateList?.data?.schools?.map((val) => (
											<tr className='bg-white border-b' key={val.id}>
												<td className='border px-3 py-2'>{val.schoolName}</td>
												<td className='border px-3 py-2 w-40 text-center'>{val.paymentEndDate ? moment(val.paymentEndDate).format('MM-DD-YYYY') : ''}</td>
												<td className='border px-3 py-2 w-32 text-center'>{val.expireIn === 0 ? 'Today' : val.expireIn}</td>
											</tr>
										))}
									</tbody>
								</table>
								{!schoolDueDateList?.data?.count && <p className='text-center'>No School Found</p>}
								<Pagination length={schoolDueDateList?.data?.count ?? 0} onSelect={handleStudentPageClick} limit={filterSchoolDueDate.limit} />
							</div>
						</div>
						<div className='bg-white shadow-lg rounded-lg '>
							<div className='border-b p-3 flex items-center justify-between'>
								<h6 className='font-medium'>School Revenue</h6>
								<div>
									<Calendar value={dates} selectionMode='range' onChange={dateRangeHandler} placeholder='Select Dates' readOnlyInput hideOnRangeSelection showIcon maxDate={new Date()} />
								</div>
							</div>
							<div className='p-3 overflow-auto w-full items-center flex grow'>
								<div className='w-full'>
									<ReactApexChart options={chartOptions} series={seriesData} type='bar' height={350} />
								</div>
							</div>
						</div>
					</div>
					<div className='mb-3 bg-white shadow-lg rounded-lg mt-8'>
						<div className='border-b p-3 flex items-center justify-between'>
							<h6 className='font-medium'>Subscription Plans</h6>
						</div>
						<div className='p-3 overflow-auto w-full'>
							<table>
								<thead>
									<tr>
										<th scope='col'>Plans</th>
										<th scope='col' colSpan={2}>
											Counts
										</th>
									</tr>
								</thead>
								<tbody>
									{subscriptionData.planList.map((val: planListType) => (
										<tr className='bg-white border-b' key={val.id}>
											<td className='border px-3 py-2'>{val.planName}</td>
											<td className='border px-3 py-2' colSpan={2}>
												{val.value ?? 0}
											</td>
										</tr>
									))}
								</tbody>
								<tfoot>
									<tr>
										<td className='border px-3 py-2'>
											<b>User having subscription for current month</b>
										</td>
										<td className='border px-3 py-2' colSpan={2}>
											<b>{subscriptionData.subscriptionForMonth}</b>
										</td>
									</tr>
									<tr>
										<td className='border px-3 py-2'>
											<b>User having subscription for current year</b>
										</td>
										<td className='border px-3 py-2' colSpan={2}>
											<b>{subscriptionData.subscriptionForYear}</b>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-2 lg:gap-6 xl:gap-6 lg:grid-cols-2 xl:grid-cols-2 mt-8'>
						<div className='bg-white shadow-lg rounded-lg flex flex-col'>
							<div className='border-b p-3 flex items-center justify-between'>
								<h6 className='font-medium'>Kids Age</h6>
							</div>
							<div className='p-3 overflow-auto w-full items-center flex grow'>
								<div className='w-full'>{avgAgeOptions.xaxis && <ReactApexChart options={avgAgeOptions} series={avgAge} type='bar' width={'100%'} height={350} />}</div>
							</div>
						</div>
						<div className='bg-white shadow-lg rounded-lg flex flex-col'>
							<div className='border-b p-3 flex items-center justify-between'>
								<h6 className='font-medium'>Kids Gender</h6>
							</div>
							<div className='p-3 overflow-auto w-full items-center flex grow'>
								<div className='w-full'>{kidsGender?.length && <ReactApexChart options={kidsGenderOptions} series={kidsGender} type='pie' width={'100%'} height={350} />}</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{schoolAdmin.adminData && !schoolAdmin.adminData?.teacherUUID && (
				<div>
					<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6 '>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-green-100 text-green-500 grid place-content-center text-4xl mr-5'>
								<Child />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardSchoolDetails.noOfKids || 0}</span>
								<h6 className='text-gray-600'>Number of kids</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-pink-100 text-pink-500 grid place-content-center text-4xl mr-5'>
								<User />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardSchoolDetails.noOfTeacher || 0}</span>
								<h6 className='text-gray-600'>Number of Teachers</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-purple-100 text-purple-500 grid place-content-center text-4xl mr-5'>
								<ListCheck />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardSchoolDetails.noOfClassRooms || 0}</span>
								<h6 className='text-gray-600'>Number of Classrooms</h6>
							</div>
						</div>
					</div>
				</div>
			)}
			{schoolAdmin.adminData?.teacherUUID && (
				<div>
					<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6 '>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-green-100 text-green-500 grid place-content-center text-4xl mr-5'>
								<UsersAlt />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardTeacherDetails.noOfStudents || 0}</span>
								<h6 className='text-gray-600'>Number of Students</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-purple-100 text-purple-500 grid place-content-center text-4xl mr-5'>
								<Document />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardTeacherDetails.noOfTopics || 0}</span>
								<h6 className='text-gray-600'>Number of Topics</h6>
							</div>
						</div>
						<div className='p-5 bg-white flex items-center border-primary rounded-xl shadow-lg'>
							<div className='icon h-20 w-20 rounded-full bg-orange-100 text-orange-500 grid place-content-center text-4xl mr-5'>
								<Edit />
							</div>
							<div>
								<span className='font-bold text-black text-4xl'>{dashboardTeacherDetails.noOfLessons || 0}</span>
								<h6 className='text-gray-600'>Number of Lessons</h6>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default Dashboard;
