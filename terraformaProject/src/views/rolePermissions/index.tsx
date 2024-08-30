/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Folder } from '@components/icons/icons';
import { CreateAndRolePermissionsData, PermissionArr, RoleDataArr, RolePermissionsCheckBoxData, RolePermissionsDataArr } from '@framework/graphql/graphql';
import { CREATE_ROLE_PERMISSIONS } from '@framework/graphql/mutations/rolePermission';
import { GET_ROLES_DATA } from '@framework/graphql/queries/role';
import { FETCH_ROLE_PERMISSIONS_BY_ID } from '@framework/graphql/queries/rolePermissions';
import { DropdownOptionType } from 'src/types/component';
import { RolePermissionsProps } from 'src/types/rolePermissions';
import RolePermission from '@views/role';

import { useMutation, useQuery } from '@apollo/client';
import PermissionParentCheckBoxes from '@components/permissionCheckBoxes/permissionParentCheckBoxes';
import PermissionChildCheckBoxes from '@components/permissionCheckBoxes/permissionChildCheckBoxes';
import UpdatedHeader from '@components/header/updatedHeader';
import { useSelector } from 'react-redux';
import { UserProfileType, UserRoles } from 'src/types/common';
import { Link  } from 'react-router-dom';
import { ROUTES, USER_TYPE } from '@config/constant';

