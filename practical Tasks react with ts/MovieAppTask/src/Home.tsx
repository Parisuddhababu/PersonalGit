import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Result from "./component/Result";
import "./App.css";
export type ResultProps = {
  poster_path: string;
  original_title: string;
  vote_average: number;
  overview: string;
  movies: { image: string; title: string; rating: number; overView: string }[];
};
const APIURL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";

const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const Home: React.FC = () => {
  const [movies, setMovies] = useState([]);

  const [search, setSearch] = useState<string>("");

  const SearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const getAllMovies = () => {
    axios
      .get(APIURL)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSearchedMovies = () => {
    axios
      .get(SEARCHAPI + search)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setMovies([]);

    if (search === "") {
      getAllMovies();
    } else {
      getSearchedMovies();
    }
  }, [search]);

  return (
    <div className="container">
      <input
        type="search"
        value={search}
        onChange={SearchChangeHandler}
        className="input-container"
      />
      {movies.length === 0 ? (
        <div className="load-text"> Loading... </div>
      ) : (
        <Result movies={movies} />
      )}
    </div>
  );
};

export default Home;
