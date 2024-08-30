
export type PaginationParamsList = {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: string;
    search?: string;
    name?: string;
    userId?: string;
    brandId?: string;
};

export type InfluencerForm = {
    firstName: string,
    lastName: string,
    email: string,
    gender: number | string,
    countryCodeId: string,
    phoneNo: string
};


export type FilterInfluencerProps = {
    search: string;
};

export type FilterCatalogueProps = {
    search: string;
};
export type FilterSubAdminProps = {
    search: string;
};
export type FilterEnquiryProps = {
    search: string;
};

export type InfluencerProps = {
    onSearchInfluencer: (value: FilterUserProps) => void;
    filterData: PaginationParams;

};
export type CatalogueProps = {
    onSearchCatalogue: (value: FilterCatalogueProps) => void;
    filterData: PaginationParams;
};

export type ContactUsProps = {
    onSearchContactList: (value: FilterCatalogueProps) => void;
    filterData: PaginationParams;
}

export type BrandUserForm = {
    firstName: string,
    companyName: string,
    lastName: string,
    email: string,
    influencerCount: string | number,
    sessionCount: string | number,
    domainName?: string;
    phoneNo: string;
    phoneNumber?: string;
    countryCodeId: string;
    availableSessions?: string;
    addSessions?: string
};

export type InfluencerProductDetails = {
    uuid: string;
    name: string;
    description: string;
    url: string;
    images: {
        url: string
    }[]
    sku: string;
    price: string;
    color: string;
    size: string;
};
