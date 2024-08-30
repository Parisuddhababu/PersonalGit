import Glider from "react-glider";
import VerifiedOnClutch from "../../assets/images/verified-on-clutch.svg";
import StarRatings from "react-star-ratings";
import { Section } from "../../common/Section";
import { IClutchReview, IClutchReviewsList } from "src/@types/brainvire_poc";
import { NextArrowIcon, PrevArrowIcon, SmallNextArrowIcon, SmallPrevArrowIcon } from "../../assets/Icons/";
import { uuid } from "../../utils/uuid";

const OurClientSay = (props: IClutchReview) => {
  return (
    <Section
      className="client-say-section"
      header={{
        title: props?.title,
        title_tag: "h2",
        title_class: "",
        sub_title: props?.sub_title,
        sub_title_class: "",
      }}
      containerInclude={true}
    >
      <div className="glider-wrapper">
        <button
          type="button"
          id="prev-button"
          className="glider-prev-btn"
          aria-label="Prev Arrow Icon"
        >
          <span className="glider-prev-btn-desktop">
            <PrevArrowIcon />
          </span>
          <span className="glider-prev-btn-mobile">
            <SmallPrevArrowIcon />
          </span>
        </button>
        <button
          type="button"
          id="next-button"
          className="glider-next-btn"
          aria-label="Next Arrow Icon"
        >
          <span className="glider-next-btn-desktop">
            <NextArrowIcon />
          </span>
          <span className="glider-next-btn-mobile">
            <SmallNextArrowIcon />
          </span>
        </button>
        {props?.data?.length > 0 && (
          <Glider
            draggable={true}
            hasArrows={true}
            hasDots={false}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={{
              prev: "#prev-button",
              next: "#next-button",
            }}
            responsive={[
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                },
              },
            ]}
          >
            {props?.data?.length > 0 &&
              props?.data?.map((item: IClutchReviewsList) => (
                <div key={uuid()}>
                  <div className="glider-slide-item">
                    <div className="glider-slide-header">
                      <div className="figure">
                        <img
                          src={item?.featured_image}
                          alt={item?.title}
                          title={item?.title}
                          height={50}
                          width={50}
                          loading="lazy"
                        />
                      </div>
                      <div className="glider-slide-header-right">
                        <p className="h6 glider-slide-title">{item?.title}</p>
                        <p className="glider-slide-designation">
                          {item?.designation}
                        </p>
                      </div>
                    </div>

                    <div className="glider-slide-body">
                      <p>{item?.description}</p>
                    </div>

                    <div className="glider-slide-footer">
                      <div className="figure">
                        <img
                          src={VerifiedOnClutch}
                          alt="Verified On Clutch"
                          title="Verified On Clutch"
                          height={28}
                          width={52}
                          loading="lazy"
                        />
                      </div>

                      <div className="glider-slide-footer-right">
                        <div className="start-rating">
                          <StarRatings
                            rating={Number(item?.rating)}
                            starRatedColor="#FF4242"
                            starEmptyColor="#000000"
                            starDimension="0.875rem"
                            starSpacing="0"
                            numberOfStars={5}
                            name="rating"
                          />
                        </div>
                        <p>
                          <span>{item?.rating}</span>Rating
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Glider>
        )}
      </div>
    </Section>
  );
};

export default OurClientSay;
