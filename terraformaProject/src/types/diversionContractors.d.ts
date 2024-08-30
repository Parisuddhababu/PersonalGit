export type DiversionContractorDataArr={
    uuid: string;
    subscriber: {
      uuid: string;
    },
    location: {
      uuid: string;
      location: string;
    },
    contractor_company: {
      name: string;
      uuid: string;
    },
    service_count: number
}


export type DiversionContractorsRes ={ 
    diversionContractors:DiversionContractorDataArr[]
    count:number;
}

export type ColArrType = {
  name: string
  sortable: boolean
  fieldName: string
}

export type contractorsDrpDownListRes = {
  first_name: string;
  last_name: string;
  uuid: string;
  user_type: number;
}
export type DiversionReportServicesListRes = {
  add_units: number;
  contractor_company: {
      name: string;
      uuid: string;
  };
  frequency: {
      uuid: string;
      frequency_type: string;
      frequency: string;
  };

  subscriber: {
      uuid: string;
  };
  diversion_report_template: {
      uuid: string;
      volume: {
          uuid: string;
          volume: string;
          volume_cubic_yard: number;
      };
      location: {
          location: string;
          uuid: string;
      };
      equipment: {
          name: string;
          uuid: string;
      };
      material: {
          name: string;
          uuid: string;
      };
      material_type: {
          uuid: string;
          type: string;
          weight: string;
      };
      service_type: string;

  };
  user: {
      first_name: string;
      last_name: string;
      uuid: string;
  };
  zone: {
      location: string;
      uuid: string;
  }
  uuid: string;
  is_full_site: boolean;
}
export type AddtimeSetData={
  add_units: number|string;
  contractor_company: {
      name: string;
      uuid: string;
  };
  frequency: {frequency:number|null;frequency_type:string,uuid:string};

  subscriber: {
      uuid: string;
  };
  diversion_report_template: {
      uuid: string;
      volume: {
          uuid: string;
          volume: string;
          volume_cubic_yard: number;
      };
      location: {
          location: string;
          uuid: string;
      };
      equipment: {
          name: string;
          uuid: string;
      };
      material: {
          name: string;
          uuid: string;
      };
      material_type: {
          uuid: string;
          type: string;
          weight: string;
      };
      service_type: string;

  };
  user: {
      first_name: string;
      last_name: string;
      uuid: string;
  };
  zone: {
      location: string;
      uuid: string;
  }
  uuid: string;
  is_full_site: boolean;
};
export type InitialValuesCreateDiversionReport = {
  add_units: number;
  frequency_id: string;
  zone_id: string;

}
export type SetTableviewType={  
  uuid: string;
  volume: {
      uuid: string;
      volume: string;
      volume_cubic_yard: number;
  };
  location: {
      location: string;
      uuid: string;
  };
  equipment: {
      name: string;
      uuid: string;
  };
  material: {
      name: string;
      uuid: string;
  };
  material_type: {
      uuid: string;
      type: string;
      weight: string;
  };
  service_type: string; 
  subscriber:{
      uuid:string;
  }
}