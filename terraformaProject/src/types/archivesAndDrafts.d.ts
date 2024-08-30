export type ArchivesAndDraftData={
    uuid:string;
    title:string;
    subtitle:string;
    description:string;
    estimate_time:string;
    is_certification:boolean;
    prerequisite:string;
    course_image:string;
    banner_image:string;
    instructor_profile:string;
    instructor_name:string;
    instructor_qualification:string;
}

export type PaginationParamsArchives={
    course_flag:number;
    limit: number;
    page: number;
    sortOrder: string;
    search: string;
    sortField: string;
    index:number;
}

export type SearchValueArchives={ 
    courseName: string;
 }

export type FilterPropsArchives= {
    filterData:PaginationParamsArchives
     onSearchArchives: ( value:SearchValue ) => void;
}