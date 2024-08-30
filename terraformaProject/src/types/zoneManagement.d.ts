export type ZoneManagementByIdRes ={
    getZoneBySiteId:{
        message:string;
        data:{
            uuid:string;
            location:string;
            city:string;
            diversion_percentage:number;
            zoneCount:number;
        }[]
    }
}
export type ZoneDataArr={
    
        uuid:string;
        location:string;
        city:string;
        diversion_percentage:number;
        parent:ParentDataArr
      

}
export type ParentDataArr = {
    uuid:string;
    location:string;
    city:string;
    diversion_percentage:number;
    zoneCount:number;
}

export type ColArrType = {
    name : string
    sortable : boolean
    fieldName : string
    key : object
}

export type initialState = {
    siteId:string;
    existingZones: {
      uuid: string;
      name: string;
      diversion_percentage?: number | string;
    }[],
  
  };
  export type existingZones = {
    uuid: string;
    name: string;
    diversion_percentage?: number | string;
  }
  
  export type CreateOrUpdateZoneRes = {
    message: string;
  }
  