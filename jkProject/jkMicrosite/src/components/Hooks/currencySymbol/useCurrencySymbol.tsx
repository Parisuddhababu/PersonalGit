import { IReduxStore } from "@type/Common/Base";
import {
  getCurrentCurrencySymbol,
} from "@util/common";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action_UpdateCurrencySymbol } from "src/redux/currencySymbol/currencySymbolAction";

const useCurrencySymbol = () => {
  const redux = useSelector((state: IReduxStore) => state);
  const [currencySymbol, setCurrencySymbol] = useState<string | null>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!redux.currencyData?.currencySymbol) {
      getCurrencySymbol();
      return
    }
    setCurrencySymbol(redux.currencyData?.currencySymbol);
    // eslint-disable-next-line
  }, [redux.currencyData?.currencySymbol]);

  const getCurrencySymbol = async () => {
    const Symbol = getCurrentCurrencySymbol() as string;
    setCurrencySymbol(Symbol || null);
    // @ts-ignore
    dispatch(Action_UpdateCurrencySymbol(Symbol));

    // const response = await pagesServices.getPage(
    //   APICONFIG.GET_ACTIVE_COUNTRY_LIST,
    //   {}
    // );
    // if (response.status) {
    //   const country_id = getCurrentSelectedCountry();
    //   response?.data?.country_list;
    //   if (
    //     response?.data?.country_list &&
    //     response?.data?.country_list?.length > 0
    //   ) {
    //     const index = response?.data?.country_list?.findIndex(
    //       (ele: any) => ele?._id === country_id
    //     );
    //     if (index !== -1) {
    //       setCurrencySymbol(
    //         response?.data?.country_list[index]?.currency_symbol
    //       );
    //       // @ts-ignore
    //       dispatch(Action_UpdateCurrencySymbol(response?.data?.country_list[index]?.currency_symbol));
    //     } else {
    //       // @ts-ignore
    //       dispatch(Action_UpdateCurrencySymbol(response?.data?.country_list[index]?.currency_symbol));
    //       setCurrencySymbol("₹");
    //     }
    //   }
    // }
  };
  return currencySymbol;
};

export default useCurrencySymbol;
