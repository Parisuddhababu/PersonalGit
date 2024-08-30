import { IImage } from "@type/Common/Base";

export interface customDesignSteps {
    //  Main Testimonials list
    data: CustomiseDesignOriginal;
}

export interface CustomiseDesignOriginal {
    original: CustomiseDesignDataValue
}
export interface CustomiseDesignDataValue {
    data: IcustomDesignStepsData[]
}
export interface IcustomDesignStepsData {
    id: string;
    title: string;
    description: string;
    image: IImage
}


export interface ICustomiseForm {
    name: string;
    email: string;
    number: string;
    address: string;
    description: string;
    diamond_quality_id: string;
    metal_type_id: string;
    metal_purity_id: string;
    type: string;
    country_code: string;
}


export interface customerDesignBanner {
    banner_image: IImage
}

export interface IDiamondQuality {
    _id: string;
    name: string;

}
export interface IMetalType {
    _id: string;
    code: string;
}

export interface IPurityListType {
    name: string;
    type: string;
    _id: string;
}

export interface IOtherValueType {
    price_range? : [number, number],
    custom_image? : File | null
    upload_logo? : File | null
}
export interface ICustomise {
    custom_design_steps: customDesignSteps;
    custome_design_banner: customerDesignBanner[]
    diamond_quality_data: IDiamondQuality[]
    metal_type: IMetalType[]
    color_type: IPurityListType[]
}
