import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import CatalogueList1 from "./components/CatalogueList/catalogue-list-1";
import { ICatalogueListProps } from "./components/CatalogueList";

const CatalogueList = (props: ICatalogueListProps) => {

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);
  return (
    <CatalogueList1 list={props?.data?.categories} />
  );
};

export default CatalogueList;
