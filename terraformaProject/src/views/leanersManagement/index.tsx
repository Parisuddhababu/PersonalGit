import React, { ChangeEvent, ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Pagination from '@components/Pagination/Pagination';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { ArrowSortingDown, ArrowSortingUp, Filter, GetDefaultIcon } from '@components/icons/icons';
import { COURSE_STATUS, COURSE_STATUS_NUMBER, DrpUserType, PAGE_LIMIT, PAGE_NUMBER, SHOW_PAGE_COUNT_ARR, STATUS_DRP_LEARNERS, UserTypesLearners, } from '@config/constant';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ColArrType } from '@types';
import { FETCH_LEARNERS } from '@framework/graphql/queries/learnersManagement';
import { FilterLearnerValueType, LearnerData, PaginationParamsCourselearners } from 'src/types/learnersManagement';
import { ASSIGN_USER_COURSE } from '@framework/graphql/mutations/learnerManagement';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSearchParams } from 'react-router-dom';
import Loader from '@components/common/loader';
import TextInput from '@components/textInput/TextInput';
import DropDown from '@components/dropdown/dropDown';
import { GET_ALL_LOCATIONS } from '@framework/graphql/queries/location';
import { useFormik } from 'formik';


const CourseLeanersList = (): ReactElement => {
    const { t } = useTranslation();
    const [queryParams] = useSearchParams();
    const courseId = queryParams.get('course_uuid');
    const [openFilterLearner, setOpenFilterLearner] = useState<boolean>(false);
    const [filterLearnerData, setFilterLearnerData] = useState<PaginationParamsCourselearners>({
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
        location: '',
        sortOrder: 'descend',
        sortField: 'createdAt',
        course_status: null,
        user_type: null,
        user_name: '',
        index: 0
    });
    const [learnerId, setLearnerId] = useState<string[]>([]);
    const [selectedAll, setSelectedAll] = useState<boolean>(false);
    const { data: locations } = useQuery(GET_ALL_LOCATIONS);
    const { data: courseLearnersList, refetch: getCourseLearnerList, loading: learnerListLoader } = useQuery(FETCH_LEARNERS, {
        fetchPolicy: 'network-only',
        variables: {
            inputData: {
                limit: PAGE_LIMIT,
                page: PAGE_NUMBER,
                location: '',
                sortOrder: 'descend',
                sortField: 'createdAt',
                course_status: null,
                user_type: null,
                user_name: '',
                course_id: courseId
            },
            skip: !courseId
        },
    });
    const [assignCourse, { loading }] = useMutation(ASSIGN_USER_COURSE);
    const COL_ARR_LEARNER = [
        { name: t('Sr.No'), sortable: false },
        { name: t('Name of Learner'), sortable: true, fieldName: 'first_name' },
        { name: t('User Type'), sortable: true, fieldName: 'user_type' },
        { name: t('Location'), sortable: true, fieldName: 'location' },
        { name: t('Status'), sortable: true, fieldName: 'course_status' },
    ] as ColArrType[];


    const initialValues: FilterLearnerValueType = {
        user_name: '',
        location: '',
        status: '',
        user_type: ''
    }

    const formik = useFormik({
        initialValues,
        onSubmit() {
            //
        }
    });

    /**
     * Method used set header content
     * @returns reactElement
     */
    const headerActionConstLearner = () => {
        return (
            <>
                <Button className={` ${openFilterLearner ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilterLearner(!openFilterLearner)} title='Filter'>
                    <Filter />
                </Button>
            </>
        )
    }

    /**
     *
     * @param sortFieldName Method used for storing sort data
     */
    const onHandleSortCreator = (sortFieldName: string) => {
        const updatedFilterLearnerData = {
            ...filterLearnerData,
            location: formik.values?.location,
            user_name: formik.values?.user_name,
            user_type: +formik.values?.user_type,
            course_status: +formik.values?.status,
            sortField: sortFieldName,
            sortOrder: filterLearnerData.sortOrder === 'ascend' ? 'descend' : 'ascend',
        }
        setFilterLearnerData(updatedFilterLearnerData);
    };

    const totalLearner = courseLearnersList?.getUsersWithStatusForCourse?.data?.count;
    const totalLearnerPages = Math.ceil(totalLearner / filterLearnerData?.limit);

    /**
     * Method used for page chage
     */
    const handlePageChangeLearner = useCallback((newPage: number): void => {
        const updatedFilterLearnerData = {
            ...filterLearnerData,
            location: formik.values?.location,
            user_name: formik.values?.user_name,
            user_type: +formik.values?.user_type,
            course_status: +formik.values?.status,
            page: newPage,
            index: (newPage - 1) * filterLearnerData.limit,
        };
        setFilterLearnerData(updatedFilterLearnerData);
    }, [filterLearnerData?.limit])

    /**
     * Method used select number of records to show
     * @param e 
     */
    const handlePageDropselectLearner = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = Number(e?.target?.value);
        const updatedFilterLearnerData = {
            ...filterLearnerData,
            location: formik.values?.location,
            user_name: formik.values?.user_name,
            user_type: +formik.values?.user_type,
            course_status: +formik.values?.status,
            limit: limit,
            page: 1,
            index: 0
        }
        setFilterLearnerData(updatedFilterLearnerData);
    }

    useEffect(() => {
        const updatedFilterLearnerData = {
            inputData: {
                limit: filterLearnerData?.limit,
                page: filterLearnerData?.page,
                sortOrder: filterLearnerData?.sortOrder,
                sortField: filterLearnerData?.sortField,
                course_id: courseId,
                location: formik.values?.location,
                user_name: formik.values?.user_name,
                user_type: +formik.values?.user_type,
                course_status: +formik.values?.status
            }
        }
        getCourseLearnerList(updatedFilterLearnerData).then((res) => {
            if (selectedAll) {
                setLearnerId((prev) => { return [...prev, ...res?.data?.getUsersWithStatusForCourse?.data?.data?.map((data: { user_uuid: string }) => data?.user_uuid)] })
            }
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }, [filterLearnerData])

    /**
     * Method used to set filterLearnerdata
     */
    const onSearchLearner = useCallback(() => {
        const updateFilter = {
            ...filterLearnerData,
            location: formik.values?.location,
            user_name: formik.values?.user_name,
            user_type: +formik.values?.user_type,
            course_status: +formik.values?.status
        }
        setFilterLearnerData(updateFilter)
    }, [filterLearnerData, formik]);

    /**
     * Methos used to change status of learner
     */
    const onStatusLearner = useCallback((id: string, type: 'All' | 'Single') => {
        if (learnerId?.includes(id) && type === 'Single') {
            setLearnerId(learnerId.filter((learnerId) => learnerId !== id));
            setSelectedAll(false);
        }
        else if (!selectedAll && type === 'All') {
            setLearnerId(courseLearnersList?.getUsersWithStatusForCourse?.data?.data?.map((data: { user_uuid: string }) => data?.user_uuid))
            setSelectedAll(true);
        } else if (selectedAll && type === 'All') {
            setLearnerId([]);
            setSelectedAll(false)
        }
        else {
            setLearnerId((prev) => [...prev, id]);
        }
    }, [learnerId, selectedAll, courseLearnersList?.getUsersWithStatusForCourse]);

    const handleChangeStatus = () => {
        if (learnerId.length) {
            assignCourse({
                variables: {
                    userCourseData: {
                        course_id: courseId,
                        is_assign_course_to_all: selectedAll,
                        user_ids: selectedAll ? [] : learnerId,
                        sortOrder: filterLearnerData?.sortOrder,
                        sortField: filterLearnerData?.sortField,
                        location: formik.values?.location,
                        user_name: formik.values?.user_name,
                        user_type: +formik.values?.user_type,
                        course_status: +formik.values?.status
                    }
                }
            }).then((res) => {
                toast.success(res?.data?.assignUserCourse?.message);
                const updatedFilterLearnerData = {
                    inputData: {
                        limit: filterLearnerData?.limit,
                        page: filterLearnerData?.page,
                        sortOrder: filterLearnerData?.sortOrder,
                        sortField: filterLearnerData?.sortField,
                        course_id: courseId,
                        location: formik.values?.location,
                        user_name: formik.values?.user_name,
                        user_type: +formik.values?.user_type,
                        course_status: +formik.values?.status
                    }
                }
                getCourseLearnerList(updatedFilterLearnerData).catch((err) => {
                    toast.error(err?.networkError?.result?.errors[0]?.message);
                })
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
    }


    /**
     * Method used to reset the filter
     */
    const onResetCourseFilter = useCallback(() => {
        formik.resetForm();
        const updateFilter = {
            ...filterLearnerData,
            location: formik.values?.location,
            user_name: formik.values?.user_name,
            user_type: +formik.values?.user_type,
            course_status: +formik.values?.status
        }
        setFilterLearnerData(updateFilter);
        setSelectedAll(false);
    }, []);

    return (
        <>
            <UpdatedHeader headerActionConst={headerActionConstLearner} />
            <div>
                {openFilterLearner &&
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
                            <div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
                                <TextInput value={formik.values.user_name} placeholder={'Name of Learner'} type='text' id='user_name' name='user_name' onChange={formik.handleChange} />
                            </div>
                            <DropDown value={formik.values.user_type} placeholder={'User Type'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='user_type' id='user_type' onChange={formik.handleChange} options={DrpUserType} />
                            <DropDown value={formik.values.location} placeholder={'Location'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='location' id='location' onChange={formik.handleChange} options={locations?.getLocations?.data?.map((loc: { location: string }) => { return { name: loc.location, key: loc.location } })} />
                            <DropDown value={formik.values.status} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)] -mt-2' label='' name='status' id='status' onChange={formik.handleChange} options={STATUS_DRP_LEARNERS} />
                            <Button type='button' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Search'} onClick={() => onSearchLearner()} />
                            <Button type='button' className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={'Reset'} onClick={onResetCourseFilter} />
                        </div>
                    </form>}
                <div className='bg-white rounded-xl overflow-auto border border-[#c8ced3] p-3 md:p-5'>
                    <div className='flex flex-col justify-between gap-3 mb-3 md:gap-5 md:mb-5 btn-group md:flex-row'>
                        <h6 className='w-full leading-7 xmd:w-auto'>{t('Learners List')}</h6>
                    </div>
                    <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                        <table>
                            <thead >
                                <tr>
                                    <th className='text-center'>
                                        <input
                                            type='checkbox'
                                            className='checkbox cursor-pointer disabled:bg-light-gray'
                                            id={'All'}
                                            title='Select All'
                                            checked={selectedAll}
                                            onChange={() => onStatusLearner('', 'All')}
                                            disabled={!courseLearnersList?.getUsersWithStatusForCourse?.data?.data?.length}
                                        />
                                    </th>
                                    {COL_ARR_LEARNER?.map((colValUser: ColArrType, num: number) => {
                                        const key = colValUser.fieldName + num;
                                        return (
                                            <th scope='col' key={key}>
                                                <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                    {colValUser.name}
                                                    {colValUser.sortable && (
                                                        <button onClick={() => onHandleSortCreator(colValUser.fieldName)}>
                                                            {(filterLearnerData.sortOrder === '' || filterLearnerData.sortField !== colValUser.fieldName) &&
                                                                <GetDefaultIcon className='w-3 h-3 ml-1 fill-white' />}
                                                            {filterLearnerData.sortOrder === 'ascend' && filterLearnerData.sortField === colValUser.fieldName &&
                                                                <ArrowSortingUp className="ml-1 fill-white" />}
                                                            {filterLearnerData.sortOrder === 'descend' && filterLearnerData.sortField === colValUser.fieldName &&
                                                                <ArrowSortingDown className="ml-1 fill-white" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {courseLearnersList?.getUsersWithStatusForCourse?.data?.data?.map((learner: LearnerData, index: number) => {
                                    const srNumber = filterLearnerData?.index + index + 1;
                                    return <tr key={learner.user_uuid}>
                                        <td className='text-center'>
                                            <input
                                                type='checkbox'
                                                className='checkbox '
                                                id={`${learner?.user_uuid}`}
                                                checked={learnerId?.includes(learner?.user_uuid) || learner?.status != 4 || selectedAll}
                                                onChange={() => onStatusLearner(learner?.user_uuid, 'Single')}
                                            />
                                        </td>
                                        <td scope='row' className='text-center'>
                                            {srNumber}
                                        </td>
                                        <td className='text-left'>{learner.first_name + ' ' + learner.last_name}</td>
                                        <td className='text-left'>{UserTypesLearners?.[learner.user_type]}</td>
                                        <td className='text-left'>{learner.subscriber_branch_name}</td>
                                        <td className='text-center'>
                                            <div className='flex justify-center btn-group'> <span className={`${(+learner?.status === COURSE_STATUS_NUMBER.ASSIGNED) || (+learner?.status === COURSE_STATUS_NUMBER.IN_PROGRESS) || (+learner?.status === COURSE_STATUS_NUMBER.COMPLETED) ? 'text-success' : 'text-error'}`}>{COURSE_STATUS?.[`${learner.status}`]}</span></div>
                                        </td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                        {learnerListLoader && <div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center '>
                            <div className='text-xl'><Loader /></div>
                        </div>}
                        {(courseLearnersList?.getUsersWithStatusForCourse?.data?.count === 0 ||
                            courseLearnersList?.getUsersWithStatusForCourse?.data?.data === null) && (
                                <div className='flex justify-center'>
                                    <div>{t('No Data')}</div>
                                </div>
                            )}
                    </div>
                    <div className='flex flex-wrap items-center mt-2'>
                        <div className='flex items-center mr-3 md:mr-7'>
                            <span className='text-sm font-normal text-gray-700 whitespace-nowrap '>
                                {t('Per Page')}
                            </span>
                            <select value={filterLearnerData.limit} onChange={handlePageDropselectLearner} className='border border-border-primary rounded-xl ml-2 px-3 text-sm py-1.5 text-gray-500 w-[70px] h-[36px] appearance-none bg-white'>
                                {SHOW_PAGE_COUNT_ARR?.map((item: number) => {
                                    return <option key={item}>{item}</option>;
                                })}
                            </select>
                        </div>
                        <Pagination currentPage={filterLearnerData.page}
                            totalPages={totalLearnerPages}
                            onPageChange={handlePageChangeLearner}
                            recordsPerPage={filterLearnerData?.limit}
                        />
                    </div>
                </div>
                <div className='flex justify-end m-9'>
                    <button className='btn btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' onClick={handleChangeStatus} disabled={loading || !learnerId?.length} title={`${t('Submit')}`}  >
                        {loading ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : t('Submit')}
                    </button>
                </div>
            </div>
        </>
    )
}
export default CourseLeanersList;