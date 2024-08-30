export type DiversionSettingsData = {
    end_date: number,
    end_month: number,
    frequency: string,
    location_id: string,
    start_date: number,
    start_month: number
}

export type DiversionReportHistoryType = {

    contractor_company: {
        name: string;
        uuid: string;
    }
    location: {
        location: string;
        uuid: string;
    }
    subscriber: {
        uuid: string;
    }
    title: string;
    start_date: string;
    end_date: string;
    frequency: string;
    uuid: string;

}
export type DiversionReportHistoryRes = {
    count: number;
    diversionReportHistory: DiversionReportHistoryType[]
}

export type ColArrType = {
    name: string
    sortable: boolean
    fieldName: string
}

export type DiversionHistoryRes = {
    user: {
        first_name: string;
        last_name: string;
        uuid: string;
    }
    subscriber: {
        uuid: string;
    }
    start_date: string;
    end_date: string;
    location: {
        uuid: string;
        location: string;
    }
    invoice: string;
    frequency_time: string;
    document: string;
    contractor_company: {
        name: string;
        uuid: string;
    }
    services: DiversionReportContractorRes[];
}

export type DiversionReport1FormikTypes = {
    zone_id: string;
    service_type: string;
    material_id: string;
    material_type_id: string;
    equipment_id: string;
    volume_id: string;
    equipment: string;
    frequency_id: string;
    add_units: number;
    lifts: number;
    volume: string;
    approx_weight_per_unit: number;
    approx_weight_per_month: number;
    company_id: string;
    report_id: string;
    user_id: string;
    compactor_lifts: { name: string, uuid: string, weight: number, date?: Date | null }[],
    delete_lifts: string[],
    document: string;
    invocie?: string;
    volume_name?: string;
}

export type AddNewOneOffsDiversionReport1 = {
    company_id: string;
    zone_id: string;
    service_type: string;
    material_id: string;
    material_type_id: string;
    equipment_id: string;
    volume_id: string;
    equipment: string;
    frequency_id: string;
    add_units: number;
    lifts: number;
    volume: string;
    approx_weight_per_unit: number;
    approx_weight_per_month: number;
    volume_name: string;
}

export type WeightListFormikType = {
        zone_id: string;
        service_type: string;
        material_id: string;
        material_type_id: string;
        equipment_id: string;
        volume_id: string;
        equipment: string;
        frequency_id: string;
        add_units: number;
        lifts: number;
        volume: string;
        approx_weight_per_unit: number;
        approx_weight_per_month: number;
        volume_name: string;
}