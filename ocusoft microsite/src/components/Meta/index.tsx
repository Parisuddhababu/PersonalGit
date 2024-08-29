import Meta from "@components/Meta/Meta";
import { IImage } from "@type/Common/Base";
export type SlugInfoProps = {
    slug_info: {
        slug_detail: {
            meta_title: string
            meta_keyword: string
            meta_robot_option: string
            meta_description: string
            script: string
            image?: string | null
        }
    }
    favicon_image : IImage
    social_text_display:string
    product_tags_detail?: IProductTagList[]
}
export type MetaProps = {
    meta: SlugInfoProps
    domainName?: string
}

export interface IProductTagList{
    code?: string;
    title: string
    _id: string
    product_tag_image?: IProductTagImg[]

}

export interface IProductTagImg{
    tag_color : string
    tag_id : string
    _id : string
    tag_image?: {path : string}
}

export default Meta;
