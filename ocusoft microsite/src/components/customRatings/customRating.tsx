import React, { useState } from "react";
import { ICustomRatingProps } from "@components/customRatings";

const CustomRating = (props: ICustomRatingProps) => {
  const [rate, setRate] = useState<number>(4);

  const onApplyClick = (givenRate: number) => {
    props.onChange(givenRate);
    setRate(givenRate);
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((item, index) => {
        const givenRating = index + 1;
        return (
          <>
            <i
              onClick={() => onApplyClick(givenRating)}
              className={`icon ${rate >= givenRating ? "jkm-star-fill" : "jkm-star"
                }`}
            ></i>
          </>
        );
      })}
    </div>
  );
};

export default CustomRating;
