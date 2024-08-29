import { IDiamondDetails } from "@type/Pages/Products";
import { IColorStoneDetails } from "./orderDetails";
import { IImage } from "@type/Common/Base";


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
    item_price: number;
    total_rate_card_Details: ITotalRateCartDetails;
    products: IProducts;
    product: IProduct;
    remark: string;
    color_stone_details: IColorStoneDetails[]
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
    _id: string;
    cart_summary: ICartSummery;
    coupon_code: string;
    gift_message?: IGiftMessage;
    account_id?: string;
}



export interface ICartDetails {
    account_id: string;
    cart_count: number;
    cart_id: string;
    sub_total: number;
    tax_price: number;
    total_price: number;
    user_id: string;
}

export interface IcartItems {
    buy_now_qty: number;
    created_at: string;
    is_buy_now: number;
    item_id: string;
    product_id: string;
    qty: number;
    updated_at: string;
    _id: string;
    products: IProducts1
}

export interface IProducts1 {
    is_active: number;
    product_detail: {
        base_image: string;
        name: string;
        sku: string;
        tax_class_name: string;
        url_key: string;
        _id: string;
        product_purchase_limit: number;
    }
    product_id: string;
    selling_price: number;
    _id: string;
}

export interface ICartData {
    cart_details: ICartDetails;
    cart_items: IcartItems[]
}

export interface IShipping {
    code: number;
    title: string;
    _id: string;
    rate?: number;
    is_default: number;
}

export interface IPaymentMethod {
    payment_gateway_id: string,
    payment_gateway_name: string,
    ACCOUNT_HOLDER_NAME: string,
    ACCOUNT_NUMBER: string,
    BANK_NAME: string,
    IFSC_CODE: string,
    STRIPE_PUBLIC_KEY: string
    PAYPAL_EMAIL?: string
    SECRET_KEY?: string
    CLIENT_ID?: string
}