import { ISortingArrowProps } from "@/types/components";
import React from "react";

const SortingArrows = ({ handleShortingIcons, field }: ISortingArrowProps) => {
  return (
    <>
      {handleShortingIcons(field, "asc") ? <span className="icon-arrow-up"></span> : <></>}
      {handleShortingIcons(field, "desc") ? <span className="icon-down"></span> : <></>}
    </>
  );
};

export default SortingArrows;
