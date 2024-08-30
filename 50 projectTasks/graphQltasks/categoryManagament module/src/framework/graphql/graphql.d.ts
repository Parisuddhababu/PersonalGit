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


export type UserDataType = {
  userList: UserData;
  count: number;
};

export type UserData = {
  created_at: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  gender: number;
  id: number;
  last_name: string;
  middle_name: string;
  phone_country_id: string;
  phone_no: string;
  profile_img: string;
  role: number;
  status: number;
  updated_at: string;
  user_name: string;
  user_role_id: number;
  uuid: string;
};


export type countryArrList = {
  country_code: string;
  name: string;
  status: number;
};
export type CountryDataArr = {
  id: number;
  country_code: string;
  status: number;
  created_at: string;
  updated_at: string;
  name: string;
  uuid: string;
};

export type CountryData = {
  countryData: CountryDataArr;
  count: number;
};

export type CountryDataArr = {
  id: number;
  uuid: string;
  name: string;
  country_code: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CategoryDataArr = {
  id: number;
  uuid: string;
  category_name: string;
  parent_category: number;
  description: string;
  status: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  parentData: {
    id: number;
    uuid: string;
    category_name: string;
    parent_category: number;
    description: string;
    status: number;
    created_by: number;
    created_at: string;
    updated_at: string;
  };
};

export type CategoryData = {
  Categorydata: CategoryDataArr;
  count: number;
};

export type UpdateCategoryStatusType = {
  categoryStatusUpdate: any;
  updateStatuscategory: {
    data: roleData;
    meta: MetaRes;
  };
};

export type categoryDataArr = {
  id: number;
  uuid: string;
  category_name: string;
  parent_category: number;
  description: string;
  status: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  parentData: {
    id: number;
    uuid: string;
    category_name: string;
    parent_category: number;
    description: string;
    status: number;
    created_by: number;
    created_at: string;
    updated_at: string;
  };
};

export type categoryData = {
  Categorydata: CategoryDataArr;
  count: number;
};
