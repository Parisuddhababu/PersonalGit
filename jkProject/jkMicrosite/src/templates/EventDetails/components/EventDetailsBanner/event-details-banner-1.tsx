import CustomImage from "@components/CustomImage/CustomImage";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { IEventDetailsMain } from "@type/Pages/eventDetail";
import { converDateMMDDYYYY, getTypeBasedCSSPath, getUserDetails, TextTruncate } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EventDetailsBannerSection1 = (props: IEventDetailsMain) => {
  const router = useRouter();
  const { query } = router.query;
  const { showSuccess }: any = useToast();
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
    if (!getUserDetails()) {
      router.push('/sign-in');
      return;
    }
    let obj = {
      is_interested: 1,
      event_uuid: query,
    };
    await pagesServices.postPage(APICONFIG.Interested, obj).then((result) => {
      if (result.meta && result.meta.status_code == 201) {
        showSuccess(result?.meta?.message);
        setIsInterested(false);
      }
    });
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventDetailBanner)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventDetailsBlog)}
        />
      </Head>

      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={props?.event_detail_banner?.[0]?.banner_image?.path}
            height="778px"
            width="1920px"
          />
          <div className="banner-content">
            <div className="date-category-info">
              <div className="date">
                <i className="jkm-calendar mr-10"></i>
                {converDateMMDDYYYY(props?.event_detail_with_map?.start_date || new Date())}
              </div>
              <div className="category">
                <i className="jkm-folder mr-10"></i>
                {props?.event_detail_banner?.[0]?.banner_title}
              </div>
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
          {
            props?.event_detail_banner?.[0]?.link &&
            <Link href={props?.event_detail_banner?.[0]?.link || ""}>
              <a></a>
            </Link>
          }
        </div>
      </section>
    </>
  );
};

export default EventDetailsBannerSection1;
