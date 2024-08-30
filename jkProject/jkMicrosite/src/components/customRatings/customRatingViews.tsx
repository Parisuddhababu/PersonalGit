import { ICustomRatingViewsProps } from "@components/customRatings";

const CustomRatingViews = ({ ratingCounts, type }: ICustomRatingViewsProps) => {
  return (
    <>
      {
        type == 1 ?

          <div className="star-rating">
            <i
              className={`icon ${ratingCounts >= 1 ? "jkm-star-fill" : "jkm-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 2 ? "jkm-star-fill" : "jkm-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 3 ? "jkm-star-fill" : "jkm-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 4 ? "jkm-star-fill" : "jkm-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 5 ? "jkm-star-fill" : "jkm-star"}`}
            ></i>
          </div>
          :
          <div className="star-rating">
            <i
              className={`icon ${ratingCounts >= 1 ? "jkms2-star-fill" : "jkms2-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 2 ? "jkms2-star-fill" : "jkms2-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 3 ? "jkms2-star-fill" : "jkms2-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 4 ? "jkms2-star-fill" : "jkms2-star"}`}
            ></i>
            <i
              className={`icon ${ratingCounts >= 5 ? "jkms2-star-fill" : "jkms2-star"}`}
            ></i>
          </div>
      }
    </>
  );
};

export default CustomRatingViews;
