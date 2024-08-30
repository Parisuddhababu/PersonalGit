export type CourseAdminData = {
    user_uuid: string;
    full_name: string;
    user_type:number;
    locations: {
        uuid: string;
        location: string;
        city: string;
    }[]

}

export type PaginationParamsCourseAdmin = {
    limit: number;
    page: number;
    location: string;
    sortOrder: string;
    full_name: string;
    sortField: string;
    user_type:number|null;
    index: number;
}
export type AdminFilterValueType = {
    location: string;
    adminName: string;
    userType:number|null;
}
export type CourseAdminFilterProps = {
    filterData:PaginationParamsCourseAdmin;
    onSearchAdmin: (value: AdminFilterValueType) => void;
}

export type CourseAdminCreateProps = {
    onClose: () => void;
    isAdd: boolean;
    editId?: string;
}

export type GetCourseAdminByIdRes = {
    uuid: string;
    user: {
        email: string;
        uuid: string;
    },
    location: {
        uuid: string;
        location: string;
    }
}