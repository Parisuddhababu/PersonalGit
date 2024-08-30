import { ICartListData } from "@type/Pages/cart";
import CustomiseBar from "./customiseBar";
import { ICustomiseCombinations } from "../customiseProduct";

export interface ICustomiseBar {
  selectedProducts: ICartListData[];
  allAvailableCombinations: ICutomizeOptions | null ;
  productCombinations: ICustomiseCombinations[] | undefined;
  CustomizeProductData: (_ : any) => void
}

export interface ICustomizeMetalColor {
  metal_type_code: string;
  metal_type_id: string;
  metal_type_name: string;
  _id: string;
}

export interface ICustomizeMetalPurity {
  metal_purity_code: string;
  metal_purity_id: string;
  metal_purity_name: string;
  _id: string;
}

export interface ICustomizeDiamondQuality {
  diamond_quality_code: string;
  diamond_quality_id: string;
  diamond_quality_name: string;
  _id: string;
}

export interface ICustomizeColorStone {
    color_stone_id: string;
    color_stone_code: string;
    color_stone_name: string;
    _id: string;
  }

export interface ICutomizeOptions {
  customizable_metal_types?: ICustomizeMetalColor[];
  customizable_metal_purities?: ICustomizeMetalPurity[];
  customizable_metal?: string[];
  customizable_diamonds?: ICustomizeDiamondQuality[];
  customizable_color_stones?:ICustomizeColorStone[];
}

export interface ISelectedOptions{
  MetalType : null | string ;
  MetalPurity : null | string ;
  MetalColor:null | string ;
  Diamond :null | string ;
  ColorStone:null | string ;
}

export default CustomiseBar;
