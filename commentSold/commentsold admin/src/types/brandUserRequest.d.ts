export type BrandUserRequestProps = {
    onSearchBrandUser: (value: FilterUserProps) => void;
    filterData: PaginationParams;

};

export type BrandUserRequestForm = {
    brandName: string,
    brandRepresentative: string,
    brandEmail: string,
    sessionCount: null | number,
    influencerCount: null | number,
    requestStatus: null | string
}

export type FilterBrandUserProps = {
    search: string;
};


export type BrandUserForm = {
    domainName?: string,
    companyName: string,
    firstName?: string,
    lastName?: string,
    countryCodeId?: string,
    email: string,
    sessionCount: number | string,
    influencerCount:number | string,
    phoneNo?: string,
}