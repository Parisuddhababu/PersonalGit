export interface IAddtoCart {
    item_id: string;
    qty: number;
    size_id?: string;
    from_guest?: boolean;
    net_weight?: number;
    is_from_product_list?: number
    productId?: string
    is_buy_now?: number
}

export interface IUpdateCart {
    qty?: number;
    cart_item: string;
    remark?: string;
}
export interface IDeleteCart {
    cart_items_id: string[];
    cart_id: string;
}

export interface ICoupon {
    coupon_code: string;
    cart_id: string;
}

export interface IGuestUserData {
    _id: string;
    item_id: string;
}

export interface ICustomiseAddtoProduct {
    item_id: string;
    qty: number;
    hall_mark_charge: number;
    diamond_quality_id: string;
    metal_purity_id: string;
    metal_type_id: string;
    color_stone_id: string;
    stamping_charge: string;
    certify_by_id: string;
    size_id: string;
    new_size_id: string;
}

export interface IGuestCartData {
    item_id: string;
    qty?: number;
    is_from_product_list?: number;
    productId?: string;
}