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
  }, [redux.currencyData?.currencySymbol]);

  const getCurrencySymbol = async () => {
    const Symbol = getCurrentCurrencySymbol() as string;
    setCurrencySymbol(Symbol || null);
    // @ts-ignore
    dispatch(Action_UpdateCurrencySymbol(Symbol));
  };
  return currencySymbol;
};

export default useCurrencySymbol;
