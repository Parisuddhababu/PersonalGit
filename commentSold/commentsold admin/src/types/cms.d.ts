export type ColArrTypeNew = {
    name: string;
    sortable: boolean;
    fieldName: string;
    type: 'image' | 'text' | 'date' | 'status' | 'action';
    headerCenter: boolean;
};

export type PaginationParams = {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: string;
    search: string;
};

export type DeleteCmsProps = {
    onClose: () => void;
    deleteCms: () => void;
};

export type CreateCms = {
    key: string;
    value: string;
    isActive: string;
};

export type Cms = {
    key: string;
    value: string;
    is_active: boolean | string;
    uuid: string;
};
