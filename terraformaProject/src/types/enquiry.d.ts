export type FilterEnquiryProps = {
  Name: string;

  Email: string;
  status: string;
};

export type EnquiryProps = {
  onSearchEnquiry: (value: FilterEnquiryProps) => void;
  clearSelectionEnquiry:()=>void
};

export type ColArrType = {
  name: string;
  sortable: boolean;
  fieldName: string;
};

export type PaginationParams = {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
  firstName: string;
  lastName: string;
  email: string;
  status: number | null;
  role: number | null;
};

export type EnquiryChangeProps = {
  onClose: () => void;
  changeEnquiryStatus: () => void;
};

export type DeleteEnquiryProps = {
  onClose: () => void;
  deleteEnquiry: () => void;
};

export type ChangeEnquiryPassword = {
  onClose: () => void;
  EnquiryObj: EnquiryDataArr;
};

export type CreateEnquiry = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  sendAt: string;
};
export type PaginationParamsEnquiry = {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
  name: string;
  email: string;
  status: number | null;
};
