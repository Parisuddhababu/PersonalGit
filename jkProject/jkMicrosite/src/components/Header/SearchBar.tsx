import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import useSearchSuggestion from "@components/Hooks/SearchSuggestion/useSearchSuggestion";
import { useRouter } from "next/router";
import getConfig from "next/config";
import { IsBrowser } from "@util/common";
import Link from "next/link";

export interface ISearchBarProps {
  onClose: () => void;
}

const SearchBar = (props: ISearchBarProps) => {
  const [search, setSearch] = useState<string>("");
  const initialSearchInputRef = useRef<HTMLInputElement>(null);
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);
  const { searchResults, popularResult, getSearchAndPopularData } =
    useSearchSuggestion();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const [searchInputRef] = useState(initialSearchInputRef);

  const updateSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    getSearchAndPopularData(event.target.value);
  };

  const submitSearch = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSuggestion(true)
    getSearchAndPopularData(search);
  };

  const handleFocusChange = () => {
    setIsSuggestion(true)
    getSearchAndPopularData(search);
  };

  const handleSearchClick = (url: string) => {
    if (url.includes("http://") || url.includes("https://")) {
      const redirectURL = window.location.host || publicRuntimeConfig.FRONT_URL;
      router.replace(`/${url.replace(redirectURL + "/", "")}`);
    } else {
      router.push(`/${url}`);
    }
    setIsSuggestion(!isSuggestion);
  };

  const handleClickOutside = (event: Event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setIsSuggestion(false);
      props.onClose();
    }
  };

  useEffect(() => {
    if (IsBrowser) {
      window.addEventListener("click", handleClickOutside, true);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [searchInputRef]);

  const closeMenu = () => {
    const menuItem = document.querySelector(".menu-item");
    if (menuItem?.classList.contains("active")) {
      menuItem.classList.remove("active");
    }
  };

  return (
    <div className={`search-box ${isSuggestion ? "suggestion-open" : ""}`}>
      <form
        id="form-search"
        autoComplete="off"
        action=""
        onSubmit={submitSearch}
      >
        <input
          type="text"
          placeholder="Search Products"
          name="search"
          className="search-input"
          aria-label="topsearch"
          id="topsearch"
          ref={searchInputRef}
          onChange={updateSearch}
          onFocus={() => handleFocusChange()}
          autoComplete="off"
          //   onClick={() => setIsSuggestion(true)}
        />
      </form>
      {
        <div className="suggestion-searchbox">
          <ul className="searching-list">
            {searchResults &&
              searchResults?.map((sr, srIndex: number) => (
                <li key={srIndex} onClick={() => handleSearchClick(sr?.slug)}>
                  <Link href={`/${sr?.slug}`}>
                    <a onClick={() => closeMenu()}>
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
                  <Link href={pr?.link}>
                    <a>{pr?.name}</a>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      }
    </div>
  );
};

export default SearchBar;
