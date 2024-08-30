import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import Dropdown from '@components/dropdown/Dropdown';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import Loader from '@components/icons/Loader';
import { RolePermissionChildList } from 'src/types/role';
import Roles from '@views/rolePermissions/roles';
import { Key } from '@components/icons';
import GridView from '@components/gridView';

const RolePermissions = () => {
	const [loader, setLoader] = useState(false);
	const [permissionChildNodeList, setPermissionChildNodeList] = useState<RolePermissionChildList>([]);
	const [roleDrpData, setRoleDrpData] = useState<
		{
			key: string;
			name: string;
		}[]
	>([]);

	const [roleId, setRoleId] = useState<string>();
	const [checked, setChecked] = useState<string[]>([]);
	const [childPermissions, setChildPermissions] = useState<string[]>([]);
	const [defaultDropDown, setDefaultDropDown] = useState<string>('');

	/**
	 * Method is used to get all the  roles in drop down menu
	 */
	const getRoleDataListDropDown = useCallback(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.role}/rolelist`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const tempDataArr = [] as {
						key: string;
						name: string;
					}[];
					response.data.data.data.map((data: { name: string; uuid: string }) => {
						tempDataArr.push({ name: data.name, key: data.uuid });
					});
					setRoleDrpData(tempDataArr);
					getRolePermissions(tempDataArr[0].key);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	}, []);

	/**
	 *
	 * @param id get the permissions assigned to the dropDown User
	 */
	const getRolePermissions = (id: string) => {
		setDefaultDropDown(id);
		setLoader(true);
		APIService.getData(`${URL_PATHS.rolePermissions}/role/${id}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const tempDataArr = [] as string[];
					response.data.data.permissionList.map((data: { uuid: string }) => {
						tempDataArr.push(data.uuid);
					});
					setChecked(tempDataArr);
					setRoleId(id);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 * Method is used to get the all permissions for grid view
	 */
	const getAllPermissionsForChildNodes = () => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.rolePermissions}/get-permissions`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setPermissionChildNodeList(response.data.data);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 * Method is used to set the DropDown list and child nodes
	 */
	useEffect(() => {
		getAllPermissionsForChildNodes();
	}, []);

	/**
	 * structure for grid view
	 */
	const nodes = permissionChildNodeList.map((i, index) => {
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
	const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		getRolePermissions(e.target.value);
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
		APIService.postData(`${URL_PATHS.rolePermissions}/create`, {
			roleId: roleId as string,
			permissionIds: childPermissions,
		})
			.then((response) => {
				if (response.status === ResponseCode.success) {
					toast.success(response.data.message);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err.response?.data.message);
				setLoader(false);
			});
	}, [roleId, childPermissions]);

	return (
		<div className=' flex lg:flex-row flex-col  '>
			{loader && <Loader />}
			<div className='w-full  lg:w-1/2 lg:mr-4 mt-5 '>
				<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
					<div className='border-b p-3 flex items-center justify-between'>
						<h6 className='font-medium flex items-center'>
							<Key className='inline-block mr-2 text-primary' /> Permissions Management
						</h6>
					</div>
					<div className='p-3 w-full'>
						<div className='flex'>
							<Dropdown placeholder={'Select role'} value={defaultDropDown} name='role' onChange={handleChange} options={roleDrpData} id='role' className='w-full' />
							<Button className='btn-primary btn-normal ml-4' onClick={saveRolePermissions}>
								save
							</Button>
						</div>
						<GridView nodes={nodes} checkedChild={checked} onChangeCheckedChildHandler={onChangeChildHandler} />
					</div>
				</div>
			</div>
			<div className='w-full h-auto lg:w-1/2 mt-5'>
				<Roles onSubmitData={getRoleDataListDropDown} />
			</div>
		</div>
	);
};
export default RolePermissions;
