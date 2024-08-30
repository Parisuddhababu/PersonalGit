import * as React from "react";
import { ExpandSvg, IconSvg, CompressSvg } from "src/types/icon";

const PlusCircle = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
  </svg>
);

const MenuBurger = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <rect y="11" width="24" height="2" rx="1" />
    <rect y="4" width="24" height="2" rx="1" />
    <rect y="18" width="24" height="2" rx="1" />
  </svg>
);

const Megaphone = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="m17 0a1 1 0 0 0 -1 1c0 2.949-2.583 4-5 4h-7a4 4 0 0 0 -4 4v2a3.979 3.979 0 0 0 1.514 3.109l3.572 7.972a3.233 3.233 0 0 0 2.953 1.919 2.982 2.982 0 0 0 2.72-4.2l-2.2-4.8h2.441c2.417 0 5 1.051 5 4a1 1 0 0 0 2 0v-18a1 1 0 0 0 -1-1zm-8.063 20.619a.983.983 0 0 1 -.898 1.381 1.232 1.232 0 0 1 -1.126-.734l-2.808-6.266h2.254zm7.063-6.019a7.723 7.723 0 0 0 -5-1.6h-7a2 2 0 0 1 -2-2v-2a2 2 0 0 1 2-2h7a7.723 7.723 0 0 0 5-1.595zm7.9.852a1 1 0 0 1 -1.342.448l-2-1a1 1 0 0 1 .894-1.79l2 1a1 1 0 0 1 .448 1.337zm-3.79-9a1 1 0 0 1 .448-1.342l2-1a1 1 0 1 1 .894 1.79l-2 1a1 1 0 0 1 -1.342-.448zm-.11 3.548a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 -1-1z" />
  </svg>
);

const Edit = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z" />
    <path d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z" />
  </svg>
);

const Folder = ({
  className = "flex flex-col px-0 ",
  fontSize = "1em",
}: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="M4.09 7.586A1 1 0 0 1 5 7h13V6a2 2 0 0 0-2-2h-4.557L9.043.8a2.009 2.009 0 0 0-1.6-.8H2a2 2 0 0 0-2 2v14c.001.154.02.308.058.457L4.09 7.586Z" />
    <path d="M6.05 9 2 17.952c.14.031.281.047.424.048h12.95a.992.992 0 0 0 .909-.594L20 9H6.05Z" />
  </svg>
);

const FolderClose = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z" />
  </svg>
);
const CaretDown = ({ className }: IconSvg) => (
  <svg
    className={`w-[10px] h-[10px] text-gray-800 dark:text-black mr-2 ${className}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 10"
  >
    <path d="M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z" />
  </svg>
);

const CaretRight = ({ className }: IconSvg) => (
  <svg
    className={`w-[10px] h-[10px] text-gray-800 dark:text-black mr-2 ${className}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 10 16"
  >
    <path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z" />
  </svg>
);
const Compress = ({ className, onClick }: CompressSvg) => (
  <svg
    className={`w-[24px] h-[24px] text-gray-800 dark:text-black ${className}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 18"
    onClick={onClick}
  >
    <path d="M18 .989a1.016 1.016 0 0 0-.056-.277c-.011-.034-.009-.073-.023-.1a.786.786 0 0 0-.066-.1.979.979 0 0 0-.156-.224l-.007-.01a.873.873 0 0 0-.116-.073.985.985 0 0 0-.2-.128.959.959 0 0 0-.231-.047A.925.925 0 0 0 17 0h-4a1 1 0 1 0 0 2h1.664l-3.388 3.552a1 1 0 0 0 1.448 1.381L16 3.5V5a1 1 0 0 0 2 0V.989ZM17 12a1 1 0 0 0-1 1v1.586l-3.293-3.293a1 1 0 0 0-1.414 1.414L14.586 16H13a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM3.414 2H5a1 1 0 0 0 0-2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3.414l3.536 3.535A1 1 0 0 0 6.95 5.535L3.414 2Zm2.139 9.276L2 14.665V13a1 1 0 1 0-2 0v4c.006.046.015.09.027.135.006.08.022.16.048.235a.954.954 0 0 0 .128.2.95.95 0 0 0 .073.117l.01.007A.983.983 0 0 0 1 18h4a1 1 0 0 0 0-2H3.5l3.436-3.276a1 1 0 0 0-1.38-1.448h-.003Z" />
  </svg>
);

const Expand = ({ className, onClick }: ExpandSvg) => (
  <svg
    className={`w-[22px] h-[22px] text-gray-800 dark:text-black ${className}`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 18"
    onClick={onClick}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.6"
      d="M13 17v-4h4M1 5h4V1M1 13h4v4m8-16v4h4"
    />
  </svg>
);

const GetDefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 h-3 ml-1"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 320 512"
  >
    <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
  </svg>
);

const GetAscIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-8 w-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const GetDescIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-8 w-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const Check = ({ className = "", fontSize = "1em" }: IconSvg) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ height: fontSize, width: fontSize }}
  >
    <path d="M22.319,4.431,8.5,18.249a1,1,0,0,1-1.417,0L1.739,12.9a1,1,0,0,0-1.417,0h0a1,1,0,0,0,0,1.417l5.346,5.345a3.008,3.008,0,0,0,4.25,0L23.736,5.847a1,1,0,0,0,0-1.416h0A1,1,0,0,0,22.319,4.431Z" />
  </svg>
);

export {
  PlusCircle,
  MenuBurger,
  Megaphone,
  Edit,
  CaretDown,
  CaretRight,
  Compress,
  Expand,
  GetDefaultIcon,
  GetAscIcon,
  GetDescIcon,
  Check,
  Folder,
  FolderClose,
};
