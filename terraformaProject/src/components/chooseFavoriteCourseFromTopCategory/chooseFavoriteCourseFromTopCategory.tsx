import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import UpdatedHeader from '@components/header/updatedHeader';
import { AngleRight, Composter, Search } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { GET_CATEGORIES_AND_COURSE_COUNT_WITH_PAGINATION } from '@framework/graphql/queries/category';
import { DropdownOptionType } from '@types';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import TextInput from '@components/textInput/TextInput';

interface CategoriesProps {
	slider: boolean;
}

interface PaginationParams {
	search: string,
	page: number,
	limit: number,
}

interface CategoryData {
	course_count: number,
	description : string,
	image_url : string, 
	name : string,
	status : number,
	uuid : string,
}

const ChooseFavoriteCourseFromTopCategory = ({ slider }: CategoriesProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { data: categoryData, refetch, loading } = useQuery(GET_CATEGORIES_AND_COURSE_COUNT_WITH_PAGINATION, { variables: { limit: 8, page: 1, search: '' } });
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [isTempData, setIsTempData] = useState<any[]>([]);
	const [filterData, setFilterData] = useState<PaginationParams>({
		search: '',
		page: 1,
		limit: 8,
	});

	const viewMore = () => {
		setOnViewMore(true);
		setFilterData({
			...filterData,
			page: filterData.page + 1,
		});
	}

	useEffect(() => {
		const tempDataArr: DropdownOptionType[] = [];
		categoryData?.getCategoriesAndCourseCountWithPagination?.data?.categories?.map((data: CategoryData) => {
			tempDataArr.push(data);
		});
		if (onViewMore) {
			setIsTempData([...isTempData, ...tempDataArr]);
			setOnViewMore(onViewMore ?? !onViewMore);
		} else {
			setIsTempData(tempDataArr);
		}
	}, [categoryData]);

	useEffect(() => {
		const fetchData = async () => {
			setIsRefetching(true);
			try {
				await refetch({
					 ...filterData }
				);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				toast.error(error?.networkError?.result?.errors?.[0]?.message)
			} finally {
				setIsRefetching(false);
				setOnViewMore(onViewMore ?? !onViewMore);
			}
		};
		if (filterData) {
			fetchData();
		}
	}, [filterData]);

	const onView = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.categoriesList}`);
	}, []);

	const onViewAllProducts = useCallback((id: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.allCourseByCategory}/?category_uuid=${id}`);
	}, []);

	/**
	 *  @param e Method used for store search value
	 */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterData({ ...filterData, search: e.target.value })
    }, [filterData])

	return (
		<>
			{!slider && <UpdatedHeader />}
			<div className='mb-7'>
				<div className='p-5 border border-solid border-border-primary rounded-xl'>
					{slider && <div className="flex flex-wrap justify-between gap-3 mb-5">
						<h6>{t('Choose Favourite Course from top Category')}</h6>
						<Button className='btn btn-normal bg-primary text-white text-xs w-full sm:w-[80px] h-[36px] whitespace-nowrap' label={t('View All')} type='button' onClick={() => onView()} title={`${t('View All')}`}/>
					</div>}

					{!slider && <div className="flex flex-wrap justify-between gap-3 mb-5">
						<h6>{t('All top categories')}</h6>
						<TextInput placeholder={t('Search')} type='text' id='table-search' value={filterData.search} onChange={handleChange} inputIcon={<Search fontSize='18' />} />
					</div>}

					<div className="flex flex-wrap items-start justify-center gap-5 sm:justify-start">
						{isTempData?.map((data: { name: string, uuid: string }, index: number) => (
							<div className='w-full 2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border border-solid border-border-primary rounded-xl h-full flex justify-between items-center p-5 gap-2 cursor-pointer' key={`${index + 1}`} onClick={() => onViewAllProducts(data?.uuid)}>
								<div className="flex items-center gap-5">
									<div className='w-[60px] h-[60px] min-w-[60px] min-h-[60px] rounded-full bg-primary text-xl-30 flex justify-center items-center'>
										<Composter className='fill-white' />
									</div>
									<span className='font-semibold leading-5 break-all'>{data?.name}</span>
								</div>
								<span className='text-base'><AngleRight className='min-w-[16px]' /></span>
							</div>
						))}
					</div>

					{!slider && <div className="flex items-center justify-center my-6">
						<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isRefetching || (categoryData?.getCategoriesAndCourseCountWithPagination?.data?.count === isTempData?.length)} title={`${isRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
					</div>}

				</div>
			</div>
		</>
	);
};
export default ChooseFavoriteCourseFromTopCategory;
