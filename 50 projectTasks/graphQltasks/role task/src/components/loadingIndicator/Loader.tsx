import Loader from "@components/icons/Loader";
import React, { FC } from "react";

type LoaderProps = {
  showText?: boolean;
};

const LoadingIndicator: FC<LoaderProps> = () => {
  return (
    <div>
      <Loader />
    </div>
  );
};

export default LoadingIndicator;
