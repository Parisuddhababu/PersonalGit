import * as React from 'react';
import { CompressSvg, ExpandSvg, IconSvg, MenuBurgerSvg } from 'src/types/icon';

const PlusCircle = ({ className = 'w-6 h-6 text-white', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
		<path d='M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z' />
	</svg>
);
const Megaphone = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={`${className} text-[#73818F]`} style={{ height: fontSize, width: fontSize }}>
		<path d='m17 0a1 1 0 0 0 -1 1c0 2.949-2.583 4-5 4h-7a4 4 0 0 0 -4 4v2a3.979 3.979 0 0 0 1.514 3.109l3.572 7.972a3.233 3.233 0 0 0 2.953 1.919 2.982 2.982 0 0 0 2.72-4.2l-2.2-4.8h2.441c2.417 0 5 1.051 5 4a1 1 0 0 0 2 0v-18a1 1 0 0 0 -1-1zm-8.063 20.619a.983.983 0 0 1 -.898 1.381 1.232 1.232 0 0 1 -1.126-.734l-2.808-6.266h2.254zm7.063-6.019a7.723 7.723 0 0 0 -5-1.6h-7a2 2 0 0 1 -2-2v-2a2 2 0 0 1 2-2h7a7.723 7.723 0 0 0 5-1.595zm7.9.852a1 1 0 0 1 -1.342.448l-2-1a1 1 0 0 1 .894-1.79l2 1a1 1 0 0 1 .448 1.337zm-3.79-9a1 1 0 0 1 .448-1.342l2-1a1 1 0 1 1 .894 1.79l-2 1a1 1 0 0 1 -1.342-.448zm-.11 3.548a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 -1-1z' />
	</svg>
);

const Eye = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.271,9.419C21.72,6.893,18.192,2.655,12,2.655S2.28,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162C2.28,17.107,5.808,21.345,12,21.345s9.72-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419Zm-1.705,4.115C20.234,15.7,17.219,19.345,12,19.345S3.766,15.7,2.434,13.534a2.918,2.918,0,0,1,0-3.068C3.766,8.3,6.781,4.655,12,4.655s8.234,3.641,9.566,5.811A2.918,2.918,0,0,1,21.566,13.534Z' />
		<path d='M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z' />
	</svg>
);
const MenuBurger = ({ className = '', fontSize = '1em' }: MenuBurgerSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={`${className} text-[#73818F]`} style={{ height: fontSize, width: fontSize }}>
		<rect y='11' width='24' height='2' rx='1' />
		<rect y='4' width='24' height='2' rx='1' />
		<rect y='18' width='24' height='2' rx='1' />
	</svg>
);

const Edit = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z' />
		<path d='M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z' />
	</svg>
);

const Folder = ({ className = 'flex flex-col px-0 ', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M4.09 7.586A1 1 0 0 1 5 7h13V6a2 2 0 0 0-2-2h-4.557L9.043.8a2.009 2.009 0 0 0-1.6-.8H2a2 2 0 0 0-2 2v14c.001.154.02.308.058.457L4.09 7.586Z' />
		<path d='M6.05 9 2 17.952c.14.031.281.047.424.048h12.95a.992.992 0 0 0 .909-.594L20 9H6.05Z' />
	</svg>
);

const FolderClose = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M18 5H0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Zm-7.258-2L9.092.8a2.009 2.009 0 0 0-1.6-.8H2.049a2 2 0 0 0-2 2v1h10.693Z' />
	</svg>
);
const CaretDown = ({ className }: IconSvg) => (
	<svg className={`w-[10px] h-[10px] text-gray-800 dark:text-black mr-2 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 10'>
		<path d='M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z' />
	</svg>
);

const CaretRight = ({ className }: IconSvg) => (
	<svg className={`w-[10px] h-[10px] text-gray-800 dark:text-black mr-2 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 10 16'>
		<path d='M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z' />
	</svg>
);
const Compress = ({ className, onClick }: CompressSvg) => (
	<svg className={`w-[24px] h-[24px] text-gray-800 dark:text-black ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 18' onClick={onClick}>
		<path d='M18 .989a1.016 1.016 0 0 0-.056-.277c-.011-.034-.009-.073-.023-.1a.786.786 0 0 0-.066-.1.979.979 0 0 0-.156-.224l-.007-.01a.873.873 0 0 0-.116-.073.985.985 0 0 0-.2-.128.959.959 0 0 0-.231-.047A.925.925 0 0 0 17 0h-4a1 1 0 1 0 0 2h1.664l-3.388 3.552a1 1 0 0 0 1.448 1.381L16 3.5V5a1 1 0 0 0 2 0V.989ZM17 12a1 1 0 0 0-1 1v1.586l-3.293-3.293a1 1 0 0 0-1.414 1.414L14.586 16H13a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM3.414 2H5a1 1 0 0 0 0-2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3.414l3.536 3.535A1 1 0 0 0 6.95 5.535L3.414 2Zm2.139 9.276L2 14.665V13a1 1 0 1 0-2 0v4c.006.046.015.09.027.135.006.08.022.16.048.235a.954.954 0 0 0 .128.2.95.95 0 0 0 .073.117l.01.007A.983.983 0 0 0 1 18h4a1 1 0 0 0 0-2H3.5l3.436-3.276a1 1 0 0 0-1.38-1.448h-.003Z' />
	</svg>
);

const Expand = ({ className, onClick }: ExpandSvg) => (
	<svg className={`w-[22px] h-[22px] text-gray-800 dark:text-black ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 18' onClick={onClick}>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='0.6' d='M13 17v-4h4M1 5h4V1M1 13h4v4m8-16v4h4' />
	</svg>
);

const GetDefaultIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3 ml-1' aria-hidden='true' fill='currentColor' viewBox='0 0 320 512'>
		<path d='M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z' />
	</svg>
);

const GetAscIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='h-8 w-8'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
	</svg>
);

const GetDescIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='h-8 w-8'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
	</svg>
);
const Check = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.319,4.431,8.5,18.249a1,1,0,0,1-1.417,0L1.739,12.9a1,1,0,0,0-1.417,0h0a1,1,0,0,0,0,1.417l5.346,5.345a3.008,3.008,0,0,0,4.25,0L23.736,5.847a1,1,0,0,0,0-1.416h0A1,1,0,0,0,22.319,4.431Z' strokeWidth={5} />
	</svg>
);

const Trash = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z' />
		<path d='M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z' />
		<path d='M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z' />
	</svg>
);
const Document = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={`${className} text-[#73818F]`} style={{ height: fontSize, width: fontSize }}>
		<path d='m17 14a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1zm-4 3h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2zm9-6.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z' />
	</svg>
);
const Refresh = ({ className = 'w-6 h-6 text-white', fontSize = '12px' }: IconSvg) => (
	<svg className={className} aria-hidden='true' style={{ height: fontSize, width: fontSize }} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 20'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97' />
	</svg>
);
const Search = ({ className = 'w-6 h-6 text-white', fontSize = '12px' }: IconSvg) => (
	<svg className={className} aria-hidden='true' style={{ height: fontSize, width: fontSize }} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='4' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z' />
	</svg>
);
const CrossCircle = ({ className = 'font-bold', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M16,8a1,1,0,0,0-1.414,0L12,10.586,9.414,8A1,1,0,0,0,8,9.414L10.586,12,8,14.586A1,1,0,0,0,9.414,16L12,13.414,14.586,16A1,1,0,0,0,16,14.586L13.414,12,16,9.414A1,1,0,0,0,16,8Z' />
		<path d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z' />
	</svg>
);
const Cross = ({ className = '', fontSize = '0.6em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='6' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
	</svg>
);

const Info = ({ className = 'w-6 h-6 text-white', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
		<path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
	</svg>
);

const User = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z' />
		<path d='M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z' />
	</svg>
);
const Lock = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={`${className} text-[#73818F]`} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,8.424V7A7,7,0,0,0,5,7V8.424A5,5,0,0,0,2,13v6a5.006,5.006,0,0,0,5,5H17a5.006,5.006,0,0,0,5-5V13A5,5,0,0,0,19,8.424ZM7,7A5,5,0,0,1,17,7V8H7ZM20,19a3,3,0,0,1-3,3H7a3,3,0,0,1-3-3V13a3,3,0,0,1,3-3H17a3,3,0,0,1,3,3Z' />
		<path d='M12,14a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V15A1,1,0,0,0,12,14Z' />
	</svg>
);
const Settings = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={`${className} text-[#73818F]`} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z' />
		<path d='M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z' />
	</svg>
);
const Star = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z' />
	</svg>
);

const AngleLeft = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z' />
	</svg>
);
const EyeCrossed = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm12.567,1.534C20.233,15.7,17.218,19.345,12,19.345A10.1,10.1,0,0,1,7.234,18.18l2.013-2.013a4.992,4.992,0,0,0,6.92-6.92l2.31-2.31a13.723,13.723,0,0,1,3.09,3.529A2.918,2.918,0,0,1,21.567,13.534Z' />
	</svg>
);
const TreeViewIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='m14.831,12l8.144,4.987-1.566,2.559-7.95-4.868v9.323h-3v-9.323l-7.95,4.868-1.566-2.559,8.144-4.987L.942,7.013l1.566-2.559,7.95,4.868V0h3v9.323l7.95-4.868,1.566,2.559-8.144,4.987Z' strokeWidth='10' strokeLinecap='round' strokeLinejoin='round' />
	</svg>
);

