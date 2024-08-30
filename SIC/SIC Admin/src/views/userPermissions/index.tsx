import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import Dropdown from '@components/dropdown/Dropdown';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import Loader from '@components/icons/Loader';
import { RolePermissionChildList } from 'src/types/role';
import { UserPermission } from '@components/icons';
import GridView from '@components/gridView';
import { DropdownOptionType } from 'src/types/component';

const UserPermissions = () => {
	const [loader, setLoader] = useState(false);
	const [permissionChildNodeList, setPermissionChildNodeList] = useState<RolePermissionChildList>([]);
	const [userDropData, setUserDropData] = useState<DropdownOptionType[]>([]);
	const [userId, setUserId] = useState<string>();
	const [checked, setChecked] = useState<string[]>([]);
	const [childPermissions, setChildPermissions] = useState<string[]>([]);
	const [defaultDropDown, setDefaultDropDown] = useState<string>('');

	/**
	 * Method is used to get all the  roles in drop down menu
	 */
	const getUsersDataListDropDown = () => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.subAdmin}list`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data?.subAdminList.map((item: { userData: { firstName: string; lastName: string; uuid: string } }) => {
						data.push({ name: `${item?.userData?.firstName} ${item?.userData?.lastName}`, key: item?.userData?.uuid });
					});
					setUserDropData(data);
					getUserPermissions(data[0].key as string);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 *
	 * @param id get the permissions assigned to the dropDown User
	 */
	const getUserPermissions = (id: string) => {
		setDefaultDropDown(id);
		setLoader(true);
		APIService.getData(`${URL_PATHS.adminUsersPermissions}${id}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const tempDataArr: string[] = [];
					response?.data?.data?.permissions.map((data: { uuid: string }) => {
						tempDataArr.push(data.uuid);
					});
					setChecked(tempDataArr);
					setUserId(id);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 * Method is used to get the all permissions for grid view
	 */
	const getAllUserPermissionsForChildNodes = () => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.rolePermissions}/get-permissions`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setPermissionChildNodeList(response?.data.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 * Method is used to set the DropDown list and child nodes
	 */
	useEffect(() => {
		getUsersDataListDropDown();
		getAllUserPermissionsForChildNodes();
	}, []);

	/**
	 * structure for grid view
	 */
	const userNodes = permissionChildNodeList.map((i, index) => {
		return {
			value: i.uuid,
			label: i.moduleName,
			id: `${index}`,
			children: i.permissions.map((j) => {
				return { value: j.uuid, label: j.name };
			}) as { value: string; label: string }[],
		};
	});

	/**
	 *
	 * @param e method is used to get the data from dropdown change
	 */
	const handleChangeUserPermissions = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		getUserPermissions(e.target.value);
	}, []);

	/**
	 *
	 * @param event  to set the child permissions to the api
	 */
	const onChangeChildHandler = useCallback(
		(event: string[]) => {
			setChildPermissions(event);
		},
		[childPermissions]
	);

	/**
	 * Method is used to save the role permissions
	 */
	const saveRolePermissions = useCallback(() => {
		setLoader(true);
		APIService.postData(URL_PATHS.adminUsersPermissions, {
			userId: userId as string,
			permissionIds: childPermissions,
		})
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					toast.success(response?.data.message);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	}, [userId, childPermissions]);

	return (
		<div>
			{loader && <Loader />}
			<div>
				<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium flex items-center'>
							<UserPermission className='inline-block mr-2 text-primary' /> User Permissions Management
						</h6>
					</div>
					<div className='p-3 w-full'>
						<div className='flex justify-end'>
							<Dropdown placeholder='Select user' value={defaultDropDown} name='permissions' onChange={handleChangeUserPermissions} options={userDropData} id='permissions' className='w-48' />
							<Button className='btn-primary ml-4' onClick={saveRolePermissions}>
								save
							</Button>
						</div>
						<GridView nodes={userNodes} checkedChild={checked} onChangeCheckedChildHandler={onChangeChildHandler} columns={3} />
					</div>
				</div>
			</div>
		</div>
	);
};
export default UserPermissions;
