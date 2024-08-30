import React, { useEffect, useState } from "react";

import Card from "./Card";

type ResultProps = {
  movies: {
    poster_path: string;
    original_title: string;
    vote_average: number;
    overview: string;
  }[];
};

const Result = (props: ResultProps) => {
  const [initialList, setInitial] = useState(props.movies.slice(0, 5));

  
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight && initialList.length< props.movies.length) {
      props.movies
        .slice(initialList.length, initialList.length + 5)
        .map((item) => setInitial((prev) => [...prev, item]));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  const cards = initialList.map((item) => {
    console.log(item);
    return (
      <Card
        key={item.original_title}
        image={item.poster_path}
        title={item.original_title}
        rating={item.vote_average}
        overView={item.overview}
      />
    );
  });
  return <div>{cards}</div>;
};

export default Result;