const Calendar = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,2H18V1a1,1,0,0,0-2,0V2H8V1A1,1,0,0,0,6,1V2H5A5.006,5.006,0,0,0,0,7V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7A5.006,5.006,0,0,0,19,2ZM2,7A3,3,0,0,1,5,4H19a3,3,0,0,1,3,3V8H2ZM19,22H5a3,3,0,0,1-3-3V10H22v9A3,3,0,0,1,19,22Z' />
		<circle cx='12' cy='15' r='1.5' />
		<circle cx='7' cy='15' r='1.5' />
		<circle cx='17' cy='15' r='1.5' />
	</svg>
);
const Group = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={className} style={{ height: fontSize, width: fontSize }} fill='#000000' width={30} height={30} viewBox='-3 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg'>
			<g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
			<g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
			<g id='SVGRepo_iconCarrier'>
				{' '}
				<title>group</title>{' '}
				<path d='M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z'></path>{' '}
			</g>
		</svg>
	);
};
const Checkbox = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z' />
		<path d='M9.333,15.919,5.414,12A1,1,0,0,0,4,12H4a1,1,0,0,0,0,1.414l3.919,3.919a2,2,0,0,0,2.829,0L20,8.081a1,1,0,0,0,0-1.414h0a1,1,0,0,0-1.414,0Z' />
	</svg>
);

const AngleRight = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M7,24a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l8.17-8.17a3,3,0,0,0,0-4.24L6.29,1.71A1,1,0,0,1,7.71.29l8.17,8.17a5,5,0,0,1,0,7.08L7.71,23.71A1,1,0,0,1,7,24Z' />
	</svg>
);

const AngleSmallDown = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M18.71,8.21a1,1,0,0,0-1.42,0l-4.58,4.58a1,1,0,0,1-1.42,0L6.71,8.21a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l4.59,4.59a3,3,0,0,0,4.24,0l4.59-4.59A1,1,0,0,0,18.71,8.21Z' />
	</svg>
);

const UsersAlt = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,12,10Zm6,13A6,6,0,0,0,6,23a1,1,0,0,0,2,0,4,4,0,0,1,8,0,1,1,0,0,0,2,0ZM18,8a4,4,0,1,1,4-4A4,4,0,0,1,18,8Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,18,2Zm6,13a6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2,4,4,0,0,1,4,4,1,1,0,0,0,2,0ZM6,8a4,4,0,1,1,4-4A4,4,0,0,1,6,8ZM6,2A2,2,0,1,0,8,4,2,2,0,0,0,6,2ZM2,15a4,4,0,0,1,4-4A1,1,0,0,0,6,9a6.006,6.006,0,0,0-6,6,1,1,0,0,0,2,0Z' />
	</svg>
);

const Users = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m7.5 13a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm0-7a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0 -2.5-2.5zm7.5 17v-.5a7.5 7.5 0 0 0 -15 0v.5a1 1 0 0 0 2 0v-.5a5.5 5.5 0 0 1 11 0v.5a1 1 0 0 0 2 0zm9-5a7 7 0 0 0 -11.667-5.217 1 1 0 1 0 1.334 1.49 5 5 0 0 1 8.333 3.727 1 1 0 0 0 2 0zm-6.5-9a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5zm0-7a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0 -2.5-2.5z' />
	</svg>
);

const UserAdd = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23,11H21V9a1,1,0,0,0-2,0v2H17a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V13h2a1,1,0,0,0,0-2Z' />
		<path d='M9,12A6,6,0,1,0,3,6,6.006,6.006,0,0,0,9,12ZM9,2A4,4,0,1,1,5,6,4,4,0,0,1,9,2Z' />
		<path d='M9,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,9,14Z' />
	</svg>
);

const ShoppingCart = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.713,4.077A2.993,2.993,0,0,0,20.41,3H4.242L4.2,2.649A3,3,0,0,0,1.222,0H1A1,1,0,0,0,1,2h.222a1,1,0,0,1,.993.883l1.376,11.7A5,5,0,0,0,8.557,19H19a1,1,0,0,0,0-2H8.557a3,3,0,0,1-2.82-2h11.92a5,5,0,0,0,4.921-4.113l.785-4.354A2.994,2.994,0,0,0,22.713,4.077ZM21.4,6.178l-.786,4.354A3,3,0,0,1,17.657,13H5.419L4.478,5H20.41A1,1,0,0,1,21.4,6.178Z' />
		<circle cx='7' cy='22' r='2' />
		<circle cx='17' cy='22' r='2' />
	</svg>
);

