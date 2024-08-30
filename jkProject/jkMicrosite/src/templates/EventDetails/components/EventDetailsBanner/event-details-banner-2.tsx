import CustomImage from "@components/CustomImage/CustomImage";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { IEventDetailsMain } from "@type/Pages/eventDetail";
import {
  converDateMMDDYYYY,
  getTypeBasedCSSPath,
  TextTruncate,
} from "@util/common";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EventDetailsBannerSection2 = (props: IEventDetailsMain) => {
  const router = useRouter();
  const { query } = router.query;
  const { showSuccess, showError }: any = useToast();
  const [isInterested, setIsInterested] = useState<boolean>(true);
  useEffect(() => {
    props?.event_detail_with_map?.event_interested?.map((item) => {
      if (item.event_id === query) {
        setIsInterested(false);
      } else {
        setIsInterested(true);
      }
    });
    // eslint-disable-next-line
  }, []);

  const interested = async () => {
    let obj = {
      is_interested: 1,
      event_uuid: query,
    };
    await pagesServices.postPage(APICONFIG.Interested, obj).then((result) => {
      if (result.meta && result.meta.status_code == 201) {
        showSuccess(result?.meta?.message);
        setIsInterested(false);
      }
    }).catch((error) => {
      showError(error?.meta?.message)
    });
  };
  return (
    <>
      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={props?.event_detail_banner?.[0]?.banner_image?.path}
            height="734px"
            width="1920px"
          />
        </div>
        <div className="banner-slider-wrap">
          <div className=" slider-content-wrapper">
            <div className="container">
              <div className="slider-content">
                <div className="date-category-info">
                  <div className="date">
                    {converDateMMDDYYYY(
                      props?.event_detail_with_map?.start_date
                    )}
                  </div>
                  {/* <div className="border-right">|</div>
                  <div className="category">Necklace Sets</div> */}
                </div>
                <h2>{props?.event_detail_with_map?.title}</h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: TextTruncate(
                      props?.event_detail_with_map?.description,
                      150
                    ),
                  }}
                />
                {isInterested && (
                  <button
                    type="button"
                    className="btn btn-primary btn-small"
                    onClick={() => interested()}
                  >
                    I am Interested
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.bannerWithText)}
        />
      </Head>
    </>
  );
};

export default EventDetailsBannerSection2;
