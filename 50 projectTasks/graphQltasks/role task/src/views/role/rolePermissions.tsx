import { useMutation, useQuery } from "@apollo/client";
import Dropdown from "@components/dropdown/Dropdown";
import {
  Expand,
  Compress,
  CaretRight,
  CaretDown,
  Check,
  Folder,
} from "@components/icons/index";
import { ModuleNames } from "@config/constant";
import {
  CreateAndRolePermissionsData,
  RoleDataArr,
  RolePermissionsDataArr,
} from "@framework/graphql/graphql";
import { CREARTE_ROLE_PERMISSIONS } from "@framework/graphql/mutations/rolePermission";
import { FETCH_ROLES_DATA } from "@framework/graphql/queries/role";
import {
  FETCH_PERMISSIONS,
  FETCH_ROLE_PERMISSIONS_BY_ID,
} from "@framework/graphql/queries/rolePermissions";
import React, { useCallback, useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import { toast } from "react-toastify";
import { DropdownOptionType } from "src/types/component";
import { RolePermissionsProps, TreeViewArr } from "src/types/rolePermissions";

const RolePermissions = () => {
  const { data } = useQuery(FETCH_PERMISSIONS);
  const { data: roleData } = useQuery(FETCH_ROLES_DATA);
  const { data: RolePermissionListData, refetch: getRolePermissionListById } =
    useQuery(FETCH_ROLE_PERMISSIONS_BY_ID);
  const [createRolePermissions] = useMutation(CREARTE_ROLE_PERMISSIONS);
  const [roleDropDownData, setDropDownRoleData] = useState<
    DropdownOptionType[]
  >([]);
  const [filterRoleData, setFilterRoleData] = useState<RolePermissionsProps>({
    roleId: null,
  });
  const [toggleExpand, setToggleExpand] = useState<boolean>(false);
  const [allCheckboxList, setAllCheckboxList] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  /*to expand the toggle*/
  useEffect(() => {
    if (toggleExpand) {
      setExpanded(ModuleNames);
    } else {
      setExpanded([]);
    }
  }, [toggleExpand]);

  /* all checkbox handler functionality*/
  useEffect(() => {
    if (allCheckboxList) {
      if (data?.getPermissions) {
        const checkedAll: string[] =
          data?.getPermissions?.data?.permissondata?.map(
            (i: RolePermissionsDataArr) => {
              return i.id;
            }
          );
        setChecked(checkedAll);
      }
    } else {
      setChecked([]);
    }
  }, [allCheckboxList, data?.getPermissions]);

  /*pushing data for dropDown select*/
  useEffect(() => {
    if (roleData?.fetchRoles) {
      const drpDownOptionArr = [] as DropdownOptionType[];
      roleData.fetchRoles.data.Roledata.map((data: RoleDataArr) =>
        drpDownOptionArr.push({ name: data.role_name, key: data.id })
      );
      setDropDownRoleData(drpDownOptionArr);
    }
  }, [roleData]);

  /*fetch the role  data by id*/
  useEffect(() => {
    if (filterRoleData) {
      getRolePermissionListById(filterRoleData).catch((err) =>
        toast.error(err)
      );
    }
  }, [filterRoleData, getRolePermissionListById]);

  /*set checkbox id in local variable*/
  useEffect(() => {
    if (RolePermissionListData?.fetchRolePermissions?.data !== null) {
      if (data?.count !== 0) {
        const checkedBasedOnRole: string[] = [];
        RolePermissionListData?.fetchRolePermissions?.data?.permissionList?.map(
          (i: RolePermissionsDataArr) => {
            return checkedBasedOnRole.push(i.id);
          }
        );
        setChecked(checkedBasedOnRole);
      } else {
        setChecked([]);
      }
    }
  }, [RolePermissionListData, data?.count]);

  /*select handler to get user selected value*/
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterRoleData({ roleId: parseInt(e.target.value) });
    },
    []
  );
  /*expand compress handler*/
  const ExpandCompressHandler = useCallback(() => {
    setToggleExpand((prev) => !prev);
  }, []);
  /*all checkbox handler*/
  const AllCheckBoxHandler = () => {
    setAllCheckboxList((prev) => !prev);
  };

  /*set the children data for checkbox tree*/
  const children = (value: number) => {
    if (data?.getPermissions) {
      return data.getPermissions.data.permissondata
        .map((i: RolePermissionsDataArr) => {
          if (i?.module_id === value + 1) {
            return {
              value: i?.id,
              label: i?.permission_name,
              icon: <Folder />,
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
      icon: <Folder />,
      value: ModuleNames[0],
      label: ModuleNames[0],
      children: children(0)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[1],
      label: ModuleNames[1],
      children: children(1)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[2],
      label: ModuleNames[2],
      children: children(2)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[3],
      label: ModuleNames[3],
      children: children(3)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[4],
      label: ModuleNames[4],
      children: children(4)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[5],
      label: ModuleNames[5],
      children: children(5)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[6],
      label: ModuleNames[6],
      children: children(6)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[7],
      label: ModuleNames[7],
      children: children(7)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[8],
      label: ModuleNames[8],
      children: children(8)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[9],
      label: ModuleNames[9],
      children: children(9)!,
    },
    {
      icon: <Folder />,
      value: ModuleNames[10],
      label: ModuleNames[10],
      children: children(10)!,
    },
  ];
  //function for creating role permisions
  const saveRolePermissionsHandler = useCallback(() => {
    if (filterRoleData.roleId !== null) {
      const permissionIds = checked.map((i) => parseInt(i));
      createRolePermissions({
        variables: {
          roleId: filterRoleData.roleId,
          permissionIds: permissionIds,
        },
      })
        .then((res) => {
          const data = res?.data
            ?.CreateAndRolePermissions as CreateAndRolePermissionsData;
          if (data.meta.statusCode === 200) {
            toast.success(data.meta.message);
          } else {
            toast.error(data.meta.message);
          }
        })
        .catch(() => {
          toast.error("Failed to create");
        });
    } else {
      toast.error("Please Select the Role");
    }
  }, [checked, createRolePermissions, filterRoleData.roleId]);

  return (
    <div className='w-full bg-slate-100 p-3'>
      <h6>Role Permissions</h6>
      <div className='w-full shadow-2xl border m-auto p-3 bg-white'>
        <div className='w-full flex flex-row justify-between '>
          <div>
            <Dropdown
              placeholder={"Select role"}
              name='role'
              value={filterRoleData.roleId!}
              onChange={handleChange}
              options={roleDropDownData}
              id='role'
            />
          </div>
          <div>
            <button
              onClick={saveRolePermissionsHandler}
              className='btn btn-primary'
            >
              <Check />
              save
            </button>
          </div>
        </div>
        <div>
          <div className='flex flex-row justify-between'>
            <label>
              <input
                type='checkbox'
                checked={allCheckboxList}
                onChange={AllCheckBoxHandler}
              />
              All
            </label>
            {toggleExpand ? (
              <Compress onClick={ExpandCompressHandler} />
            ) : (
              <Expand onClick={ExpandCompressHandler} />
            )}
          </div>
          <hr className='w-full my-2'></hr>
          <div className='overflow-y-scroll '>
            <CheckboxTree
              iconsClass='fa5'
              icons={{
                expandClose: <CaretRight className='inline-block' />,
                expandOpen: <CaretDown />,
              }}
              nodes={nodes}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => setChecked(checked)}
              onExpand={(expanded) => setExpanded(expanded)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default RolePermissions;