const RolePermissions = () => {
	const { t } = useTranslation();
	const { data: roleData, refetch: getRoleData } = useQuery(GET_ROLES_DATA, { variables: {  limit: 500, page: 1,  search: '', sortOrder: '', sortField: 'name' }})
	const [createRolePermissions, loading] = useMutation(CREATE_ROLE_PERMISSIONS);
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const [selectedItems, setSelectedItems] = useState<{ [key: string]: any }>({ is_read: 0, is_remove: 0, is_update: 0, is_write: 0 });
	const [filterRoleData, setFilterRoleData] = useState<RolePermissionsProps>({ roleId: null });
	const { data: rolePermissionListData, refetch: getRolePermissionListById } = useQuery(FETCH_ROLE_PERMISSIONS_BY_ID, { variables: { roleId: roleData?.getRoles?.data?.role?.[0]?.uuid}});
	const [permission, setPermission] = useState<any>([]);
	const headerCheckBox = [
		{ id: 'is_read', name: 'View', value: 'View' },
		{ id: 'is_write', name: 'Add', value: 'Add' },
		{ id: 'is_update', name: 'Update', value: 'Update' },
		{ id: 'is_remove', name: 'Delete', value: 'Delete' },
	];
	const { rolePermission } = useSelector(((state: { rolesManagement: { rolePermission: UserRoles} }) => state.rolesManagement));
	const { userProfileData  } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType;  } }) => state.userProfile,
	  );
	  const userType =  userProfileData?.getProfile?.data?.user_type ?? '';
	/**
	 * Method used for set rol dropdown array
	 */
	useEffect(() => {
		if (roleData?.getRoles) {
			const tempDataArr = [] as DropdownOptionType[];
			roleData?.getRoles?.data?.role.map((data: RoleDataArr) => {
				tempDataArr.push({ name: data.name, key: data.uuid });
			});
			setRoleDrpData(tempDataArr);
			setFilterRoleData({ roleId: roleData?.getRoles?.data?.role?.[0]?.uuid})
		}
		if (roleData?.getRoles?.data?.count === 0) {
			setPermission([]);
		}
	}, [roleData]);

	const toggleAddNewRoles = useCallback(() => {
		getRoleData();
		getRolePermissionListById();
	}, []);

	/**
	 * Method used get value of all checkbox is selected or not.
	*/
	function checkIsAllCheckboxes(objects: any, field: string) {
		if (objects) {
			return objects.every((object : RolePermissionsDataArr) => {
				if (object[field] === 1) {
					if (object.children && Array.isArray(object.children)) {
						// Recursively check child objects if they exists or not
						return checkIsAllCheckboxes(object.children, field);
					}
					return true;
				}
				return false;
			});
		}
	}

	/**
	 * Method used to select of all checkbox after API response.
	*/
	const headerCheckBoxChecked = useCallback(() => {
		if (rolePermissionListData?.getRolePermissionsByRoleId?.data?.length > 0) {
			headerCheckBox.forEach((item:RolePermissionsCheckBoxData) => {
				const allHaveSelected = checkIsAllCheckboxes(rolePermissionListData?.getRolePermissionsByRoleId?.data, item.id);
				if (selectedItems[item.id] === 0 && allHaveSelected) {
					setSelectedItems(prevSelectedItems => ({
					  ...prevSelectedItems,
					  [item.id]: 1,
					}));
				}
			});	
		}
	}, [rolePermissionListData])

	/**
	 * Method used refetch the role permissions list based on user selection in drop down by roleId
	*/
	useEffect(() => {
		if (filterRoleData.roleId !== null) {
			getRolePermissionListById(filterRoleData).catch((err) => toast.error(err));
		}
	}, [filterRoleData]);

	/**
	 * Method used set value of permission state.
	*/
	useEffect(() => {
		if (rolePermissionListData?.getRolePermissionsByRoleId) {
			setPermission(rolePermissionListData?.getRolePermissionsByRoleId?.data);
		}
	}, [rolePermissionListData])

	useEffect(() => {
		if (rolePermissionListData?.getRolePermissionsByRoleId?.data?.length > 0) {
			headerCheckBoxChecked();
		}
	}, [rolePermissionListData])

	/**
	 * @param e method used set filter data
	*/
	const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterRoleData({ roleId: e.target.value });
		setSelectedItems({ is_read: 0, is_remove: 0, is_update: 0, is_write: 0 });
	}, []);

	/**
	 * Method used create the role permissions
	*/
	const saveRolePermissionsHandler = useCallback(() => {
		const permissionArr = [] as PermissionArr[];
		permission.map((permissionItem: any) => {
			const permissionMapping = {
				is_read: permissionItem?.is_read,
				is_remove: permissionItem?.is_remove,
				is_update: permissionItem?.is_update,
				is_write: permissionItem?.is_write,
				uuid: permissionItem?.uuid,
				children: permissionItem?.children.length > 0
					? permissionItem?.children.map((childrenItem: any) => ({
						is_read: childrenItem?.is_read,
						is_remove: childrenItem?.is_remove,
						is_update: childrenItem?.is_update,
						is_write: childrenItem?.is_write,
						uuid: childrenItem?.uuid,
						}))
					: []
			}
			permissionArr.push(permissionMapping);
		});
		createRolePermissions({
			variables: {
				rolePermissionData: {
					permission: permissionArr
				},
			},
		})
			.then((res) => {
				const data = res?.data?.updateRolePermissionsMapping as CreateAndRolePermissionsData;
				toast.success(data.message);
			})
			.catch((err) => {
				toast.error(err.networkError.result.errors[0].message);
			});
			
	}, [permission]);

	const handleCheckboxChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event?.target as HTMLInputElement;
		setSelectedItems({...selectedItems, [value]: checked === true ? 1 : 0 });
		const parentPermission = [...permission];
		const allParentData = parentPermission.map((_,index: number) => {
			const updateParentPermission = { ...parentPermission[index] };
			updateParentPermission[value] = checked ? 1 : 0; 		
			const childrenS = updateParentPermission.children.map((child: any) => {
				const childS = {...child};
				childS[value] = updateParentPermission[value];
				return childS;
			})			
			updateParentPermission.children = childrenS;
			return updateParentPermission;
		})
		setPermission([...allParentData]);
	}
	
	const parentPermissionUpdate = (index: number, field: string) => {
		const parentPermission = [...permission];
		const updateParentPermission = { ...parentPermission[index] };
		updateParentPermission[field] = updateParentPermission[field] === 0 ? 1 : 0; 
		const childrenS = updateParentPermission.children.map((child: any) => {
			const childS = {...child};
			childS[field] = updateParentPermission[field];
			return childS;
		})
		updateParentPermission.children = childrenS;
		parentPermission[index] = updateParentPermission;
		if (selectedItems[field] === 1 && updateParentPermission[field] === 0) {
			setSelectedItems({...selectedItems, [field]: 0 });
		} 
		const allHaveSelected = checkIsAllCheckboxes(parentPermission, field);
		if (selectedItems[field] === 0 && allHaveSelected) {
			setSelectedItems({...selectedItems, [field]: 1 });
		}
		setPermission([...parentPermission]);
	}

	const childPermissionUpdate = (parentIndex: number, childIndex: number, field: string) => {
		const parentPermission = [...permission];
		const parentPermissionObj = { ...parentPermission[parentIndex] };
		const childPermission = [...parentPermissionObj.children];
		const childPermissionObj = {...childPermission[childIndex]};
		childPermissionObj[field] = childPermissionObj[field] === 0 ? 1 : 0;
		childPermission[childIndex] = childPermissionObj;		 
		parentPermissionObj.children = childPermission;
		parentPermission[parentIndex] = parentPermissionObj;
		if (selectedItems[field] === 1 && childPermissionObj[field] === 0) {
			setSelectedItems({...selectedItems, [field]: 0 });
		}
		const allHaveSelected = checkIsAllCheckboxes(parentPermission, field);
		if (selectedItems[field] === 0 && allHaveSelected) {
			setSelectedItems({...selectedItems, [field]: 1 });
		}
		setPermission([...parentPermission]);
	}
	
	const headerActionConst = () => {
		if(userType !==USER_TYPE.SUPER_ADMIN){

			return (
					 <Link
					to={`/${ROUTES.app}/${ROUTES.createNewAccount}`}
					className='btn-normal md: btn btn-secondary'
					type='button'	
					>
						{t('Create New Employee')}
					</Link>
			)
		}
	}

	return (
		<>		
		<UpdatedHeader headerActionConst={headerActionConst}  />
			<div className='flex flex-col h-screen mt-5 mb-5 lg:flex-row'>
				<div className='mb-5 lg:w-1/2 lg:mr-7'>
					<div className='w-full m-auto overflow-hidden bg-white border border-border-primary rounded-xl'>
						<div className='flex items-center justify-between w-full px-3 py-2 border-b md:px-5 border-border-primary bg-accents-2'>
							<div className='w-[65%] max-w-[360px]'>
								<Dropdown placeholder={t('Select role')} name='role' value={filterRoleData.roleId ? filterRoleData.roleId : ''} onChange={handleChange} options={roleDrpData} id='role' />
							</div>
							{rolePermission?.update &&<div>
								<Button className='btn-primary btn-normal md:w-[100px] 2xl:w-[150px] ml-5 whitespace-nowrap' label={''} onClick={saveRolePermissionsHandler} disabled={loading?.loading}  title={`${t('Save')}`}>
									{t('Save')}
								</Button>
							</div>}
						</div>
						<div className='w-full p-3 overflow-auto md:p-5'>
							<div className='min-w-[600px]'>
								<div className='flex justify-end gap-3 pb-4 mb-4 border-b border-solid border-border-primary'>
									{headerCheckBox.map((item:RolePermissionsCheckBoxData) => (
										<div className="w-20 text-left whitespace-nowrap min-w-[65px] items-center justify-center" key={item.id}>
											<label key={item.id} className='flex'>
												<input className='mr-2' type="checkbox" value={item.id} checked={selectedItems[item.id]} onChange={handleCheckboxChange}/>
												{item.name}
									  		</label>
										</div>
									))}
								</div>
								{permission.map((parent:RolePermissionsDataArr, parentIndex: number) => (
									<div className='parent' key={parent?.uuid}>
										<div className='flex gap-8 py-1 main'>
											<div className='flex items-center w-full gap-1'><Folder fontSize='18' />{parent?.module_id?.name}</div>
											<PermissionParentCheckBoxes parent={parent} parentPermissionUpdate={parentPermissionUpdate} parentIndex={parentIndex}/>
										</div>
										{parent?.children.map((child:RolePermissionsDataArr, childIndex: number) => (
											<div className='flex gap-3 py-1 ml-6 child-role-permission' key={child?.uuid}>
												<div className='flex items-center w-full gap-1'><Folder fontSize='18' />{child?.module_id?.name}</div>
												<PermissionChildCheckBoxes child={child} childPermissionUpdate={childPermissionUpdate} parentIndex={parentIndex} childIndex={childIndex}/>
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className='h-auto lg:w-1/2'>
					<RolePermission updatedRoleDataFunction={toggleAddNewRoles}/>
				</div>
			</div>
		</>
	);
};
export default RolePermissions;


