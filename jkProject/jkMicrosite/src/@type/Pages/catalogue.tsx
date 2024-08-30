import { IImage } from "@type/Common/Base"

export interface ICatalogue {
    catalogue_list: ICatalogueListData[],
    catalogue_banner: ICatalogueBanner[]
}

export interface ICatalogueBanner {
    _id: string,
    banner_title: string,
    link: string,
    banner_image: IImage,
    is_active: string,
    created_at: string
}

export interface IWebsitePortal {
    _id: string,
    product_id: string,
    catalogue_ids: Array<[]>
}

export interface ICatalogueListData {
    _id: string,
    title: string,
    description: string,
    catalog_slug: string,
    pdf: IImage,
    collection_image: IImage,
    jewellery_size: number,
    website_product: IWebsitePortal[]
    is_custom_product: number
}