const Share = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19.333,14.667a4.66,4.66,0,0,0-3.839,2.024L8.985,13.752a4.574,4.574,0,0,0,.005-3.488l6.5-2.954a4.66,4.66,0,1,0-.827-2.643,4.633,4.633,0,0,0,.08.786L7.833,8.593a4.668,4.668,0,1,0-.015,6.827l6.928,3.128a4.736,4.736,0,0,0-.079.785,4.667,4.667,0,1,0,4.666-4.666ZM19.333,2a2.667,2.667,0,1,1-2.666,2.667A2.669,2.669,0,0,1,19.333,2ZM4.667,14.667A2.667,2.667,0,1,1,7.333,12,2.67,2.67,0,0,1,4.667,14.667ZM19.333,22A2.667,2.667,0,1,1,22,19.333,2.669,2.669,0,0,1,19.333,22Z' />
	</svg>
);

const SettingsSliders = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M1,4.75H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2ZM7.333,2a1.75,1.75,0,1,1-1.75,1.75A1.752,1.752,0,0,1,7.333,2Z' />
		<path d='M23,11H20.264a3.727,3.727,0,0,0-7.194,0H1a1,1,0,0,0,0,2H13.07a3.727,3.727,0,0,0,7.194,0H23a1,1,0,0,0,0-2Zm-6.333,2.75A1.75,1.75,0,1,1,18.417,12,1.752,1.752,0,0,1,16.667,13.75Z' />
		<path d='M23,19.25H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2ZM7.333,22a1.75,1.75,0,1,1,1.75-1.75A1.753,1.753,0,0,1,7.333,22Z' />
	</svg>
);

const Picture = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0ZM5,2H19a3,3,0,0,1,3,3V19a2.951,2.951,0,0,1-.3,1.285l-9.163-9.163a5,5,0,0,0-7.072,0L2,14.586V5A3,3,0,0,1,5,2ZM5,22a3,3,0,0,1-3-3V17.414l4.878-4.878a3,3,0,0,1,4.244,0L20.285,21.7A2.951,2.951,0,0,1,19,22Z' />
		<path d='M16,10.5A3.5,3.5,0,1,0,12.5,7,3.5,3.5,0,0,0,16,10.5Zm0-5A1.5,1.5,0,1,1,14.5,7,1.5,1.5,0,0,1,16,5.5Z' />
	</svg>
);

const PhoneCall = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M13,1a1,1,0,0,1,1-1A10.011,10.011,0,0,1,24,10a1,1,0,0,1-2,0,8.009,8.009,0,0,0-8-8A1,1,0,0,1,13,1Zm1,5a4,4,0,0,1,4,4,1,1,0,0,0,2,0,6.006,6.006,0,0,0-6-6,1,1,0,0,0,0,2Zm9.093,10.739a3.1,3.1,0,0,1,0,4.378l-.91,1.049c-8.19,7.841-28.12-12.084-20.4-20.3l1.15-1A3.081,3.081,0,0,1,7.26.906c.031.031,1.884,2.438,1.884,2.438a3.1,3.1,0,0,1-.007,4.282L7.979,9.082a12.781,12.781,0,0,0,6.931,6.945l1.465-1.165a3.1,3.1,0,0,1,4.281-.006S23.062,16.708,23.093,16.739Zm-1.376,1.454s-2.393-1.841-2.424-1.872a1.1,1.1,0,0,0-1.549,0c-.027.028-2.044,1.635-2.044,1.635a1,1,0,0,1-.979.152A15.009,15.009,0,0,1,5.9,9.3a1,1,0,0,1,.145-1S7.652,6.282,7.679,6.256a1.1,1.1,0,0,0,0-1.549c-.031-.03-1.872-2.425-1.872-2.425a1.1,1.1,0,0,0-1.51.039l-1.15,1C-2.495,10.105,14.776,26.418,20.721,20.8l.911-1.05A1.121,1.121,0,0,0,21.717,18.193Z' />
	</svg>
);

const Pencil = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z' />
	</svg>
);
const Marker = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z' />
		<path d='M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z' />
	</svg>
);

const ListCheck = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize, borderRadius: 35 }}>
		<path d='m4 6a2.982 2.982 0 0 1 -2.122-.879l-1.544-1.374a1 1 0 0 1 1.332-1.494l1.585 1.414a1 1 0 0 0 1.456.04l3.604-3.431a1 1 0 0 1 1.378 1.448l-3.589 3.414a2.964 2.964 0 0 1 -2.1.862zm20-2a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.589-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1.023 1.023 0 0 1 -1.414 0l-1.59-1.585a1 1 0 0 0 -1.414 1.414l1.585 1.585a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.585-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1 1 0 0 1 -1.456-.04l-1.585-1.414a1 1 0 0 0 -1.332 1.494l1.544 1.374a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1z' />
	</svg>
);

