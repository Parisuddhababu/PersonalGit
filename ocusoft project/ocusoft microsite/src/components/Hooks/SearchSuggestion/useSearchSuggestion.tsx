import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { useState } from "react";
import { ISearchResults } from "@components/Hooks/SearchSuggestion";

const useSearchSuggestion = () => {
  const [searchResults, setSearchResults] = useState<ISearchResults[]>();

  const getSearchAndPopularData = async (searchWords: string) => {
    await pagesServices.postPage(APICONFIG.SEARCH_AUTO_SUGGEST, {
      search_keyword: searchWords
    }).then((res) => {
      if (res?.meta?.status_code === 200 || res?.meta?.status_code === 201) {
        setSearchResults(res?.data?.search_result || []);
      }
    });
  };
  return {
    searchResults,
    getSearchAndPopularData,
    setSearchResults
  };
};

export default useSearchSuggestion;
