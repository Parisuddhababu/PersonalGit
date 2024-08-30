import Head from "next/head";
import React, { useEffect, useState } from "react";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import { ICollectionListProps } from "@templates/Collection/components/CollectionList";

import CustomImage from "@components/CustomImage/CustomImage";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import useLoadMoreHook from "@components/Hooks/loadMore/loadMore";
import { ICollectionList } from "@type/Pages/collection";
import APPCONFIG from "@config/app.config";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Loader from "@components/customLoader/Loader";
import Link from "next/link";

const CollectionList1 = ({ data }: ICollectionListProps) => {
  const [collectionListData, setCollectionListData] = useState<
    ICollectionList[]
  >(data?.data);
  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
    if (loadedMoreData?.length !== 0) {
      setCollectionListData([...collectionListData, ...loadedMoreData]);
    }
    if (data?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const getFormData = (funcLoadMoreOfHook: any) => {
    const formData = new FormData();
    const totalDataToget = currentPage * APPCONFIG.COLLECTION_LIST_PAGE_LIMIT;
    formData.append("start", totalDataToget.toString());
    setIsLoading(true);
    funcLoadMoreOfHook(
      APICONFIG.GET_COLLECTION_LIST,
      API_SECTION_NAME.collection_list,
      formData
    );
  };

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.collectionGrid)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.simpleFeature)}
        />
      </Head>

      <section className="collection_grid">
        <div className="container">
          <div className="d-row">
            {collectionListData.map((val, index) => {
              return (
                <div className="d-col d-col-3" key={index}>
                  <div className="collection_list">
                    <div className="modal-image">
                      <CustomImage
                        src={val?.desktop_image?.path}
                        alt={"collection"}
                        title={"collection"}
                        height="471px"
                        width="471px"
                      />
                    </div>
                    <div className="brand-logo">
                      <Link href={`collection/${val?.collection_slug}`}>
                        <a>
                          <CustomImage
                            src={val?.menu_logo?.path}
                            alt={"collection"}
                            title={"collection"}
                            height="60"
                            width="180"
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {showLoadMoreButton && collectionListData?.length > 0 && (
            <div className="d-row">
              <div className="d-col just-center">
                <button
                  className="btn btn-primary btn-small"
                  onClick={loadMoreFunctionCall}
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* <!--Features Section--> */}
      <FeatureFooter1 />
    </>
  );
};

export default CollectionList1;