const Key = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m22 0h-2.172a2.978 2.978 0 0 0 -2.121.879l-8.361 8.36a7.537 7.537 0 1 0 5.415 5.415l1.239-1.239v-2.415h3v-3h2.414l1.707-1.707a2.983 2.983 0 0 0 .879-2.122v-2.171a2 2 0 0 0 -2-2zm0 4.171a1 1 0 0 1 -.293.708l-1.121 1.121h-3.586v3h-3v3.585l-1.545 1.545a5.64 5.64 0 0 1 .545 2.37 5.5 5.5 0 1 1 -5.5-5.5 4.236 4.236 0 0 1 2.369.544l9.252-9.251a1.009 1.009 0 0 1 .707-.293h2.172zm-17 13.829a1 1 0 1 0 1-1 1 1 0 0 0 -1 1z' />
	</svg>
);

const Home = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z' />
	</svg>
);

const Heart = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z' />
	</svg>
);

const Globe = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm8.647,7H17.426a19.676,19.676,0,0,0-2.821-4.644A10.031,10.031,0,0,1,20.647,7ZM16.5,12a10.211,10.211,0,0,1-.476,3H7.976A10.211,10.211,0,0,1,7.5,12a10.211,10.211,0,0,1,.476-3h8.048A10.211,10.211,0,0,1,16.5,12ZM8.778,17h6.444A19.614,19.614,0,0,1,12,21.588,19.57,19.57,0,0,1,8.778,17Zm0-10A19.614,19.614,0,0,1,12,2.412,19.57,19.57,0,0,1,15.222,7ZM9.4,2.356A19.676,19.676,0,0,0,6.574,7H3.353A10.031,10.031,0,0,1,9.4,2.356ZM2.461,9H5.9a12.016,12.016,0,0,0-.4,3,12.016,12.016,0,0,0,.4,3H2.461a9.992,9.992,0,0,1,0-6Zm.892,8H6.574A19.676,19.676,0,0,0,9.4,21.644,10.031,10.031,0,0,1,3.353,17Zm11.252,4.644A19.676,19.676,0,0,0,17.426,17h3.221A10.031,10.031,0,0,1,14.605,21.644ZM21.539,15H18.1a12.016,12.016,0,0,0,.4-3,12.016,12.016,0,0,0-.4-3h3.437a9.992,9.992,0,0,1,0,6Z' />
	</svg>
);

const Exit = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z' />
		<path d='M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z' />
	</svg>
);

const Envelope = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6A5.006,5.006,0,0,0,19,1ZM5,3H19a3,3,0,0,1,2.78,1.887l-7.658,7.659a3.007,3.007,0,0,1-4.244,0L2.22,4.887A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V7.5L8.464,13.96a5.007,5.007,0,0,0,7.072,0L22,7.5V18A3,3,0,0,1,19,21Z' />
	</svg>
);

const Download = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z' />
		<path d='M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z' />
	</svg>
);
const CreditCard = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<circle cx='5.5' cy='15.5' r='1.5' />
		<path d='M19,3H5A5.006,5.006,0,0,0,0,8v8a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,5H19a3,3,0,0,1,3,3H2A3,3,0,0,1,5,5ZM19,19H5a3,3,0,0,1-3-3V10H22v6A3,3,0,0,1,19,19Z' />
	</svg>
);

const Clock = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z' />
		<path d='M12,6a1,1,0,0,0-1,1v4.325L7.629,13.437a1,1,0,0,0,1.062,1.7l3.84-2.4A1,1,0,0,0,13,11.879V7A1,1,0,0,0,12,6Z' />
	</svg>
);

const ChartHistogram = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23,22H5a3,3,0,0,1-3-3V1A1,1,0,0,0,0,1V19a5.006,5.006,0,0,0,5,5H23a1,1,0,0,0,0-2Z' />
		<path d='M6,20a1,1,0,0,0,1-1V12a1,1,0,0,0-2,0v7A1,1,0,0,0,6,20Z' />
		<path d='M10,10v9a1,1,0,0,0,2,0V10a1,1,0,0,0-2,0Z' />
		<path d='M15,13v6a1,1,0,0,0,2,0V13a1,1,0,0,0-2,0Z' />
		<path d='M20,9V19a1,1,0,0,0,2,0V9a1,1,0,0,0-2,0Z' />
		<path d='M6,9a1,1,0,0,0,.707-.293l3.586-3.586a1.025,1.025,0,0,1,1.414,0l2.172,2.172a3,3,0,0,0,4.242,0l5.586-5.586A1,1,0,0,0,22.293.293L16.707,5.878a1,1,0,0,1-1.414,0L13.121,3.707a3,3,0,0,0-4.242,0L5.293,7.293A1,1,0,0,0,6,9Z' />
	</svg>
);

