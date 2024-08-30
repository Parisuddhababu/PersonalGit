import { IPagination } from "@type/Common/Base";
import { IPriceBreakup } from "./Products";
import { IProductTagList } from "@components/Meta";

export interface IRecentlyViewList {
    original: IRecentlyViewListData
    type : string
    product_tags_detail?: IProductTagList[];
}


export interface IRecentlyViewListData extends IPagination {
    data: IRecentlyViewRecords[]
}

export interface IProduct {
    _id: string;
    title: string;
    sku: string;
    hsn_code: number;
    slug: string;
    gross_weight: number;
    is_available_for_order ?:number
}
export interface IRecentlyViewRecords {
    _id: string;
    net_weight: number;
    images: [],
    product_id: string;
    product: IProduct;
    currency: string;
    is_in_wishlist: number;
    price_breakup: IPriceBreakup;
    diamond_total_carat: number;
    is_available_for_order: number;
    is_discounted?:number
    discount_per?: number
    product_tag_name: string;
    discount_percentage?: number;
}

export interface IRecentlyViewd {

    recently_view: IRecentlyViewList
}
