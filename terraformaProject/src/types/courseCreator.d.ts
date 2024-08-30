export type CourseCreatorData = {
    user_uuid: string;
    full_name: string;
    locations: {
        uuid: string;
        location: string;
        city: string;
    }[]

}

export type PaginationParamsCourseCreator = {
    limit: number;
    page: number;
    location: string;
    sortOrder: string;
    full_name: string;
    sortField: string;
    index: number;
}
export type FilterValueType = {
    location: string;
    creatorName: string;
}
export type CourseFilterProps = {
    filterData:PaginationParamsCourseCreator;
    onSearchCreator: (value: FilterValueType) => void;
}

export type CourseCreateProps = {
    onClose: () => void;
    isAdd: boolean;
    editId?: string;
}

export type GetCourseCreatorByIdRes = {
    uuid: string;
    user: {
        first_name:string;
        last_name:string;
        email: string;
        uuid: string;
    },
    location: {
        uuid: string;
        location: string;
    }
}