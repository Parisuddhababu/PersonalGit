import { useMutation, useQuery } from '@apollo/client';
import Dropdown from '@components/dropdown/Dropdown';
import { CheckCircle, Compress, Expand } from '@components/icons/index';
import { ModuleNames } from '@config/constant';
import { CreateAndRolePermissionsData, RoleDataArr, RolePermissionsDataArr } from '@framework/graphql/graphql';
import { CREARTE_ROLE_PERMISSIONS } from '@framework/graphql/mutations/rolePermission';
import { FETCH_ROLES_DATA } from '@framework/graphql/queries/role';
import { FETCH_PERMISSIONS, FETCH_ROLE_PERMISSIONS_BY_ID } from '@framework/graphql/queries/rolePermissions';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DropdownOptionType } from 'src/types/component';
import { RolePermissionsProps, TreeViewArr } from 'src/types/rolePermissions';
import { useTranslation } from 'react-i18next';
import { Tree, TreeCheckboxSelectionKeys } from 'primereact/tree';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import Role from '../role/role';
import Button from '@components/button/button';

const RolePermissions = () => {
	const { data } = useQuery(FETCH_PERMISSIONS);
	const { t } = useTranslation();
	const { data: roleData } = useQuery(FETCH_ROLES_DATA);
	const { data: RolePermissionListData, refetch: getRolePermissionListById } = useQuery(FETCH_ROLE_PERMISSIONS_BY_ID);
	const [createRolePermissions] = useMutation(CREARTE_ROLE_PERMISSIONS);
	const [roleDropDownData, setDropDownRoleData] = useState<DropdownOptionType[]>([]);
	const [filterRoleData, setFilterRoleData] = useState<RolePermissionsProps>({
		roleId: null,
	});

	const [checked, setChecked] = useState<TreeCheckboxSelectionKeys | null>(null);
	const [checkedIds, setCheckedIds] = useState<string[]>([]);
	const [rolesSelect, setRoleSelect] = useState<TreeCheckboxSelectionKeys | null>(null);
	const [allCheckboxList, setAllCheckboxList] = useState(false);
	const [toggleExpand, setToggleExpand] = useState<boolean>(false);
	const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>({});

	const handleAllCheckboxChange = () => {
		const allChecked: {
			[key: string]: { checked: boolean; partialChecked: boolean };
		} = {};
		if (allCheckboxList) {
			setChecked({});
			setAllCheckboxList(false);
		} else {
			nodes.forEach((node) => {
				allChecked[node.key] = { checked: true, partialChecked: false };
				node.children.forEach((child: { key: string | number }) => {
					allChecked[child.key] = { checked: true, partialChecked: false };
				});
			});
			setChecked(allChecked);
			setAllCheckboxList(true);
		}
	};

	/*pushing data for dropDown select*/
	useEffect(() => {
		if (roleData?.fetchRoles) {
			const drpDownOptionArr = [] as DropdownOptionType[];
			roleData.fetchRoles?.data?.Roledata.map((data: RoleDataArr) => drpDownOptionArr.push({ name: data.role_name, key: data.id }));
			setDropDownRoleData(drpDownOptionArr);
		}
	}, [roleData]);

	/*fetch the role  data by id*/
	useEffect(() => {
		if (filterRoleData) {
			getRolePermissionListById(filterRoleData).catch((err) => toast.error(err));
		}
	}, [filterRoleData, getRolePermissionListById]);

	/*set checkbox id in local variable*/
	useEffect(() => {
		if (RolePermissionListData?.fetchRolePermissions?.data !== null) {
			if (data?.count !== 0) {
				const checkedBasedOnRole: {
					[key: string]: {
						checked: boolean;
						partialChecked: boolean;
					};
				} = {};
				RolePermissionListData?.fetchRolePermissions?.data?.permissionList?.forEach((i: RolePermissionsDataArr) => {
					checkedBasedOnRole[i.id] = {
						checked: true,
						partialChecked: false,
					};
					setRoleSelect(checkedBasedOnRole);
				});
			}
		}
	}, [RolePermissionListData, data?.count]);

	/*select handler to get user selected value*/
	const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilterRoleData({ roleId: parseInt(e.target.value) });
	}, []);

	/*set the children data for checkbox tree*/
	const children = (value: number) => {
		if (data?.getPermissions) {
			return data?.getPermissions?.data?.permissondata
				?.map((i: RolePermissionsDataArr) => {
					if (i?.module_id === value + 1) {
						return {
							key: i?.id,
							label: i?.permission_name,
						};
					}
					return null;
				})
				.filter((i: TreeViewArr | null) => i !== null);
		}
		return [];
	};
	const nodes = [
		{
			key: ModuleNames[0],
			label: ModuleNames[0],
			children: children(0),
		},
		{
			key: ModuleNames[1],
			label: ModuleNames[1],
			children: children(1),
		},
		{
			key: ModuleNames[2],
			label: ModuleNames[2],
			children: children(2),
		},
		{
			key: ModuleNames[3],
			label: ModuleNames[3],
			children: children(3),
		},
		{
			key: ModuleNames[4],
			label: ModuleNames[4],
			children: children(4),
		},
		{
			key: ModuleNames[5],
			label: ModuleNames[5],
			children: children(5),
		},
		{
			key: ModuleNames[6],
			label: ModuleNames[6],
			children: children(6),
		},
		{
			key: ModuleNames[7],
			label: ModuleNames[7],
			children: children(7),
		},
		{
			key: ModuleNames[8],
			label: ModuleNames[8],
			children: children(8),
		},
		{
			key: ModuleNames[9],
			label: ModuleNames[9],
			children: children(9),
		},
		{
			key: ModuleNames[10],
			label: ModuleNames[10],
			children: children(10),
		},
	];
	useEffect(() => {
		if (rolesSelect) {
			nodes.forEach((item) => {
				if (item.children.map((j: { key: string }) => j.key).every((i: string) => Object.keys(rolesSelect).includes(i))) {
					setChecked((prev) => {
						return {
							...prev,
							...rolesSelect,
							[item.label]: { checked: true, partialChecked: false },
						};
					});
				}
			});
		}
	}, [rolesSelect]);

	//for selected array
	useEffect(() => {
		if (checked) {
			setCheckedIds(Object.keys(checked));
		}
	}, [checked]);

	const saveRolePermissionsHandler = useCallback(() => {
		const filteredArray = checkedIds?.filter((item) => !nodes.some((node) => node.key === item));

		if (filterRoleData.roleId !== null) {
			const permissionIds = filteredArray.map((i) => parseInt(i));
			createRolePermissions({
				variables: {
					roleId: filterRoleData.roleId,
					permissionIds: permissionIds,
				},
			})
				.then((res) => {
					const data = res?.data?.CreateAndRolePermissions as CreateAndRolePermissionsData;
					if (data.meta.statusCode === 200) {
						toast.success(data.meta.message);
					} else {
						toast.error(data.meta.message);
					}
				})
				.catch(() => {
					toast.error('Failed to create');
				});
		} else {
			toast.error('Please Select the Role');
		}
	}, [createRolePermissions, filterRoleData.roleId, checkedIds]);

	// /* To expand the toggle */
	useEffect(() => {
		if (toggleExpand) {
			const nodeKeys: { [key: string]: boolean } = {};
			nodes.forEach((node) => {
				nodeKeys[node.key] = true;
			});
			setExpandedKeys(nodeKeys);
		} else {
			setExpandedKeys({});
		}
	}, [toggleExpand]);

	const ExpandCompressHandler = useCallback(() => {
		setToggleExpand((prev) => !prev);
	}, []);

	useEffect(() => {
		if (checkedIds.length) {
			setAllCheckboxList(true);
		} else {
			setAllCheckboxList(false);
		}
	}, [checked]);

	const filteredArray = checkedIds?.filter((item) => !nodes.some((node) => node.key === item));

	return (
		<>
			<div className=' flex lg:flex-row flex-col mx-4 my-4 lg:mx-6 lg:my-4'>
				{/* for role permissions  */}
				<div className='sm:w-auto  h-[70%]  lg:w-1/2 lg:mx-2'>
					<div className='w-full  shadow-2xl   border border-[#c8ced3] rounded-sm  m-auto  bg-white'>
						<div className='bg-[#f0f3f5] p-3 w-full flex flex-row justify-between border-b border-slate-300'>
							<div>
								<Dropdown placeholder={'Select role'} name='role' value={filterRoleData.roleId as number} onChange={handleChange} options={roleDropDownData} id='role' />
							</div>
							<div>
								<Button className='btn-primary btn-normal' label={''} onClick={saveRolePermissionsHandler}>
									<CheckCircle className='mr-1 ' /> {t('Save')}
								</Button>
							</div>
						</div>
						<div className='m-5'>
							<div className='flex flex-row justify-between'>
								<div>
									<label>
										<input className='mt-3' type='checkbox' checked={filteredArray.length === +data?.getPermissions?.data?.count} onChange={handleAllCheckboxChange} />
										<span className='ml-2'>{t('All')}</span>
									</label>
								</div>
								{toggleExpand ? <Compress onClick={ExpandCompressHandler} /> : <Expand onClick={ExpandCompressHandler} />}
							</div>
						</div>

						<div className={`h-[60vh] overflow-y-auto ${toggleExpand ? '' : 'scrollable-tree-container'}`}>
							<Tree value={nodes} selectionMode='checkbox' selectionKeys={checked} onSelectionChange={(e) => setChecked(e.value as TreeCheckboxSelectionKeys)} className='w-full md:w-30rem' expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} />
						</div>
					</div>
				</div>
				{/* for role  */}
				<div className='sm:w-auto mt-4 h-auto lg:w-1/2 lg:mx-2'>
					<Role />
				</div>
			</div>
		</>
	);
};
export default RolePermissions;