const Bulb = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m17.994 2.286a9 9 0 0 0 -14.919 5.536 8.938 8.938 0 0 0 2.793 7.761 6.263 6.263 0 0 1 2.132 4.566v.161a3.694 3.694 0 0 0 3.69 3.69h.62a3.694 3.694 0 0 0 3.69-3.69v-.549a5.323 5.323 0 0 1 1.932-4 8.994 8.994 0 0 0 .062-13.477zm-5.684 19.714h-.62a1.692 1.692 0 0 1 -1.69-1.69s-.007-.26-.008-.31h4.008v.31a1.692 1.692 0 0 1 -1.69 1.69zm4.3-7.741a7.667 7.667 0 0 0 -2.364 3.741h-1.246v-7.184a3 3 0 0 0 2-2.816 1 1 0 0 0 -2 0 1 1 0 0 1 -2 0 1 1 0 0 0 -2 0 3 3 0 0 0 2 2.816v7.184h-1.322a8.634 8.634 0 0 0 -2.448-3.881 7 7 0 0 1 3.951-12.073 7.452 7.452 0 0 1 .828-.046 6.921 6.921 0 0 1 4.652 1.778 6.993 6.993 0 0 1 -.048 10.481z' />
	</svg>
);

const Briefcase = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H5A5.006,5.006,0,0,0,0,9V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V9A5.006,5.006,0,0,0,19,4ZM11,2h2a3,3,0,0,1,2.816,2H8.184A3,3,0,0,1,11,2ZM5,6H19a3,3,0,0,1,3,3v3H2V9A3,3,0,0,1,5,6ZM19,22H5a3,3,0,0,1-3-3V14h9v1a1,1,0,0,0,2,0V14h9v5A3,3,0,0,1,19,22Z' />
	</svg>
);

const Bell = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.555,13.662l-1.9-6.836A9.321,9.321,0,0,0,2.576,7.3L1.105,13.915A5,5,0,0,0,5.986,20H7.1a5,5,0,0,0,9.8,0h.838a5,5,0,0,0,4.818-6.338ZM12,22a3,3,0,0,1-2.816-2h5.632A3,3,0,0,1,12,22Zm8.126-5.185A2.977,2.977,0,0,1,17.737,18H5.986a3,3,0,0,1-2.928-3.651l1.47-6.616a7.321,7.321,0,0,1,14.2-.372l1.9,6.836A2.977,2.977,0,0,1,20.126,16.815Z' />
	</svg>
);

