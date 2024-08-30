import React, { useState, ChangeEvent, useRef, useEffect, useCallback } from "react";
import useSearchSuggestion from "@components/Hooks/SearchSuggestion/useSearchSuggestion";
import Link from "next/link";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter()
  const initialSearchInputRef = useRef<HTMLInputElement>(null);
  const [isSuggestion, setIsSuggestion] = useState<boolean>(false);
  const { searchResults, getSearchAndPopularData, setSearchResults } = useSearchSuggestion();
  const [search, setSearch] = useState<string>("");
  const [searchInputRef] = useState(initialSearchInputRef);

  const updateSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setSearch('');
      setSearchResults([])
      setIsSuggestion(false)
      return
    }
    setSearch(event.target.value);
    getSearchAndPopularData(event.target.value);
    setIsSuggestion(true)
  }, []);

  const handleFocusChange = useCallback(() => {
    if (!search) {
      return
    }
    setIsSuggestion(true)
    getSearchAndPopularData(search);
  }, [search]);

  const searchCloseHandler = () => {
    setIsSuggestion(false)
  }

  const handleClose = useCallback(() => {
    if (search) {
      setSearch("")
      setSearchResults([])
      setIsSuggestion(false)
      const { pathname, query } = router;
      if (!query?.search) {
        return
      }
      delete query.search;

      router.replace({
        pathname,
        query,
      });
    }
  }, [search]);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSuggestion(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [searchInputRef]);

  useEffect(() => {
    if (router?.query?.search) {
      setSearch(router?.query?.search as string)
      return
    }
    setSearch('')
  }, [router?.query?.search])

  return (
    <div className={`search-box ${isSuggestion ? "suggestion-open" : ""}`}>
      <div className="relative"
        ref={searchInputRef}
      >
        <input
          type="text"
          placeholder="Search Products"
          name="search"
          className="search-input"
          aria-label="topsearch"
          id="topsearch"
          value={search}
          onChange={updateSearch}
          onFocus={() => handleFocusChange()}
          autoComplete="off"
        />
        <i className={search ? "osicon-close" : "osicon-search"} onClick={handleClose}></i>
      </div>
      {searchResults && searchResults?.length > 0 && ( // Conditionally render suggestions
        <div className="suggestion-searchbox">
          <ul className="searching-list">
            {searchResults.map((sr) => (
              <li key={sr?.id}>
                <Link href={sr?.slug ? `/${sr?.slug}?search=${sr?.name}` : `/products/${sr?.url_key}?search=${sr?.name}`} >
                  <a onClick={searchCloseHandler}>
                    {sr?.name} {sr?.sku ? `- ${sr?.sku}` : ""}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;



