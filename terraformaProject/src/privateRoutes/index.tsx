/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@apollo/client';
import { ROUTES, USER_TYPE } from '@config/constant';
import { GET_USER_PROFILE } from '@framework/graphql/queries/profile';
import { GET_ROLE_PERMISSIONS_OF_USER } from '@framework/graphql/queries/rolePermissionsOfUser';
import { verifyAuth } from '@utils/helpers';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setUserProfileSaved, userProfileData } from 'src/redux/user-profile-slice';
import {  setCategory, setCompanyDirectory, setContractor, setCourse, setDashboard, setEducationEngagement, setEducationInsights, setEmployee, setRolePermission, setSubscriberManagement, setTechnicalManualsGuides, setTenant, setUserManagement, setUserRolePermissionsData } from 'src/redux/user-role-management-slice';
import { UserProfileType } from 'src/types/common';

const PrivateRoutes = () => {
	const [verified, setVerified] = useState(verifyAuth());
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const { data } = useQuery(GET_ROLE_PERMISSIONS_OF_USER);
	const { data: getProfile, refetch } = useQuery(GET_USER_PROFILE);
	const { userProfileSaved } = useSelector(((state: { userProfile: { userProfileSaved: boolean,userProfileData: UserProfileType } }) => state.userProfile));
	const rolePermissions = data?.getRolePermissionsOfUser?.data;
	const extractedData = rolePermissions?.map((permission: { module_id: { name: string; }; is_read: number; is_write: number; is_update: number; is_remove: number; children: [] }) => {
		const module = permission?.module_id.name;
		const isRead = permission?.is_read;
		const isWrite = permission?.is_write;
		const isUpdate = permission?.is_update;
		const isRemove = permission?.is_remove;
		const children = permission?.children?.map((child: { module_id: { name: string; }; is_read: number; is_write: number; is_update: number; is_remove: number; }) => {
			const childModule = child.module_id.name;
			const childIsRead = child.is_read;
			const childIsWrite = child.is_write;
			const childIsUpdate = child.is_update;
			const childIsRemove = child.is_remove;
			return {
				module: childModule,
				isRead: childIsRead,
				isWrite: childIsWrite,
				isUpdate: childIsUpdate,
				isRemove: childIsRemove,
			};
		});
		return {
			module,
			isRead,
			isWrite,
			isUpdate,
			isRemove,
			children,
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getModulePermissions = (data: any) => {
		return data?.map((item: { module: string; isRead: number; isWrite: number; isUpdate: number; isRemove: number; children: []; }) => {
			const { module, isRead, isWrite, isUpdate, isRemove, children } = item;
			const childPermissions = children?.length > 0 ? getModulePermissions(children) : null;
			return {
				module,
				permissions: {
					read: isRead === 1,
					write: isWrite === 1,
					update: isUpdate === 1,
					delete: isRemove === 1,
				},
				children: childPermissions,
			};
		});
	};

	const flattenData = (data: { module: string; permissions: object; children: []; }[]) => {
		const flattenedData: { module: string; permissions: object; }[] = [];

		data?.forEach((item: { module: string; permissions: object; children: []; }) => {
			const { module, permissions, children } = item;
			flattenedData.push({ module, permissions });

			if (children && children?.length > 0) {
				flattenedData.push(...flattenData(children));
			}
		});

		return flattenedData;
	};

	useEffect(() => {
		if (userProfileSaved) {
			refetch();
			dispatch(setUserProfileSaved(false));
		}
	}, [userProfileSaved])

	useEffect(() => {
		if (getProfile) {
			if (getProfile?.getProfile?.data?.is_required_reset_password) {
				navigate(`${ROUTES.app}/${ROUTES.userProfilePasswordChange}`)
			}
			dispatch(userProfileData(getProfile))
		}
	}, [getProfile])


	useEffect(() => {
		const modulePermissions = getModulePermissions(extractedData);
		const flattenedData = flattenData(modulePermissions);
		const rolePermissionData = flattenedData?.find((item: { module: string; }) => item?.module === 'Role Permission');
		const educationAndEngagementData = flattenedData?.find((item: { module: string; }) => item?.module === 'Education & Engagement');
		const subscriberManagement = flattenedData?.find((item: { module: string; }) => item?.module === 'Subscriber Management');
		const category = flattenedData?.find((item: { module: string; }) => item?.module === 'Category') as any;
		const technicalManualsGuides = flattenedData?.find((item: { module: string; }) => item?.module === 'Technical Manuals & Guides') as any;
		const companyDirectory = flattenedData?.find((item: { module: string; }) => item?.module === 'Company Directory');
		const course = flattenedData?.find((item: { module: string; }) => item.module === 'Course');
		const educationInsights = flattenedData?.find((item: { module: string; }) => item.module === 'Education Insights');
		const dashboard = flattenedData?.find((item: { module: string; }) => item.module === 'Dashboard');		
		const userManagement = flattenedData?.find((item: { module: string; }) => item.module === 'User Management');		
		const employee = flattenedData?.find((item: { module: string; }) => item.module === 'Employee') as any;
		const tenant = flattenedData?.find((item: { module: string; }) => item.module === 'Tenant') as any;
		const contractor = flattenedData?.find((item: { module: string; }) => item.module === 'Contractor') as any;

		dispatch(setUserRolePermissionsData(data));
		dispatch(setRolePermission(rolePermissionData?.permissions));
		dispatch(setSubscriberManagement(subscriberManagement?.permissions));
		dispatch(setCategory(category?.permissions));
		dispatch(setTechnicalManualsGuides(technicalManualsGuides?.permissions));
		dispatch(setCompanyDirectory(companyDirectory?.permissions));
		dispatch(setEducationEngagement(educationAndEngagementData?.permissions));
		dispatch(setCourse(course?.permissions));
		dispatch(setEducationInsights(educationInsights?.permissions));
		dispatch(setDashboard(dashboard?.permissions));
		dispatch(setUserManagement(userManagement?.permissions));
		dispatch(setEmployee(employee?.permissions));
		dispatch(setTenant(tenant?.permissions));
		dispatch(setContractor(contractor?.permissions));

		if (getProfile?.getProfile?.data&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}`) && !location.pathname.includes(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}`) && ![USER_TYPE.SUBSCRIBER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && !getProfile?.getProfile?.data?.is_course_creator) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (getProfile?.getProfile?.data&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.educationAndEngagement}`) && ![USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && !getProfile?.getProfile?.data?.is_course_creator) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (technicalManualsGuides && location.pathname.includes(`/${ROUTES.app}/${ROUTES.technicalManualsGuides}`) && !technicalManualsGuides?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (technicalManualsGuides && location.pathname.includes(`/${ROUTES.app}/${ROUTES.subTechnicalManualsGuides}/list`) && !technicalManualsGuides?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (technicalManualsGuides && location.pathname.includes(`/${ROUTES.app}/${ROUTES.itemByCategoryList}/list`) && !technicalManualsGuides?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.category}/list`) && !category?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.subCategory}/list`) && !category?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.subCategory}/add`) && !category?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.subCategory}/edit/`) && !category?.permissions?.read) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.category}/add`) && !category?.permissions?.write) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (category && location.pathname.includes(`/${ROUTES.app}/${ROUTES.category}/edit/`) && !category?.permissions?.update) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if (getProfile?.getProfile?.data && getProfile?.getProfile?.data?.user_type === USER_TYPE.SUPER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.dashboard}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.subscriber}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && getProfile?.getProfile?.data?.user_type !==USER_TYPE.SUPER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.volumeManagement}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && getProfile?.getProfile?.data?.user_type !==USER_TYPE.SUPER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.equipmentManagement}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && getProfile?.getProfile?.data?.user_type !==USER_TYPE.SUPER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.materialManagement}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && getProfile?.getProfile?.data?.user_type !==USER_TYPE.SUPER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.frequencyManagement}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data && getProfile?.getProfile?.data?.user_type !== USER_TYPE.SUBSCRIBER_ADMIN && location.pathname.includes(`/${ROUTES.app}/${ROUTES.diversionAdminManagement}`)){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`);
		}
		if ( getProfile?.getProfile?.data?.user_type && ![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.DIVERSION_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && location.pathname.includes(`/${ROUTES.app}/${ROUTES.diversionReportList}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type &&![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.DIVERSION_ADMIN].includes(getProfile?.getProfile?.data?.user_type)  && location.pathname.includes(`/${ROUTES.app}/${ROUTES.diversionSettings}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type &&![USER_TYPE.SUBSCRIBER_CONTRACTOR,USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR].includes(getProfile?.getProfile?.data?.user_type) && location.pathname.includes(`/${ROUTES.app}/${ROUTES.weightList}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && ![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.DIVERSION_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && location.pathname.includes(`/${ROUTES.app}/${ROUTES.diversionContractor}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if ( getProfile?.getProfile?.data?.user_type && ![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.DIVERSION_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && location.pathname.includes(`/${ROUTES.app}/${ROUTES.viewReports}`)) {
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data?.user_type&& ![USER_TYPE.SUBSCRIBER_ADMIN].includes(getProfile?.getProfile?.data?.user_type)&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.courseCreatorList}`)){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data?.user_type&& ![USER_TYPE.SUBSCRIBER_ADMIN].includes(getProfile?.getProfile?.data?.user_type)&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.courseAdminList}`)){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.archivesManagement}`) && ![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && !getProfile?.getProfile?.data?.is_course_creator){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}		
		if(getProfile?.getProfile?.data&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.draftsManagement}`) && ![USER_TYPE.SUBSCRIBER_ADMIN,USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) && !getProfile?.getProfile?.data?.is_course_creator ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}

		if(getProfile?.getProfile?.data&&location.pathname.includes(`/${ROUTES.app}/${ROUTES.ticketsList}`) && ![USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}

		if(getProfile?.getProfile?.data?.user_type && location.pathname.includes(`/${ROUTES.app}/${ROUTES.zone}`) && ![USER_TYPE.SUBSCRIBER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data?.user_type && location.pathname.includes(`/${ROUTES.app}/${ROUTES.locationManagement}`) && ![USER_TYPE.SUBSCRIBER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}	
		if(getProfile?.getProfile?.data?.user_type && location.pathname.includes(`/${ROUTES.app}/${ROUTES.sendAnnouncements}`) && ![USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
		if(getProfile?.getProfile?.data?.user_type && location.pathname.includes(`/${ROUTES.app}/${ROUTES.CMS}`) && ![USER_TYPE.SUBSCRIBER_ADMIN, USER_TYPE.SUPER_ADMIN].includes(getProfile?.getProfile?.data?.user_type) ){
			navigate(`/${ROUTES.app}/${ROUTES.permissionDenied}`)
		}
	}, [extractedData,getProfile?.getProfile])
	
	useEffect(() => {
		if(verifyAuth()){
			setVerified(verifyAuth());
		}
	}, [verifyAuth]);

	if (verified) {
		return <Outlet />;
	}
	else {
		return <Navigate to={`/${ROUTES.login}`} />;
	}
};
export default PrivateRoutes;
