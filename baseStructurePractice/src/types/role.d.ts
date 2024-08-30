export type RoleEditProps = {
  isRoleModelShow: boolean;
  onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSubmitRole: () => void;
  onClose?: () => void;
  roleVal: string;
  isRoleEditable: boolean;
  roleObj: roleData;
};

export type roleData = {
  created_at: string;
  key: string;
  role_name: string;
  status: number;
  updated_at: string;
  uuid: string;
  id: string;
};

export type RoleChangeProps = {
  onClose: () => void;
  changeRoleStatus: () => void;
};

export type RoleInput = {
  role: string;
};

export type ColArrType = {
  name: string;
  sortable: boolean;
  fildName: string;
};

export type PaginationParams = {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
  search: string;
};
