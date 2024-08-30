export type DiversionReportContractorRes={
        is_material_updated:boolean;
        is_material_type_updated:boolean;
        is_equipment_updated:boolean;
        is_volume_updated:boolean;
        is_service_type_updated:boolean;
        add_units:number;
        approx_weight_per_month:number;
        approx_weight_per_unit:number;
        is_approx_weight_per_month_updated:boolean;
        lifts:number;
        contractor_company: {
          uuid:string;
          name:string;
        }
        document
        end_date:string;
        end_month:string;
        equipment :{
          name:string;
          uuid:string;
        }
        frequency :{
          uuid:string;
          frequency_type:string;
          frequency:number;
        }
        frequency_time
        invoice
        is_draft:boolean
        is_full_site:boolean
        is_submitted:boolean
        location :{
          uuid:string;
          location:string;
        }
        material :{
          uuid:string;
          name:string;
        }
        material_type :{
          type:string;
          uuid:string;
          weight:number;
        }
        service_type:string;
        start_date:string;
        start_month:string;
        subscriber :{
          uuid:string;
        }
        user: {
          first_name:string;
          last_name:string;
          uuid:string;
        }
        volume: {
          uuid:string;
          volume:string;
          volume_cubic_yard:number;
        }
        zone :{
          location:string;
          uuid:string;
        }
        uuid:string;
        lift :{
          uuid:string;
          name:string;
          date:date|null|undefined;
          weight:number
        }[]
        frequency_time:string;
      
}