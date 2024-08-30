import { IImage } from "@type/Common/Base";

export interface ICollectionBannerData {
    _id: string;
    banner_title: string;
    link: string;
    is_active: number;
    banner_image: IImage;
    created_at: string;
}

export interface ICollectionList {
    _id: string;
    title: string;
    collection_slug: string;
    desktop_image: IImage;
    mobile_image: IImage;
    menu_logo: IImage;
}

export interface ICollectionListData {
    draw : number,
    recordsTotal : number,
    recordsFiltered : number,
    data : ICollectionList[]
}

export interface ICollection {
    collection_banner: ICollectionBannerData;
    collection_list: ICollectionListData;
}