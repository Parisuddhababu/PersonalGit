import useSearchSuggestion from "@components/Hooks/SearchSuggestion/useSearchSuggestion";

export interface ISearchResults {
  id: string;
  name: string;
  slug: string;
  sku: string;
  url_key: string;
}

export interface IPopularResult {
  name: string;
  link: string;
  is_active: number;
}

export interface ISearchSuggestion {}

export default useSearchSuggestion;
