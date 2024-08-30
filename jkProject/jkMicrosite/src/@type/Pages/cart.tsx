import { IImage } from "@type/Common/Base";
import { IDiamondDetails } from "@type/Pages/Products";
import { IColorStoneDetails } from "./orderDetails";


export interface ITotalRateCartDetails {
    _id: string;
    website_product_id: string;
    product_id: string;
    net_weight: number;
    is_fix_price?: number
}

export interface IProducts {
    _id: string;
    diamond_details: IDiamondDetails[];
    color_stone_details: IColor_Stone[];
    images: IImage[],
    total_diamond_carat: number;
    total_diamond_pcs: number;
    total_color_stone_pcs: number;
    total_color_stone_carat: number;
}


export interface ISummery {
    total_diamond_weight: number;
    total_metal_weight: number;
    total_cart_items_count: number;
    total_color_stone_carat: number;
}


export interface ICategoryType {
    category_type_id: string;
    category_type_name: string;
}
export interface ICategory {
    category_id: string;
    category_name: string;
}
export interface ISubCategory {
    sub_category_id: string;
    subcategory_name: string;
}
export interface ICollection {
    collection_id: string;
    collection_name: string;
}

export interface IStyle {
    style_id: string;
    style_name: string;
}

export interface IOccasion {
    occasione_id: string;
    occasion_name: string;
}

export interface IDimension {
    height: number;
    width: number;
    length: number;
}

export interface IProduct {
    _id: string;
    title: string;
    sku: string;
    hsn_code: string;
    category_type_ids: Array<string>;
    sub_category_ids: Array<string>;
    collection_ids: Array<string>;
    style_ids: Array<string>;
    occasion_ids: Array<string>;
    category_types: ICategoryType[];
    category_type_names: string;
    categories: ICategory;
    categorie_names: string;
    sub_categories: ISubCategory[];
    sub_categorie_names: string;
    collections: ICollection;
    collection_names: string;
    styles: IStyle[];
    style_names: string;
    occasions: IOccasion;
    occasion_names: string;
    gross_weight: number;
    net_weight: number;
    dimensions: IDimension;
    product_available_in_days: number;
    created_by: string;
    slug: string;
    updated_by: string;
}

export interface ICartListData {
    _id: string;
    item_id: string;
    product_id: string;
    qty: number;
    max_order_qty: string;
    min_order_qty: string;
    diamond_details: IDiamondDetails[];
    metal_quality: string;
    size_name: string;
    is_added_to_wishlist: number;
    item_price: number;
    total_rate_card_Details: ITotalRateCartDetails;
    products: IProducts;
    product: IProduct;
    remark: string;
    color_stone_details: IColorStoneDetails[];
    default_metal?: IDefault_Metal;
    default_metal_type? : string;
    hall_mark_charge?: string;
    stamping_charge?: string
    size_id?: string;
    certify_by_id?: string;
    product_size_list?: ISizeList[];
}

export interface ICartSummery {
    total_metal_weight: number;
    total_diamond_weight: number;
    total_color_stone_carat: number;
}

export interface IGiftMessage {
    gift_message: string;
    gift_recipient: string;
    gift_sender: string;
    gift_wrap_charge: number;
}


export interface Image {
    _id: string;
    name: string;
    file_name: string;
    path: string;
    relative_path: string;
    sorting: number;
}

export interface ILabour_type {
    labour_type_id: string;
    labour_type_name: string;
}
export interface IDefault_Metal {
    weight: string;
    metal_type_id: string;
    metal_type_name: string;
    metal_purity_id: string;
    metal_purity_name: string;
}

export interface IDiamond_Detials {
    type: string;
    diamond_shape_id: string;
    diamond_shape_name: string;
    diamond_sieve_id: string;
    diamond_sieve_name: string;
    diamond_quality_id: string;
    diamond_quality_name: string;
    carat: number;
    pcs: number;
}
export interface IColor_Stone {
    color_stone_shape_id: string;
    color_stone_id: string;
    carat: number,
    pcs: number,
    color_stone_shape_name: string;
    color_stone_name: string;
}

export interface IDefault_size {
    default_size_id: string;
    default_size_name: string;
    default_size_code: string;
}

export interface ISizeList {
    _id: string;
    name: string;
    code: string;
}

export interface ICart {
    cart_items: ICartListData[];
    net_total: number;
    cart_count: number;
    tax_percentage: number;
    total_tax_amount: number;
    delivery_charge: number;
    discount_amount: number;
    total_metal_price: number;
    total_diamond_price: number;
    labour_charge: number;
    total_color_stone_price: number;
    net_amount: number;
    total_cost: number;
    quotation_number: string
    _id: string;
    cart_summary: ICartSummery;
    coupon_code: string;
    gift_message?: IGiftMessage;
    account_id?: string;
}
