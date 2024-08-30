export type ColArrType = {
    name : string
    sortable : boolean
    fieldName : string
    key : object
}


export interface PaginationParams  {
    limit : number;
    page : number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    sortField?: string;
    index?: number;
    citySearch?: string,
    locationSearch?:string,
}

export type PaginationParamsNew = {
    sortOrder : string
    sortField : string
    limit : number
    page : number
    search : string
    index: number
    user_types: number[]
    course_id: string
}

export type DeleteCmsProps = {
    onClose: () => void
    deleteCms: () => void
}

export type CreateCms = {
    status: string|number,
    titleEnglish: string,
    descriptionEnglish: string,
    metaTitleEnglish: string,
    metaDescriptionEnglish: string
}