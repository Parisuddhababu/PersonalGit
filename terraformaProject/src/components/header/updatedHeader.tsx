/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '@components/breadcrumb/breadcrumb';
import { HamburgerMenu } from '@components/icons/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setShow } from 'src/redux/courses-management-slice';

interface UpdatedHeaderProps {
	headerActionConst?: any,
	headerTitle?: string,
}

const UpdatedHeader = ({ headerActionConst, headerTitle }: UpdatedHeaderProps) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { show } = useSelector(((state: { coursesManagement: { show: boolean } }) => state.coursesManagement));

	const location = useLocation();
	/**method that coverts the path name as our desired way  */
	const moduleName = (pathname: string) => {
		let modulePath = '';
		if (pathname.split('/')[2].includes('-')) {
			const path = pathname.split('/')[2].split('-');
			path.forEach((i: string) => {
				modulePath = modulePath + i[0].toUpperCase() + i.slice(1) + ' ';
				return modulePath;
			});
			return modulePath;
		} else {
			modulePath = pathname.split('/')[2][0].toUpperCase() + pathname.split('/')[2].slice(1);
			return modulePath;
		}
	};

	const onRenderJsxElement = () => {
		if (headerActionConst) {
			return (headerActionConst())
		}
	}

	const OnClickHandler = useCallback(() => {
		dispatch(setShow(!show))
	}, [show]);

	return (
		<header className='sticky top-0 z-20 flex bg-white border-b shadow-header xl:shadow-none xl:h-auto xl:block border-border-primary xl:px-2 xl:pt-0'>
			<div onClick={OnClickHandler} className='pt-5 cursor-pointer text-xl-22 xl:hidden'>
				<HamburgerMenu className='ml-4' />
			</div>
			<div className='p-2.5 xl:p-[18px] xl:shadow-header max-xl:w-[calc(100%-47px)]'>
				<div className='flex flex-wrap items-center justify-between gap-2.5'>
					<div className='w-full xl:w-auto'>
						<h1 className='mb-1 text-2xl max-xl:truncate xl:text-3xl'>{t(headerTitle ?? moduleName(location.pathname))}</h1>
						<Breadcrumb />
					</div>
					{headerActionConst &&
						<div className='flex gap-2.5 max-xl:w-[calc(100%+40px)] lg:gap-5'>
							{onRenderJsxElement()}
						</div>
					}
				</div>
			</div>
		</header>
	);
};

export default UpdatedHeader;
