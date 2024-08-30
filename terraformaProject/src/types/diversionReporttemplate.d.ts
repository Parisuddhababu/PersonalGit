export type ColArrType = {
    name: string
    sortable: boolean
    fieldName: string
}

export type GetAllLocations = {
    uuid: string;
    location: string;
    city: string;
    diversion_percentage: number;
    zoneCount: string;
}

export type DiversionReportTemplateRes = {
    uuid: string,
    service_type: string,
    material: { uuid: string; name: string; },
    material_type: {
        uuid: string;
        type: string;
        weight: number;
    },
    equipment: { uuid: string; name: string; },
    volume: { uuid: string; volume: string; volume_cubic_yard: string; }
};
export type DiversionReportTemplateGetByIdRes = {
    uuid: string,
    service_type: string,
    is_updated: boolean;
    is_duplicated: boolean;
    material: { uuid: string; name: string; },
    material_type: {
        uuid: string;
        type: string;
        weight: number;
    },
    equipment: { uuid: string; name: string; },
    volume: { uuid: string; volume: string; volume_cubic_yard: string; },
    location: { uuid: string; location: string; city: string; },
    subscriber: { uuid: string; }
}
export type InitialValues= {
    diversionReportTemplateData: DiversionReportTemplateData
}

export type DiversionReportTemplateData= {
    equipment_id: string;
    location_id: string;
    material_id: string;
    material_type_id: string;
    service_type: string;
    volume_id: string;
    equipment?:string;
    volume_name?:string;
}