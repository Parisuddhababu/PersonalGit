import React from "react";
import { useTimeout } from "@components/Hooks/timeOut/useTimeOut";
import { IToastrProps } from "@components/Toastr";

export const Toast = (props: IToastrProps) => {
  useTimeout(props.close, !props?.sticky? 3000 : null);
  return (
    <div className={`toast ${props.type}`}>
      <div className="toast__text">{props.children}</div>
      <div>
        <button onClick={props.close} className={`toast__close-btn ${props.type}`}>
          X
        </button>
      </div>
    </div>
  );
};
