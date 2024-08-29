export interface IModule {
  _id: string;
  name: string;
  code: string;
  input_type: string;
  is_collection_customize: number;
}

export interface IModuleData {
  _id: string;
  name: string;
  parent_id: string;
  customization_id: string;
  type: number;
  is_active: number;
  slug: string;
  updated_at: string;
  created_at: string;
  min: number;
  max: number;
  category_type: {
    category_type_id: string;
    name: string;
  };
  category_type_id: string;
  title: string;
}

export interface IFilterOptions {
  _id: string;
  type_id: string;
  module: IModule;
  module_data: IModuleData[];
  applyRange?: {
    min: number;
    max: number;
  } | null;
}
export interface IURLFILCategory {
  _id: string;
  name: string;
  parent_id: string;
  slug: string;
}

export interface IURLCommonFilter {
  _id: string;
  name: string;
  is_active: number;
}

export interface IFilterAppliedState {
  module_name: string;
  ids: string[];
  category_type_id?: string[];
  category_id?: string[];
}

export interface IURLFilterApplyData {
  category: IURLFILCategory[];
  price: string[];
  metal_wt: IURLCommonFilter[];
  diamond_qty: IURLCommonFilter[];
  diamond_shape: IURLCommonFilter[];
  size: IURLCommonFilter[];
  metal_type: IURLCommonFilter[];
  metal_purity: IURLCommonFilter[];
  collection: IURLCommonFilter[];
  style: IURLCommonFilter[];
}