const ArrowSmallLeft = ({ className = '', fontSize = '1.6em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,11H9l3.29-3.29a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0l-4.29,4.3A2,2,0,0,0,6,12H6a2,2,0,0,0,.59,1.4l4.29,4.3a1,1,0,1,0,1.41-1.42L9,13H19a1,1,0,0,0,0-2Z' strokeWidth='5' />
	</svg>
);

const PreviousIcon = ({ className = 'w-6 h-6 text-gray-800 dark:text-white', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 12 16'>
		<path d='M10.819.4a1.974 1.974 0 0 0-2.147.33l-6.5 5.773A2.014 2.014 0 0 0 2 6.7V1a1 1 0 0 0-2 0v14a1 1 0 1 0 2 0V9.3c.055.068.114.133.177.194l6.5 5.773a1.982 1.982 0 0 0 2.147.33A1.977 1.977 0 0 0 12 13.773V2.227A1.977 1.977 0 0 0 10.819.4Z' />
	</svg>
);

const NextIcon = ({ className = 'w-6 h-6 text-gray-800 dark:text-white', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 12 16'>
		<path d='M11 0a1 1 0 0 0-1 1v5.7a2.028 2.028 0 0 0-.177-.194L3.33.732A2 2 0 0 0 0 2.227v11.546A1.977 1.977 0 0 0 1.181 15.6a1.982 1.982 0 0 0 2.147-.33l6.5-5.773A1.88 1.88 0 0 0 10 9.3V15a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1Z' />
	</svg>
);

const Email = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6A5.006,5.006,0,0,0,19,1ZM5,3H19a3,3,0,0,1,2.78,1.887l-7.658,7.659a3.007,3.007,0,0,1-4.244,0L2.22,4.887A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V7.5L8.464,13.96a5.007,5.007,0,0,0,7.072,0L22,7.5V18A3,3,0,0,1,19,21Z' />
	</svg>
);

const Man = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M14.5,13A1.5,1.5,0,1,1,16,11.5,1.5,1.5,0,0,1,14.5,13Zm7.351-4.726A9.975,9.975,0,0,0,12,0C5.1,0,3.124,4.674,1.819,7.767A6.372,6.372,0,0,1,.5,10.136a1,1,0,0,0,.379,1.856,15.806,15.806,0,0,0,7.257-1.1,1.5,1.5,0,1,0,1.724-.84,15.09,15.09,0,0,0,4.956-4.467,1,1,0,1,0-1.626-1.162A13.357,13.357,0,0,1,3,10.027c.227-.453.438-.956.662-1.483C4.892,5.628,6.423,2,12,2a7.978,7.978,0,0,1,7.954,7.15,1,1,0,0,0,.816.878A1.5,1.5,0,0,1,20.5,13a1.606,1.606,0,0,1-.252-.027.994.994,0,0,0-1.117.651C18.215,16.221,15.132,19,12,19h0c-2.9,0-5.6-2.283-6.766-4.539a1,1,0,1,0-1.776.92A11.264,11.264,0,0,0,8,19.953V23a1,1,0,0,0,2,0V20.738a7.708,7.708,0,0,0,4,0V23a1,1,0,0,0,2,0V19.954a11.037,11.037,0,0,0,4.732-4.962,3.5,3.5,0,0,0,1.119-6.718Z' />
	</svg>
);

const Woman = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M14.5,13A1.5,1.5,0,1,1,16,11.5,1.5,1.5,0,0,1,14.5,13Zm9.425,5.144A5,5,0,0,1,19,24H15a1,1,0,0,1-1-1V20.737A7.959,7.959,0,0,1,12,21a7.84,7.84,0,0,1-2-.27V23a1,1,0,0,1-1,1H5A5,5,0,0,1,.075,18.144l.3-1.74a2.939,2.939,0,0,1,5.337-1.138C6.976,17.124,9.409,19,12,19h0c3.13,0,6.214-2.779,7.13-5.376a1.03,1.03,0,0,1,.959-.667l.432.007A1.461,1.461,0,0,0,22,11.5a1.5,1.5,0,0,0-1.23-1.474,1,1,0,0,1-.816-.879A7.977,7.977,0,0,0,12,2C6.423,2,4.892,5.628,3.662,8.544c-.224.527-.435,1.03-.662,1.483A13.354,13.354,0,0,0,13.186,4.419a1,1,0,0,1,1.628,1.162,15.089,15.089,0,0,1-4.956,4.467,1.5,1.5,0,1,1-1.725.84,15.807,15.807,0,0,1-7.257,1.1A1,1,0,0,1,.5,10.136,6.372,6.372,0,0,0,1.819,7.767C3.124,4.674,5.1,0,12,0a9.972,9.972,0,0,1,9.85,8.274A3.5,3.5,0,0,1,24,11.5a3.428,3.428,0,0,1-.854,2.257c.007.026.025.047.03.075ZM8,19.94a11.088,11.088,0,0,1-3.941-3.552.946.946,0,0,0-.783-.424H3.259a.945.945,0,0,0-.911.782l-.3,1.739A3,3,0,0,0,5,22H8Zm13.955-1.455-.628-3.613a3.384,3.384,0,0,1-.579.086A11.033,11.033,0,0,1,16,19.952V22h3a3,3,0,0,0,2.955-3.514Z' />
	</svg>
);

const Pet = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M21.5,12.932A8.184,8.184,0,0,0,24,7.284C24,1.63,21.233,1.02,20.044,1.02c-2.968,0-5.884,2.9-8.041,5.521C9.862,3.942,6.937,1.02,3.961,1.02-.188.76-1.706,9.091,2.506,12.933c.176.174.359.337.544.49A6.554,6.554,0,0,0,1.33,20.11a4.02,4.02,0,0,0,2.3,2.574,3.914,3.914,0,0,0,3.355-.131A16.382,16.382,0,0,0,11,19.621V22a1,1,0,0,0,2,0V19.621a16.351,16.351,0,0,0,4.018,2.931,3.911,3.911,0,0,0,3.355.132,4.021,4.021,0,0,0,2.3-2.573A6.567,6.567,0,0,0,21,13.384C21.171,13.242,21.338,13.092,21.5,12.932ZM11,15.636c0,1.478-2.08,3.642-4.947,5.146a1.891,1.891,0,0,1-1.647.06,2.027,2.027,0,0,1-1.158-1.3,4.6,4.6,0,0,1,1.566-5.038A6.25,6.25,0,0,0,7.206,15,9.811,9.811,0,0,0,11,14.293Zm0-3.651A6.3,6.3,0,0,1,7.18,13a4.559,4.559,0,0,1-3.27-1.49,6.234,6.234,0,0,1-1.9-4.225c0-2.71.713-4.264,1.955-4.264C5.746,3.02,8.106,4.858,11,8.491ZM13,8.5C15.88,4.87,18.252,3.02,20.044,3.02,21.287,3.02,22,4.574,22,7.284a6.236,6.236,0,0,1-1.9,4.225A4.691,4.691,0,0,1,16.87,13,6.435,6.435,0,0,1,13,11.98Zm7.752,11.048a2.025,2.025,0,0,1-1.158,1.3,1.892,1.892,0,0,1-1.647-.061C15.08,19.278,13,17.114,13,15.636V14.291A9.812,9.812,0,0,0,16.8,15a6.094,6.094,0,0,0,2.424-.51A4.535,4.535,0,0,1,20.752,19.544ZM10,2a2,2,0,0,1,4,0A2,2,0,0,1,10,2Z' />
	</svg>
);

