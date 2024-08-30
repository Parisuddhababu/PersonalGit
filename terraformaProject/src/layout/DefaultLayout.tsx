import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Content, Sidebar, Footer, Loader } from '@components/index';
import CommonModel from '@components/common/commonModel';
import { LOGOUT_WARNING_TEXT, ROUTES } from 'src/config/constant';
import { destroyAuth, verifyAuth } from 'src/utils/helpers';

import { useMutation } from '@apollo/client';
import { LOGOUT } from '@framework/graphql/mutations/user';
import { useDispatch } from 'react-redux';
import { setResetAllUserData } from 'src/redux/user-profile-slice';
import { setResetAllCoursesData } from 'src/redux/courses-management-slice';
import { setResetAllTenantData } from 'src/redux/tenant-management-slice';
import { setResetAllUserRoleData } from 'src/redux/user-role-management-slice';


const DefaultLayout = () => {
	const navigate = useNavigate();
	const [show, setShow] = useState<boolean>(true);
	const [isShowLogoutModel, setIsShowLogoutModel] = useState<boolean>(false);
	const [toggleImage, setToggleImage] = useState(false);
	const [logoutMutation, loading] = useMutation(LOGOUT);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (!verifyAuth) {
			navigate(`/${ROUTES.login}`);
		}
	}, []);

	const onCloseModel = useCallback(() => {
		setIsShowLogoutModel(false);
	}, [setIsShowLogoutModel]);

	const logout = useCallback(() => {
		logoutMutation()
			.then(() => {
				destroyAuth();
				localStorage.clear();
				dispatch(setResetAllUserData());
				dispatch(setResetAllCoursesData());
				dispatch(setResetAllTenantData());
				dispatch(setResetAllUserRoleData());
				window.location.href = `/${ROUTES.login}`;
			})
			.catch((err) => {
				if (err.networkError.statusCode === 401) {
					destroyAuth();
					localStorage.clear();
					dispatch(setResetAllUserData());
					dispatch(setResetAllCoursesData());
					dispatch(setResetAllTenantData());
					dispatch(setResetAllUserRoleData());
					window.location.href = `/${ROUTES.login}`;
				} else {
					toast.error(err.networkError.result.errors[0].message);
				}
			});
	}, []);

	const onConformation = useCallback(() => {
		setIsShowLogoutModel(true);
	}, []);


	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === null && event.storageArea === localStorage) {
				destroyAuth();
				navigate(`/${ROUTES.login}`);
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	  }, [navigate]);
	



	return (
		<div className='flex flex-col h-screen'>
			<div className='relative flex flex-1 max-h-full overflow-y-auto'>
				<Sidebar show={show} menuHandler={setShow} setToggleImage={setToggleImage} toggleHeaderImage={toggleImage} logoutConformation={onConformation} />
				<div className='flex flex-col flex-1 w-[calc(100%-318px)] bg-white'>
					<Suspense fallback={<Loader />}>
						<Content />
						<Footer />
						{isShowLogoutModel && <CommonModel action={logout} show={isShowLogoutModel} onClose={onCloseModel} warningText={LOGOUT_WARNING_TEXT} isLoading={loading?.loading} disabled={loading?.loading}/>}
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default DefaultLayout;
