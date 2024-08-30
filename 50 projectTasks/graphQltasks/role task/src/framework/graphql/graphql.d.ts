export type LoginResponse = {
  loginUser: {
    data: {
      token: string;
      user: {
        email: string;
        id: string;
      };
    };
  };
};

export type ForgotPasswordResponse = {
  forgotPassword: {
    id: number;
    message: string;
    link: string;
  };
};

export type ResetPasswordResponse = {
  resetPassword: {
    message: string;
  };
};

export type RolePermissionsDataArr = {
  id: string;
  module_id: number;
  permission_name: string;
  key: string;
  status: number;
  created_by: int;
  createdAt: string;
  updatedAt: string;
};
export type RolePermissionsData = {
  permissondata: RolePermissionsDataArr[];
  count: number;
};

export type CreateAndRolePermissionsData = {
  meta: MetaRes;
};

export type RoleResponse = {
  fetchRoles: {
    data: {
      Roledata: roleDataArr[];
    };
    meta: MetaRes;
  };
};

export type MetaRes = {
  message: string;
  status: string;
  statusCode: number;
};

export type RoleCreateRes = {
  createRole: {
    data: roleData;
    meta: MetaRes;
  };
};

export type RoleData = {
  Roledata: roleDataArr;
  count: number;
};

export type UpdateRoleStatusType = {
  updateStatusRole: {
    data: roleData;
    meta: MetaRes;
  };
};

export type UpdateRoleDataType = {
  updateRole: {
    data: roleData;
    meta: MetaRes;
  };
};

export type RoleDataArr = {
  created_at: string;
  key: string;
  role_name: string;
  status: number;
  updated_at: string;
  uuid: string;
  id: string;
};

export type roleDataArr = {
  id: number;
  uuid: string;
  status: number;
  role_name: string;
};
export type roleData = {
  Roledata: roleDataArr;
  count: number;
};
