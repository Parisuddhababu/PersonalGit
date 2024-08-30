import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import useSearchSuggestion from "@components/Hooks/SearchSuggestion/useSearchSuggestion";
import { useRouter } from "next/router";
import getConfig from "next/config";
import Link from "next/link";
import { IsBrowser } from "@util/common";

const SearchBarTemplate2 = () => {
  const [search, setSearch] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);
  const { searchResults, popularResult, getSearchAndPopularData } = useSearchSuggestion();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const updateSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    getSearchAndPopularData(event.target.value);
  };

  const handleSearchButton = () => {
    setIsSuggestion(true);
    getSearchAndPopularData(search);
  };

  const handleSearchClick = (url: string) => {
    if (url.includes("http://") || url.includes("https://")) {
      router.replace(`/${url.replace(publicRuntimeConfig.FRONT_URL + "/", "")}`);
    } else {
      router.push(`/${url}`);
    }
    setIsSuggestion(!isSuggestion);
  };

  const handleClickOutside = (event: Event) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
      setIsSuggestion(false);
    }
  };

  useEffect(() => {
    if (IsBrowser) {
      window.addEventListener("click", handleClickOutside, true);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchInputRef) {
      // if (searchInputRef.current) searchInputRef.current.focus();
    }
  }, [searchInputRef]);

  return (
    <>
      <div className={`search-box ${isSuggestion ? "suggestion-open" : ""}`}>
        <input
          type="text"
          placeholder="Search Products"
          name="search"
          id="topsearch"
          className="form-control"
          ref={searchInputRef}
          onChange={updateSearch}
          onFocus={() => handleSearchButton()}
          autoComplete="off"
          // onClick={() => setIsSuggestion(true)}
        />

        {isSuggestion && (
          <div className="suggestion-searchbox">
            <ul className="searching-list">
              {searchResults &&
                searchResults?.map((sr, srIndex: number) => (
                  <li key={srIndex} onClick={() => handleSearchClick(sr?.slug)}>
                    <Link href={`/${sr?.slug}`}>
                      <a>
                        {sr?.name} {sr?.sku ? `- ${sr?.sku}` : ""}
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>
            <ul className="default-list">
              {popularResult && popularResult?.length > 0 ? (
                <li className="disabled">
                  <span>People are searching</span>
                </li>
              ) : (
                <></>
              )}
              {popularResult &&
                popularResult?.map((pr, prIndex: number) => (
                  <li key={prIndex} onClick={() => handleSearchClick(pr?.link)}>
                    <a href={pr?.link}>{pr?.name}</a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBarTemplate2;
