import React from "react";
import { getComponents } from "@templates/ResetPassword/components";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { IResetPasswordProps } from "@templates/ResetPassword";

const ResetPassword = (props: IResetPasswordProps) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="wrapper">
        {props?.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type, ele, {
            data: props?.data?.[ele]?.banner_detail?.[0],
          })
        )}
      </div>
    </>
  );
};

export default ResetPassword;
