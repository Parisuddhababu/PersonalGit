import React, {  Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES, privateRoutes } from '@config/constant';
import ResetPassword from '@views/resetPassword';
import PrivateRoutes from './privateRoutes';
import CreateNewAccount from '@views/createNewAccount';
import Create3rdPartyCompanyAccount from '@views/createNewAccount/create3rdPartyCompanyAccount';
import Contractor from '@views/createNewAccount/contractorAccount';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';

// Containers
const DefaultLayout = React.lazy(() => import('@layout/DefaultLayout'));
const PublicLayout = React.lazy(() => import('@layout/PublicLayout'));
const NotFound = React.lazy(() => import('@views/404'));
const Login = React.lazy(() => import('@views/login'));
const ForgotPassword = React.lazy(() => import('@views/forgotPassword'));
const UserProfilePasswordChange = React.lazy(() => import('@views/adminProfile/changeProfilePassword'));
const Introductory = React.lazy(() => import('@views/introductoryPage'));

function App() {
	function getFaviconEl(): HTMLLinkElement | null {
		return document.getElementById('faviconLink') as HTMLLinkElement | null;
	}
	useEffect(() => {
		const fav = localStorage.getItem('favicon') as string;
		const favEl = getFaviconEl() ;
		if (favEl) {
			favEl.href = `${fav}`;
		}
	}, []);
	return (
		<>
			<ToastContainer />
			<Suspense fallback={<LoadingIndicator />}>
				<Routes>
					{/* Public routes  */}
					<Route element={<PublicLayout />}>
						<Route path={ROUTES.login} element={<Login />} />
						<Route path={`${ROUTES.resetPassword}`} element={<ResetPassword />} />
						<Route path={`${ROUTES.forgotPassword}`} element={<ForgotPassword />} />
						<Route path='' element={<Navigate to={`/${ROUTES.login}`} />} />
					</Route>
					{/* Private routes  */}
					<Route element={<PrivateRoutes />}>
						
						<Route path={ROUTES.app} element={<DefaultLayout />}>
							{privateRoutes.map((route, idx) => {
								return route.element && <Route key={`route-${idx + 1}`} path={route.path} element={<route.element />} />;
							})}
							
							<Route path='*' element={<NotFound />} />
						</Route>
						<Route path={`${ROUTES.app}/${ROUTES.createNewAccount}`} element={<CreateNewAccount />} />
						<Route path={`${ROUTES.app}/${ROUTES.create3rdPartyCompanyAccount}`} element={<Create3rdPartyCompanyAccount />} />
						<Route path={`${ROUTES.app}/${ROUTES.contractor}`} element={<Contractor />} />
						<Route path={`${ROUTES.app}/${ROUTES.userProfilePasswordChange}`} element={<UserProfilePasswordChange />} />
						<Route path={`${ROUTES.introductory}`} element={<Introductory />} />
					</Route>
				</Routes>
			</Suspense>
		</>
	);
}

export default App;
