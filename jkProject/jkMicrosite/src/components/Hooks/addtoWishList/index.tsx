export interface IAddtoWishList {
  account_id: string;
  item_id: string;
  type: number;
  fromCart?: boolean;
}

export interface IRemoveWishList {
  account_id: string;
  item_id: any;
  type?: any;
  meta: {
    status_code: string | number;
  };
}
