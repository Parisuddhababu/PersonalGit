export type CreateSettings= {
    siteName: string,
    tagLine: string,
    supportEmail: string,
    contactEmail: string,
    contactNo: string|number,
    appLanguage: string,
    address: string,
    logo:   string ,
    favicon:string ,
    sidebarShowType?:string
}

export type FileDataProps={
    name:string
}