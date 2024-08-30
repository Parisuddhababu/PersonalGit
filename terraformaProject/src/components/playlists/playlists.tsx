import { PlayIcon, PlayIcon2, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@assets/images/login-img.jpg';
import Button from '@components/button/button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { useQuery } from '@apollo/client';
import { GET_PLAYLIST_DATA } from '@framework/graphql/queries/getCourses';
import { DropdownOptionType, PaginationParams } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { toast } from 'react-toastify';
import CreateNewPlaylist from './createNewPlaylist';
import { useSelector } from 'react-redux';
import { UserRoles } from 'src/types/common';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';

type PlaylistsProps = {
	slider: boolean
};

type PlaylistData = {
	name: string,
	uuid: string,
	logo?: string,
	courseCount?: string,
	course_count?: number,
	image: string
}

const Playlists = ({ slider }: PlaylistsProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	const [playList, setPlayList] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [isTemplateData, setIsTemplateData] = useState<any[]>([]);
	const { data: getAllPlaylistData, refetch, loading } = useQuery(GET_PLAYLIST_DATA, { variables: { limit: 8, page: 1, sortField: 'createdAt', sortOrder: 'descend', search: '' } });
	const [filterData, setFilterData] = useState<PaginationParams>({ limit: 8, page: 1, sortField: 'createdAt', sortOrder: 'descend', search: '' });

	const settings = {
		dots: false,
		infinite: false,
		arrows: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 4,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					initialSlide: 3,
				}
			},
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,

				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1,

				}
			}
		]
	};

	const courseDetailsPage = useCallback((id: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.allPlayListCourse}/?playlist_id=${id}`)
	}, [])

	useEffect(() => {
		const tempDataArr: DropdownOptionType[] = [];
		getAllPlaylistData?.getPlayLists?.data?.playlists?.map((data: PlaylistData) => {
			tempDataArr.push(data);
		});
		if (onViewMore) {
			setIsTemplateData((prev) => {
				return [...prev, ...tempDataArr]
			});
			setOnViewMore(onViewMore ?? !onViewMore);
		} else {
			setIsTemplateData(tempDataArr);
		}
	}, [getAllPlaylistData]);

	/**
   *
   * @param e Method used for store search value
   */
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, search: e.target.value })
	}, [filterData])

	useEffect(() => {
		const fetchData = async () => {
			setIsRefetching(true);
			try {
				await refetch({ ...filterData });
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

	const viewMore = () => {
		setOnViewMore(true);
		setFilterData({
			...filterData,
			page: filterData.page + 1,
		});
	}

	const onAddPlayList = () => {
		setPlayList(true);
	}

	const { templates } = useSelector(((state: { rolesManagement: { templates: UserRoles } }) => state.rolesManagement));

	const headerActionConst = () => {
		return (
			<>
				{templates?.write &&
					<Button className='border-primary border btn-secondary btn ml-auto mr-2 px-6' type='button' label={'Create new playlist'} onClick={() => onAddPlayList()} />
				}
			</>
		)
	}

	const playListCallBack = useCallback((data: boolean, getRefetchData: { refetch: boolean }) => {
		setPlayList(data);
		if (getRefetchData?.refetch) {
			refetch();
		}
	}, [])

	return (
		<>
			{!slider && <UpdatedHeader headerTitle='Manage Course Playlists' headerActionConst={headerActionConst} />}
			<div className='p-5 border border-solid border-border-primary rounded-xl'>
				<div className="flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5">
					<h6>{t('All Playlists')}</h6>
					{slider && <Button className='btn btn-normal bg-primary text-white text-xs w-full sm:w-[80px] h-[36px] whitespace-nowrap' label={t('View All')} type='button' onClick={() => navigate(`/${ROUTES.app}/${ROUTES.playlist}`)} title={`${t('View All')}`} />}
					{!slider && <TextInput placeholder={t('Search')} type='text' id='table-search' value={filterData.search} onChange={handleChange} inputIcon={<Search fontSize='18' />} />}
				</div>

				{!slider &&
					<div className="flex flex-wrap justify-center gap-5 sm:justify-start">
						{getAllPlaylistData?.getPlayLists?.data?.count > 0 ? <>
							{isTemplateData?.map((data: PlaylistData) => (
								<div onClick={() => courseDetailsPage(data.uuid)} className='2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border-border-primary rounded-xl w-full relative flex flex-col rounded-t-xl' key={data.uuid}>
									<picture className='w-full h-[200px] block'>
										<img src={(!data?.image||data?.image==='') ? logo:process.env.REACT_APP_IMAGE_BASE_URL + '/' + data?.image} alt="image" title='image' className='object-cover w-full h-full rounded-t-xl' />
									</picture>
									<div className="flex items-start justify-between w-full gap-2 p-5 border-b border-solid border-x border-border-primary rounded-b-xl">
										<span className='font-bold leading-5 break-words max-w-[190px]'>{data.name}</span>
										<div className="flex items-center min-w-[105px]">
											<span className='text-xl-22'><PlayIcon2 className='pt-1 fill-secondary' /></span>
											<span>{`${data?.course_count} Courses`}</span>
										</div>
									</div>
									<div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full transition duration-300 ease-in-out opacity-0 rounded-xl bg-playlist hover:opacity-100 hover:transition hover:duration-300 hover:ease-in-out hover:cursor-pointer'>
										<Button type='button' label='' className='bg-white w-[60px] h-[60px] rounded-full text-center p-2.5 block mb-2.5 play-btn' title={`${t('Play')}`}><span className='text-xl-40'><PlayIcon className='fill-secondary' /></span></Button>
										<span className='text-sm leading-5 text-white'>View All Courses</span>
									</div>
								</div>
							))}
						</> : <div>No Records Found!!!</div>}
					</div>
				}

				{!slider && <div className="flex items-center justify-center my-6">
					<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isRefetching || (getAllPlaylistData?.getPlayLists?.data?.count === isTemplateData?.length)} title={`${isRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
				</div>}

				{slider && <Slider {...settings}>
					{getAllPlaylistData?.getPlayLists?.data?.count > 0 && isTemplateData?.map((data: PlaylistData) => (
						<div className="px-2 5" key={data?.uuid} onClick={() => courseDetailsPage(data.uuid)}>
							<div className='relative w-full h-full border-border-primary rounded-t-xl' key={data?.uuid}>
								<picture className='w-full h-[200px] block'>
									<img src={(!data?.image||data?.image==='') ? logo: process.env.REACT_APP_IMAGE_BASE_URL + '/' + data?.image} alt="image" title='image' className='object-cover w-full h-full rounded-t-xl' />
								</picture>
								<div className="flex items-start justify-between w-full gap-2 p-5 border-b border-solid border-x border-border-primary rounded-b-xl">
									<span className='font-bold leading-5 break-words max-w-[190px]'>{data.name}</span>
									<div className="flex items-center min-w-[105px]">
										<span className='text-xl-22'><PlayIcon2 className='pt-1 fill-secondary' /></span>
										<span>{`${data?.course_count} Courses`}</span>
									</div>
								</div>

								<div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full transition duration-300 ease-in-out opacity-0 rounded-xl bg-playlist hover:opacity-100 hover:transition hover:duration-300 hover:ease-in-out hover:cursor-pointer'>
									<Button type='button' label='' className='bg-white w-[60px] h-[60px] rounded-full text-center p-2.5 block mb-2.5 play-btn'><span className='text-xl-40'><PlayIcon className='fill-secondary' /></span></Button>
									<span className='text-sm leading-5 text-white'>View All Courses</span>
								</div>
							</div>
						</div>
					))}
				</Slider>}
			</div>

			<CreateNewPlaylist playListCallBack={playListCallBack} playList={playList} />
		</>
	);
};
export default Playlists;
