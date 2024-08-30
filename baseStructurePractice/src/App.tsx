import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Loader from '@components/loadingIndicator/Loader';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from '@config/constant';
import './styles/main.scss';
import Banner from '@views/banner';
import AddEditBanner from '@views/banner/addEditBanner';
import UpdateAdmin from '@views/profile/updateProfile';
import UpdateSettings from '@views/settings';
import AddAnnouncement from '@views/announcement/createAnnouncement';
import ViewAnnouncementDetails from '@views/announcement/viewAnnouncement';
import RolePermissions from '@views/role';

// Containers
const DefaultLayout = React.lazy(() => import('@layout/DefaultLayout'));
const PublicLayout = React.lazy(() => import('@layout/PublicLayout'));
const NotFound = React.lazy(() => import('@views/404'));
const Login = React.lazy(() => import('@views/login'));
const Category = React.lazy(() => import('@views/manageCategory'));
const AddEditCategory = React.lazy(() => import('@views/manageCategory/addEditCategory'));
const Dashboard = React.lazy(() => import('@views/dashboard'));
const AddTreeView = React.lazy(() => import('@views/manageCategory/treeView/addTreeView'));
const Announcement = React.lazy(() => import('@views/announcement'));

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
				<Route path={ROUTES.app} element={<DefaultLayout />}>
					{/*for login  page*/}
					<Route path={ROUTES.app} element={<Navigate to={`/${ROUTES.app}/${ROUTES.login}`} />} />
					<Route path={`${ROUTES.dashboard}`} element={<Dashboard />} />
					{/* banner */}
					<Route path={`${ROUTES.banner}`} element={<Banner />} />
					<Route path={`${ROUTES.banner}/AddEdit`} element={<AddEditBanner />} />
					<Route path={`${ROUTES.banner}/AddEdit/:id`} element={<AddEditBanner />} />
					{/* profile page */}
					<Route path={ROUTES.profile} element={<UpdateAdmin />} />
					{/* role permissions */}
					<Route path={ROUTES.role} element={<RolePermissions />} />
					{/* settings page  */}
					<Route path={ROUTES.settings} element={<UpdateSettings />} />
					{/* Category management */}
					<Route path={`${ROUTES.category}`} element={<Category />} />
					<Route path={`${ROUTES.category}/add`} element={<AddEditCategory />} />
					<Route path={`${ROUTES.category}/edit/:id`} element={<AddEditCategory />} />
					<Route path={`${ROUTES.category}/addTreeView`} element={<AddTreeView />} />
					{/*for announcement first page*/}
					<Route path={ROUTES.announcements} element={<Announcement />} />
					{/*for announcement add  page*/}
					<Route path={`${ROUTES.announcements}/add`} element={<AddAnnouncement />} />
					{/*for announcement view details page*/}
					<Route path={`${ROUTES.announcements}/view/:id`} element={<ViewAnnouncementDetails />} /> {/*for announcement list  page*/}
					<Route path={`${ROUTES.announcements}/list`} element={<Announcement />} />
				</Route>

				{/*for 404 page*/}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}

export default App;
