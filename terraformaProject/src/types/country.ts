export type CreateCountry = {
    name:string
    countryCode:string
    status:number
}

export type DeleteCountryProps = {
    onClose: () => void
    deleteCountry: () => void
}
export type CountryChangeProps = {
    onClose: () => void
    changeCountryStatus: () => void
}
export type ColArrType = {
    name : string
    sortable : boolean
    fieldName : string
}

export type FilterCountryProps = {
    name : string,
    countryCode : string,
    status : string,

}

export type CountryProps = {
    onSearchCountry : (value : FilterCountryProps) => void
    clearSelectionCountry:()=>void
}
export type PaginationParams = {
    limit : number
    page : number
    sortBy : string
    sortOrder : string
    name:string,
    countryCode:string,
    status: number | null ,

}
