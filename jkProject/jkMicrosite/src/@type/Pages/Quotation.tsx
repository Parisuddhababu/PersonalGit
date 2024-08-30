import { IColor_Stone, IDefault_Metal, IProduct, IProducts, ISummery } from "@type/Pages/cart";

export interface I_Quotation_Cart_Item {
    color_stone_details: IColor_Stone[];
    products: IProducts;
    total_rate_card_Details: IRateCard;
    default_metal: IDefault_Metal;
    product: IProduct;
    diamond_details: IDiamond_Detail[];
    qty: number;
    size_name: string;
    metal_quality: string;
}


export interface IDiamond_Detail {
    carat: number;
    diamond_quality: string;
    diamond_quality_id: string;
    diamond_quality_name: string;
    diamond_shape: string;
    diamond_shape_id: string;
    diamond_shape_name: string;
    diamond_sieve: string;
    diamond_sieve_id: string;
    diamond_sieve_name: string;
    pcs: number;
    per_carat_rate: number;
    total_price: number;
    type: string;
}
export interface IRateCard {
    certificate_charge: number;
    color_stone_details: []
    hallmark_charge: number;
    labour_charge: number;
    net_weight: null;
    per_carat_labour_charge: number;
    per_metal_weight_rate: number;
    stamping_charge: number;
    total_color_stone_price: number;
    total_diamond_price: number;
    total_fancy_diamond_price: number;
    total_metal_price: number;
    total_price: number;
    total_side_diamond_price: number;
    metal_rate: number;
    color_stone_rate: number;
    discount_per: number;
    is_fix_price: number;
    item_price: number;
    original_total_price: number;
    is_discounted: number;
}
export interface IQuotation {
    cart_items: I_Quotation_Cart_Item[];
    cart_summary: ISummery;
    delivery_charge: number;
    discount_amount: number;
    net_total: number;
    quotation_number: string;
    total_cost: number;
    total_tax_amount: number;
    net_amount: number;
    _id: string;
    total_color_stone_price: number;
}

