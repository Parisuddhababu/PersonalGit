export type ColArrType = {
  name: string;
  sortable: boolean;
  fildName: string;
};
export type PaginationParams = {
  limit: number;
  page: number;
  bannerTitle: string;
  createdBy: string;
  status: number | null ;
  sortBy: string;
  sortOrder: string;
};

export type BannerDataType = {
  id: number;
  banner_image: string;
  banner_title: string;
  created_by: string;
  created_at: string;
  status: number;
  User:{
    first_name:string;
  }
};

export type BannerChangeProps = {
  onClose: () => void;
  changeRoleStatus: () => void;
};
export type BannerEditProps = {
  isShowAddEditForm: boolean;
  onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSubmitBanner: () => void;
  onClose?: () => void;
  isBannerEditable: boolean;
  bannerObj: roleData;
};

export type InitialValueProps={
  bannerTitle:string;
  createdBy:string;
  status:number | null |string;
}
export type FilterDataProps={
  bannerTitle:string;
  createdBy:string;
  status:number;
}
export type FilterDataHandlerProps = {
  filterBanner: () => void;
};
