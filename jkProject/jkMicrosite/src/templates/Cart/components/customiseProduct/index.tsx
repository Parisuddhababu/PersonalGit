import { ICartListData } from "@type/Pages/cart";
import CustomiseProduct from "./customiseProduct";

export interface IProductSizeList {
  name: string;
  _id: string;
  code: string;
}

export interface ICustomiseData {
  cart_item?: string;
  item_id?: string;
  qty?: number;
  net_weight?: number;
  product_id?: string;
  hall_mark_charge?: number;
  diamond_quality_id?: string;
  metal_purity_id?: string;
  metal_type_id?: string;
  metal_type?: string;
  color_stone_id?: string;
}

export interface ICustomiseSendedData {
  cart_items_ids: ICustomiseData[];
}

export interface ICustomiseProductProps {
  onClose: () => void;
  product: ICartListData;
  allAvailableCombinations: IAllAvailableCustomisation | null;
  CustomizeProductData: (_ : [ICustomiseData])=>void;
  productCombinations: ICustomiseCombinations | undefined;
}

interface IMetalType {
  metal_type_code: string;
  metal_type: string;
  metal_type_id: string;
  metal_type_name: string;
  _id: string;
}

interface IMetalPurity {
  metal_purity_code: string;
  metal_type: string;
  metal_purity_id: string;
  metal_purity_name: string;
  _id: string;
}

interface IDiamondQuality {
  diamond_quality_code: string;
  diamond_quality_id: string;
  diamond_quality_name: string;
  _id: string;
}

interface IColorStone {
  color_stone_id: string;
  color_stone_code: string;
  color_stone_name: string;
  _id: string;
}

interface ICertificate {
  _id: string;
  image: {
    _id: string;
    file_name: string;
    path: string;
    relative_path: string;
    sorting: number;
  };
}

interface IAllAvailableCustomisation {
  customizable_metal_types: IMetalType[];
  customizable_metal_purities: IMetalPurity[];
  customizable_metal: string[];
  customizable_diamonds: IDiamondQuality[];
  customizable_color_stones: IColorStone[];
  certificates: ICertificate[];
}

interface ISize {
  size_id: string;
  size_name: string;
}

interface IMetalCustomisation {
  metal_type_id: string;
  metal_type_name: string;
  metal_purity_id: string;
  metal_purity_name: string;
}

export interface IMetalTypeCustomisation {
  [metal_type: string]: IMetalCustomisation[];
}

export interface ICustomiseCombinations {
  _id: string;
  sizes: ISize[];
  metal_type: string[];
  is_fix_price: number;
  metal_customisation: IMetalTypeCustomisation;
  default_metal_type: string;
}

// Define the main data object using dynamic keys
export interface ICustomiseProductListData {
  [key: string]: { error: string };
}

export default CustomiseProduct;
