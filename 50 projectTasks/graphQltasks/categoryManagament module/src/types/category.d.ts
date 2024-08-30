export type PaginationParams = {
  limit: number;
  page: number;
  search: string;
  sortBy: string;
  sortOrder: string;
};
export type PaginationParamsList = {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: string;
  title: string;
  created_at: string;
  annoucemntType: string;
  platform: string;
  startDate: string;
  endDate: string;
};
export type categoryChangeProps = {
  onClose: () => void;
  changeCategoryStatus: () => void;
};
export type ColArrType = {
  name: string;
  sortable: boolean;
  feildName: string;
};
export type categoryDeleteProps = {
  onClose: () => void;
  deleteCategoryData: () => void;
};
export type CategoryTreeDataArr = {
  id: number;
  category_name: string;
  parent_category: number;
  parentData: {
    category_name: string;
    id?: number;
  };
};
export type DropdownOptionCategoryTree = {
  name: string | number;
  key: string | number;
  parentId: number | string;
  parentName: number | string;
};
export type TreeNode = {
  key: number;
  label: string;
  children?: TreeNode[];
};

export type TreeViewProps = {
  data: TreeNode[];
};
export type TreeNodeProps = {
  key: number;
  label: string;
  data?: string;
  children?: TreeNodeProps[];
};
