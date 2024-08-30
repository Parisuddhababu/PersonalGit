import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useParams } from 'react-router-dom';

import { ROUTES, USER_TYPE } from '@config/constant';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';
import { NavlinkReturnFunction } from '@utils/helpers';

const Breadcrumb = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const uuid = queryParams.get('uuid');
	const { id } = useParams();
	const { userProfileData } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType; } }) => state.userProfile,
	);
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';

	

	/**method that coverts the path name as our desired way  */
	const moduleName = (pathname: string) => {
		let modulePath = '';
		if (pathname.split('/')[2]?.includes('-')) {
			const path = pathname.split('/')[2].split('-');
			path.forEach((i: string) => {
				modulePath = modulePath + i[0]?.toUpperCase() + i.slice(1) + ' ';
				return modulePath;
			});
			return modulePath;
		} else {
			modulePath = pathname.split('/')[2][0]?.toUpperCase() + pathname.split('/')[2].slice(1);
			return modulePath;
		}
	};

	const thirdLevelLink = (data: string) => {
		let modulePath = '';
		if (data?.includes('-')) {
			modulePath = data?.replace(/-|\s/g, ' ');
			const splitPathName = modulePath.split(' ');
			for (let i = 0; i < splitPathName.length; i++) {
				splitPathName[i] = splitPathName[i][0].toUpperCase() + splitPathName[i].substring(1); // Use substring instead of substr
			}
			modulePath = splitPathName.join(' ');
			return modulePath;
		} else {
			modulePath = data?.[0]?.toUpperCase() + (data?.slice(1)) + ' '; // Using slice as you did previously
			return modulePath;
		}
	}

	const removeID = (data: string) => {
		let modulePath = '';
		if (data?.includes('-')) {
			return modulePath;
		} else {
			modulePath = data?.[0]?.toUpperCase() + (data?.slice(1)) + ' ';
			return modulePath;
		}
	}

	const urlArray = location.pathname.split('/');

	const breadcrumbLinks = useCallback(() => {
		if (urlArray?.length > 0) {
			const length = urlArray?.length
			if (length < 4) {
				return (
					<span className='text-primary'>
						{urlArray[2] && `${t(thirdLevelLink(urlArray[2]))}`}
					</span>
				)
			}
			if (length < 5) {
				if (urlArray[3] !== '') {
					if (urlArray[3].length > 32) {
						return (
							<>
								{removeID(urlArray[3]) && <span className='text-primary'>
									<NavLink to={`/${ROUTES.app}/${urlArray[2]}`} className='text-light-grey hover:underline'>{`${t(moduleName(location.pathname))}`}</NavLink>
								</span>}
								{removeID(urlArray[3]) && <span className='mx-2 text-light-grey'>
									{'>'}
								</span>}
								{!removeID(urlArray[3]) &&
									<span className='text-primary'>
										{urlArray[2] && `${t(thirdLevelLink(urlArray[2]))}`}
									</span>
								}
								<span className='text-primary'>
									{urlArray[3] && `${t(removeID(urlArray[3]))}`}
								</span>
							</>
						)
					} else {
						return (
							<>
								<span className='text-primary'>
									<NavLink to={`/${ROUTES.app}/${urlArray[2]}`} className='text-light-grey hover:underline'>{`${t(moduleName(location.pathname))}`}</NavLink>
								</span>
								<span className='mx-2 text-light-grey'>
									{'>'}
								</span>
								<span className='text-primary'>
									{urlArray[3] && `${t(thirdLevelLink(urlArray[3]))}`}
								</span>
							</>
						)
					}
				} else {
					return (
						<span className='text-primary'>
							{urlArray[2] && `${t(thirdLevelLink(urlArray[2]))}`}
						</span>
					)
				}
			}
			if (length < 6) {
				return (
					<>
						<span className='text-primary'>
							<NavLink to={`/${ROUTES.app}/${urlArray[2]}`} className='text-light-grey hover:underline'>{`${t(moduleName(location.pathname))}`}</NavLink>
						</span>
						<span className='mx-2 text-light-grey'>
							{'>'}
						</span>
						<span className='text-primary'>
							{urlArray[3] && `${t(thirdLevelLink(urlArray[3]))}`}
						</span>
					</>
				)
			}
			if (length < 7) {
				let uuidData = ''
				if (uuid) {
					uuidData = `?uuid=${uuid}`;
				} else if (id) {
					uuidData = `?uuid=${id}`;
				}
				return (
					<>
						<span className='text-primary'>
							<NavLink to={`/${ROUTES.app}/${urlArray[2]}`} className='text-light-grey hover:underline'>{t(thirdLevelLink(urlArray[2]))}</NavLink>
						</span>
						<span className='mx-2 text-light-grey'>
							{'>'}
						</span>
						<span className='text-primary'>
							<NavLink to={`/${ROUTES.app}/${urlArray[2]}/${urlArray[3]}/${(uuid !== '' || id !== '') && uuidData}`} className='text-light-grey hover:underline'>{t(thirdLevelLink(urlArray[3]))}</NavLink>
						</span>
						<span className='mx-2 text-light-grey'>
							{'>'}
						</span>
						<span className='text-primary'>
							{urlArray[5] && `${t(thirdLevelLink(urlArray[4]))}`}
						</span>
					</>
				)
			}
		}
	}, [urlArray]);

	return (
		<div className='w-full'>
			<p className='max-xs:text-xs text-xs-14 max-md:truncate'>
				<span>
					<NavLink to={NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`)} className='cursor-pointer text-light-grey hover:underline'>
						{t('Home')}
					</NavLink>
					<span className='mx-2 text-light-grey'>{'>'}</span>
				</span>

				{breadcrumbLinks()}
			</p>
		</div>
	);
};

export default React.memo(Breadcrumb);
