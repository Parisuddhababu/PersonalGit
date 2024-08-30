import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Loader from '@components/loadingIndicator/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from '@config/constant';
import './styles/main.scss';
import Routespath from './routes';

// Containers
const DefaultLayout = React.lazy(() => import('@layout/DefaultLayout'));
const PublicLayout = React.lazy(() => import('@layout/PublicLayout'));
const Login = React.lazy(() => import('@views/login'));

function App() {
	return (
		<Suspense fallback={<Loader />}>
			<ToastContainer />
			<Routes>
				{/* Public routes */}
				<Route element={<PublicLayout />}>
					<Route path={ROUTES.login} element={<Login />} />
					<Route path='' element={<Navigate to={`/${ROUTES.login}`} />} />
				</Route>
				{/* Private routes */}
				<Route path={`${ROUTES.app}`} element={<DefaultLayout />}>
					{Routespath.map((route) => {
						return route.element && <Route key={route.path} path={route.path} element={<route.element />} />;
					})}
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
