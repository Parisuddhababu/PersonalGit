import React from 'react'
// Containers
const NotFound = React.lazy(() => import('./views/404'));
const Dashboard = React.lazy(() => import('./views/dashboard'));
//banner
const Banner = React.lazy(() => import('./views/banner/index'));
const AddBanner = React.lazy(() => import('./views/banner/addEditBanner'));
const EditBanner = React.lazy(() => import('./views/banner/addEditBanner'));
//category
const Category = React.lazy(() => import('./views/manageCategory/index'));
const AddCategory = React.lazy(() => import('./views/manageCategory/addEditCategory'));
const EditCategory = React.lazy(() => import('./views/manageCategory/addEditCategory'));
const AddTreeView = React.lazy(() => import('./views/manageCategory/treeView/addTreeView'));
//announcement
const Announcement = React.lazy(() => import('./views/announcement/index'));
const AddAnnouncement = React.lazy(() => import('./views/announcement/createAnnouncement'));
const ViewAnnouncement = React.lazy(() => import('./views/announcement/viewAnnouncement'));
//settings
const Settings = React.lazy(() => import('./views/settings/index'));
//role
const Role = React.lazy(() => import('./views/role/index'));
//profile
const Profile = React.lazy(() => import('./views/profile/updateProfile'));


const Routespath = [
    { path: 'dashboard', element: Dashboard },
    { path: 'category/List', element: Category },//category
    { path: 'category/Add', element: AddCategory },
    { path: 'category/Edit/:id', element: EditCategory },
    { path: 'category/TreeView', element: AddTreeView },
    { path: 'settings', element: Settings },//settings
    { path: 'Role', element: Role },//role
    { path: 'announcements/List', element: Announcement },//announcement
    { path: 'announcements/Add', element: AddAnnouncement },
    { path: 'announcements/view/:id', element: ViewAnnouncement },
    { path: 'banner/List', element: Banner },//banner
    { path: 'banner/Add', element: AddBanner },
    { path: 'banner/Edit/:id', element: EditBanner },
    { path: 'profile', element: Profile },//profile
    { path: "*", element: NotFound },
]

export default Routespath;