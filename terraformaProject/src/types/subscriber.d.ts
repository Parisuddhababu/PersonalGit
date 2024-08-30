import { SubscriberDataArr, SubscriberDatalist } from '@framework/graphql/graphql';

export type CreateSubscriber = {
    firstName?: string;
    lastName:string;
    Email?: string;
    SubscribedCompany?: string;
    PhoneNumber?: string;
    StartDate?: string;
    ExpireDate?: string;
    NumberOfUsers?: string
    PlanStatus?: string
    SubscribedPlan?: number
    Address?:string
		countryCode?:string
		Logo?:string
    status: string,
		location?:string,
		city?:string,
    branch_data?: string,
    editedIndex?: number | null;
    uuid?: string
    branches?: {uuid?: string; location?: string, city?: string}[],
    subscriber_id?: string, 
    thumbnail?: string
  };
  export type ColArrType = {
    name : string
    sortable : boolean
    fieldName : string
  }
  export type PaginationParams = {
    search? : string
    limit: number;
    page: number;
    sortField: string;
    sortOrder: string;
    category_ids?: string[];
    playlist_id?: string | null,
    duration?: {
      max: number | null,
			min: number
    },
    languages?: string | null | string[],
    index?: number
    level?: number | undefined
    company_type?:number
    requestedCompanyApproval?:boolean
    ticket_type?: null | number | undefined
    course_type?:null|number|string;
    category_id?:string;
  };
  export type ChangePasswordSubscribersProps ={
    onClose: () => void
    data : SubscriberDatalist
    openPopUp?:boolean
  }

  export type PaginationParamsCourseInProgress = {
    search? : string
    limit: number;
    page: number;
    sortField: string;
    sortOrder: string;
    category_id?: string;
    type:number;
  };

  export type PaginationParamsCourseByCategory={
    search? : string
    limit: number;
    page: number;
    sortField: string;
    sortOrder: string;
    categoryId: string;
  }