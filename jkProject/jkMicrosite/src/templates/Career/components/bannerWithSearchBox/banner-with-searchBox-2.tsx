import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { ICareerBannerWithSearchBox } from "@type/Pages/career";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const BannerWithSearchBoxSection2 = (props: ICareerBannerWithSearchBox) => {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(2, CSS_NAME_PATH.careerBanner2)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(2, CSS_NAME_PATH.careerBanner2only)}
                />
                <link
                    rel="stylesheet"
                    href={getTypeBasedCSSPath(2, CSS_NAME_PATH.careerFilterSection2)}
                />
            </Head>


            <section className="banner-sec">
                <div className="banner-image-wrap">
                    <CustomImage
                        src={
                            props?.banner_image?.path
                                ? props?.banner_image?.path
                                : IMAGE_PATH.blogPostSevenJpg
                        }
                        alt="Banner Image"
                        width="1920px"
                        height="500px"
                    />
                    <div className="banner-content">
                        <h2>{props?.banner_title}</h2>
                        <div className="subTitle">Lorem Ipsum is simply dummy text of the printing and typesetting industry</div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default BannerWithSearchBoxSection2;
