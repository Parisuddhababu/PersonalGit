import {
  ISimilarProductsProps,
  IUseSimilarProductState,
} from "@components/Hooks/similarProductList";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { useEffect, useState } from "react";

const useSimilarProductList = ({
  sectionName,
  product_id,
}: IUseSimilarProductState) => {
  const [similarList, setSimilarList] = useState<ISimilarProductsProps[]>();

  useEffect(() => {
    getSimilarViewList();
    // eslint-disable-next-line
  }, []);

  const getSimilarViewList = () => {
    const requestParams = {
      product_id: product_id,
    };
    let apiEndpoint = APICONFIG.SIMILAR_PRODUCT_LIST_BY_ID;
    if (sectionName === "product_match_set") {
      apiEndpoint = APICONFIG.PRODUCT_MATCH_SET_LIST;
    }
    if (sectionName === "product_set") {
      apiEndpoint = APICONFIG.PRODUCT_SET_LIST;
    }
    if (sectionName === "recently_view") {
      apiEndpoint = APICONFIG.RECENT_PRODUCT_LIST_BY_ID;
    }
    if (product_id) {
      pagesServices
        .postPage(apiEndpoint, requestParams)
        .then((result) => {
          if (
            result.meta &&
            (result.meta.status_code === 200 || result.status_code === 200)
          ) {
            if (sectionName === "product_match_set") {
              setSimilarList(result?.data?.matchpair_products_detail);
            } else if (sectionName === "product_set") {
              setSimilarList(result?.data?.product_sets_detail);
            } else if (sectionName === "recently_view") {
              setSimilarList(result?.data?.original?.data);
            } else {
              setSimilarList(result?.data?.product);
            }
          }
        })
        .catch(() => {});
    }
  };
  return {
    getSimilarViewList,
    similarList,
  };
};

export default useSimilarProductList;