const Question = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M11.904,16c.828,0,1.5,.672,1.5,1.5s-.672,1.5-1.5,1.5-1.5-.672-1.5-1.5,.672-1.5,1.5-1.5Zm1-2c0-.561,.408-1.225,.928-1.512,1.5-.826,2.307-2.523,2.009-4.223-.283-1.613-1.607-2.938-3.221-3.221-1.182-.204-2.38,.112-3.289,.874-.907,.763-1.428,1.879-1.428,3.063,0,.553,.448,1,1,1s1-.447,1-1c0-.592,.26-1.15,.714-1.532,.461-.386,1.052-.542,1.657-.435,.787,.138,1.458,.81,1.596,1.596,.153,.871-.241,1.705-1.004,2.125-1.156,.637-1.963,1.979-1.963,3.264,0,.553,.448,1,1,1s1-.447,1-1Zm11.096,5v-6.66C24,5.861,19.096,.454,12.836,.028,9.361-.202,5.961,1.066,3.509,3.521,1.057,5.977-.211,9.378,.03,12.854c.44,6.354,6.052,11.146,13.054,11.146h5.917c2.757,0,5-2.243,5-5ZM12.701,2.024c5.215,.354,9.299,4.885,9.299,10.315v6.66c0,1.654-1.346,3-3,3h-5.917c-6.035,0-10.686-3.904-11.059-9.284-.201-2.899,.855-5.735,2.899-7.781,1.882-1.885,4.435-2.934,7.092-2.934,.228,0,.457,.008,.685,.023Z' />
	</svg>
);

const Child = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M24,11.5a3.5,3.5,0,0,0-2.149-3.226,10,10,0,0,0-19.7,0,3.5,3.5,0,0,0,1.119,6.718,10.607,10.607,0,0,0,2.071,2.955,8.908,8.908,0,0,0-2.272,4.928,1,1,0,0,0,.868,1.117A1.093,1.093,0,0,0,4.061,24a1,1,0,0,0,.991-.875,6.924,6.924,0,0,1,1.815-3.872A8.948,8.948,0,0,0,12,21a8.94,8.94,0,0,0,5.119-1.74,6.922,6.922,0,0,1,1.808,3.862,1,1,0,0,0,.991.876,1.063,1.063,0,0,0,.125-.008,1,1,0,0,0,.868-1.116,8.9,8.9,0,0,0-2.261-4.918,10.622,10.622,0,0,0,2.082-2.966A3.5,3.5,0,0,0,24,11.5Zm-3.752,1.473a.993.993,0,0,0-1.117.651C18.215,16.222,15.13,19,12,19s-6.215-2.78-7.131-5.378a.994.994,0,0,0-1.117-.651A1.606,1.606,0,0,1,3.5,13a1.5,1.5,0,0,1-.27-2.972,1,1,0,0,0,.816-.878A7.961,7.961,0,0,1,8.13,3a4.075,4.075,0,0,0-.022,1.942,4,4,0,0,0,7.688.318A.977.977,0,0,0,14.851,4H14.7a.867.867,0,0,0-.806.631A2,2,0,1,1,12,2a7.978,7.978,0,0,1,7.954,7.15,1,1,0,0,0,.816.878A1.5,1.5,0,0,1,20.5,13,1.606,1.606,0,0,1,20.248,12.973Z' />
		<circle cx='9.5' cy='11.5' r='1.5' />
		<circle cx='14.5' cy='11.5' r='1.5' />
	</svg>
);

const Close = ({ className = 'w-6 h-6 text-white', fontSize = '0.8em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
	</svg>
);

const CheckCircle = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={` text-white ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
			<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
		</svg>
	);
};
export { CheckCircle, PlusCircle, AngleLeft, AngleRight, UsersAlt, Users, UserAdd, User, Trash, Star, ShoppingCart, Share, SettingsSliders, Settings, Search, Refresh, TreeViewIcon, Picture, PhoneCall, Pencil, MenuBurger, Megaphone, Marker, Lock, ListCheck, Key, Info, Home, Heart, Globe, EyeCrossed, Eye, Exit, Envelope, Edit, Download, Document, CrossCircle, Cross, CreditCard, Clock, Checkbox, Check, ChartHistogram, Calendar, Bulb, Briefcase, Bell, ArrowSmallLeft, AngleSmallDown, Email, Man, Woman, Pet, Question, Child, GetDefaultIcon, GetAscIcon, GetDescIcon, Folder, FolderClose, CaretDown, CaretRight, Compress, Expand, Group, PreviousIcon, NextIcon, Close };
