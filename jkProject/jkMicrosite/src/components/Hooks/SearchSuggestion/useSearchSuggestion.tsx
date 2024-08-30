import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { useState } from "react";
import { ISearchResults, IPopularResult } from "@components/Hooks/SearchSuggestion";

const useSearchSuggestion = () => {
  const [searchResults, setSearchResult] = useState<ISearchResults[]>();
  const [popularResult, setPopularResult] = useState<IPopularResult[]>();

  const getSearchAndPopularData = async (searchWords: string) => {
    await pagesServices.postPage(APICONFIG.SEARCH_AUTO_SUGGEST, {
        search_keyword: searchWords
    }).then((res) => {
      if (res?.meta?.status_code === 200 || res?.meta?.status_code === 201) {
        setSearchResult(res?.data?.search_result || []);
        setPopularResult(res?.data?.popular_search || []);
      }
    });
  };
  return {
    searchResults,
    popularResult,
    getSearchAndPopularData
  };
};

export default useSearchSuggestion;
