export interface IRating {
  enable: boolean;
  avg: number;
  count: number;
  min_rating: number;
}

export interface IRatingsRes {
  status: number;
  message: string;
  data: IRating;
}

export interface IRatingsReq {
  post_slug: string;
  rating: number;
}
