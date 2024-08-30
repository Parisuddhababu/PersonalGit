export type PaginationParamsCourselearners = {
    limit: number;
    page: number;
    location: string;
    sortOrder: string;
    user_name: string;
    sortField: string;
    course_status:number|null;
    user_type:number|null;
    index: number;
}

export type LearnerData ={
    user_uuid:string;
    first_name:string;
    last_name:string;
    user_type:number;
    status:number;
    subscriber_branch_name:string;
}

export type FilterLearnerValueType = {
    user_name: string;
    location: string;
    status:number|string;
    user_type:number|string;
}

export type LearnerFilterProps = {
    filterData:PaginationParamsCourselearners
    onSearchLearner: (value: FilterLearnerValueType) => void;
}