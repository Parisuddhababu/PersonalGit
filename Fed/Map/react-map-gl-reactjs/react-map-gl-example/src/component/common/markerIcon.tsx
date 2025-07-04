import * as React from "react";

const ICON = `M29.77,13.49A7.47,7.47,0,0,1,24.38,11a6.58,6.58,0,1,1-1.61-3,7.42,7.42,0,0,1,.31-4.84A11.75,11.75,0,0,0,6.22,13.73c0,4.67,2.62,8.58,4.54,11.43l.35.52a99.61,99.61,0,0,0,6.14,8l.76.89.76-.89a99.82,99.82,0,0,0,6.14-8l.35-.53c1.91-2.85,4.53-6.75,4.53-11.42C29.78,13.65,29.77,13.57,29.77,13.49Z`;

const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
};

const MarkerIcon = ({ size = 20 }) => {
  return (
    <svg height={size} viewBox="0 0 36 36" style={pinStyle}>
      <path
        d={ICON}
        className="clr-i-solid--badged clr-i-solid-path-1--badged"
      />
      <circle
        className="clr-i-solid--badged clr-i-solid-path-2--badged"
        cx="18"
        cy="12.44"
        r="3.73"
      ></circle>
      <circle
        className="clr-i-solid--badged clr-i-solid-path-3--badged clr-i-badge"
        cx="30"
        cy="6"
        r="5"
      ></circle>
      <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
    </svg>
  );
};

export default MarkerIcon;
