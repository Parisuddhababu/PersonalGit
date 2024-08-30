export interface IPageServiceQuery {
  page?: string;
  search?: string;
  canonical?: string;
  category?: string;
  technology?: string;
  region?: string;
  industry?: string;
}

export interface IQuerySlugProps {
  slug?: string;
  param1?: string;
  param2?: string;
  query?: string;
}
