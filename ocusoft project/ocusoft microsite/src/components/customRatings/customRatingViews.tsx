import { ICustomRatingViewsProps } from "@components/customRatings";


const CustomRatingViews = ({ ratingCounts, type }: ICustomRatingViewsProps) => {
  const starArray = [1, 2, 3, 4, 5]


  return (

    <>
      <div className="star-rating">
        {starArray.map((starCount) => (
          <i
            key={starCount}
            className={`icon ${ratingCounts >= starCount ? "jkm-star-fill" : "jkm-star"}`}
          ></i>
        ))}
      </div>
    </>
  )
};

export default CustomRatingViews;
