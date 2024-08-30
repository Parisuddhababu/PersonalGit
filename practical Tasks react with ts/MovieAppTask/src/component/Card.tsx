import React from "react";
// import Result from "./Result";
import { useState } from "react";
import "./Card.css";

type cardProps = {
  image: string;
  title: string;
  rating:number;
  overView: String;
};

const Card = (props: cardProps) => {
  const IMGPATH = "https://image.tmdb.org/t/p/w1280";

  const [isShown, setIsShown] = useState(false);
  const onMouseEnterHandler = () => setIsShown(true);
  const onMouseLeaveHandler = () => setIsShown(false);

  return (
    <div onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
      
       <div>
        <img src={IMGPATH + props.image} alt="" className="card-size" />

        <div className="title-rating grid gap-3">
          <span>{props.title}</span>
          <span>*{props.rating}*</span>
        </div>
      </div>
     
      {isShown && <p>{props.overView}</p>}
     
    </div>
  );
};

export default Card;
