import React from 'react';
import { NotificationIconProps } from 'src/types/component';
import { CompressSvg, ExpandSvg, IconSvg } from 'src/types/icon';

const Notification = ({ onOpen }: NotificationIconProps) => {
	return (
		<>
			<button id='dropdownNotificationButton' data-dropdown-toggle='dropdownNotification' className='inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none' type='button' onClick={onOpen}>
				<svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
					<path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z'></path>
				</svg>
				<div className='relative flex'>
					<div className='relative inline-flex w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-2 right-3'></div>
				</div>
			</button>
		</>
	);
};

const Compress = ({ className, onClick }: CompressSvg) => {
	return (
		<svg className={`w-[24px] h-[24px] text-gray-800 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 18' onClick={onClick}>
			<path d='M18 .989a1.016 1.016 0 0 0-.056-.277c-.011-.034-.009-.073-.023-.1a.786.786 0 0 0-.066-.1.979.979 0 0 0-.156-.224l-.007-.01a.873.873 0 0 0-.116-.073.985.985 0 0 0-.2-.128.959.959 0 0 0-.231-.047A.925.925 0 0 0 17 0h-4a1 1 0 1 0 0 2h1.664l-3.388 3.552a1 1 0 0 0 1.448 1.381L16 3.5V5a1 1 0 0 0 2 0V.989ZM17 12a1 1 0 0 0-1 1v1.586l-3.293-3.293a1 1 0 0 0-1.414 1.414L14.586 16H13a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1ZM3.414 2H5a1 1 0 0 0 0-2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3.414l3.536 3.535A1 1 0 0 0 6.95 5.535L3.414 2Zm2.139 9.276L2 14.665V13a1 1 0 1 0-2 0v4c.006.046.015.09.027.135.006.08.022.16.048.235a.954.954 0 0 0 .128.2.95.95 0 0 0 .073.117l.01.007A.983.983 0 0 0 1 18h4a1 1 0 0 0 0-2H3.5l3.436-3.276a1 1 0 0 0-1.38-1.448h-.003Z' />
		</svg>
	);
};
const Expand = ({ className, onClick }: ExpandSvg) => {
	return (
		<svg className={`w-[22px] h-[22px] text-gray-800 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 18' onClick={onClick}>
			<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='0.6' d='M13 17v-4h4M1 5h4V1M1 13h4v4m8-16v4h4' />
		</svg>
	);
};

const CaretDown = ({ className }: IconSvg) => {
	return (
		<svg className={`w-[10px] h-[10px] text-gray-800 mr-2 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 10'>
			<path d='M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z' />
		</svg>
	);
};
const Folder = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-[14px] h-[14px] text-gray-800  mx-1 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 21.591 17.1">
			<path id="folder" d="M3.959,20.55H18.2a2.765,2.765,0,0,0,2.643-1.987l1.845-6.392A2.725,2.725,0,0,0,20.447,8.7V8.2A2.753,2.753,0,0,0,17.7,5.45H10.679a1.274,1.274,0,0,1-.866-.337L8.845,4.2A2.737,2.737,0,0,0,6.959,3.45h-3A2.753,2.753,0,0,0,1.209,6.2V17.8a2.753,2.753,0,0,0,2.75,2.75Zm16.08-10.394a1.251,1.251,0,0,1,1.2,1.6L19.4,18.144a1.257,1.257,0,0,1-1.2.9H4.616a1.25,1.25,0,0,1-1.2-1.6L5.26,11.06a1.256,1.256,0,0,1,1.2-.9ZM2.709,6.2a1.252,1.252,0,0,1,1.25-1.25h3a1.241,1.241,0,0,1,.856.347l.976.915a2.783,2.783,0,0,0,1.888.738H17.7A1.251,1.251,0,0,1,18.95,8.2v.456H6.461a2.765,2.765,0,0,0-2.643,1.988L2.709,14.487Z" transform="translate(-1.209 -3.45)" />
		</svg>
	);
};
const CaretRight = ({ className }: IconSvg) => {
	return (
		<svg className={`w-[10px] h-[10px] text-gray-800 mr-2 ${className}`} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 10 16'>
			<path d='M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z' />
		</svg>
	);
};

const HamburgerMenu = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 24 24' style={{ height: fontSize, width: fontSize }}>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M1 1h15M1 7h15M1 13h15' />
	</svg>
);

const PlusCircle = ({ className = '', fontSize = '1.2em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
		<path d='M9.546.5a9.5 9.5 0 1 0 9.5 9.5 9.51 9.51 0 0 0-9.5-9.5ZM13.788 11h-3.242v3.242a1 1 0 1 1-2 0V11H5.304a1 1 0 0 1 0-2h3.242V5.758a1 1 0 0 1 2 0V9h3.242a1 1 0 1 1 0 2Z' />
	</svg>
);

const AngleLeft = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M17.17,24a1,1,0,0,1-.71-.29L8.29,15.54a5,5,0,0,1,0-7.08L16.46.29a1,1,0,1,1,1.42,1.42L9.71,9.88a3,3,0,0,0,0,4.24l8.17,8.17a1,1,0,0,1,0,1.42A1,1,0,0,1,17.17,24Z' />
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

const UserIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
		<path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
	</svg>
);

const UserAdd = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23,11H21V9a1,1,0,0,0-2,0v2H17a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V13h2a1,1,0,0,0,0-2Z' />
		<path d='M9,12A6,6,0,1,0,3,6,6.006,6.006,0,0,0,9,12ZM9,2A4,4,0,1,1,5,6,4,4,0,0,1,9,2Z' />
		<path d='M9,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,9,14Z' />
	</svg>
);

const User = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 14 18'>
		<path d='M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z' />
	</svg>
);

const User2 = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg id="user_1_" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 21.094 24">
		<g id="Group_12079" data-name="Group 12079" transform="translate(4.438)">
			<g id="Group_12078" data-name="Group 12078">
				<path id="Path_20632" data-name="Path 20632" d="M127.109,0a6.109,6.109,0,1,0,6.109,6.109A6.116,6.116,0,0,0,127.109,0Zm0,10.86a4.751,4.751,0,1,1,4.751-4.751A4.757,4.757,0,0,1,127.109,10.86Z" transform="translate(-121)" />
			</g>
		</g>
		<g id="Group_12081" data-name="Group 12081" transform="translate(0 14.407)">
			<g id="Group_12080" data-name="Group 12080" transform="translate(0)">
				<path id="Path_20633" data-name="Path 20633" d="M49.42,302.633A9.184,9.184,0,0,0,42.953,300H40.141a9.184,9.184,0,0,0-6.467,2.633A8.747,8.747,0,0,0,31,308.914a.691.691,0,0,0,.7.679H51.391a.691.691,0,0,0,.7-.679A8.747,8.747,0,0,0,49.42,302.633Zm-16.983,5.6a7.677,7.677,0,0,1,7.7-6.878h2.813a7.677,7.677,0,0,1,7.7,6.878Z" transform="translate(-31 -300)" />
			</g>
		</g>
	</svg>
);

const Trash = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.122 18" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<g id="delete_1_" data-name="delete" transform="translate(-2.25 -1.75)">
			<path id="Path_20871" data-name="Path 20871" d="M14.432,20.121H7.685a2.679,2.679,0,0,1-2.636-2.512L4.25,5.453a.667.667,0,0,1,.176-.483.676.676,0,0,1,.483-.22h12.3a.659.659,0,0,1,.659.7L17.1,17.609a2.679,2.679,0,0,1-2.671,2.512ZM5.647,6.068,6.323,17.53A1.362,1.362,0,0,0,7.685,18.8h6.747a1.37,1.37,0,0,0,1.362-1.274l.712-11.419Z" transform="translate(-0.247 -0.371)" />
			<path id="Path_20872" data-name="Path 20872" d="M18.713,6.064H2.909a.657.657,0,1,1,0-1.314h15.8a.657.657,0,1,1,0,1.314Z" transform="translate(0 -0.371)" />
			<path id="Path_20873" data-name="Path 20873" d="M14.165,5.693H8.907a.666.666,0,0,1-.657-.657V3.459A1.753,1.753,0,0,1,9.959,1.75h3.155A1.753,1.753,0,0,1,14.822,3.5V5.036a.666.666,0,0,1-.657.657Zm-4.6-1.314h3.943V3.5a.394.394,0,0,0-.394-.394H9.959a.394.394,0,0,0-.394.394Z" transform="translate(-0.725)" />
			<path id="Path_20874" data-name="Path 20874" d="M14.907,17.075a.666.666,0,0,1-.657-.657V9.407a.657.657,0,1,1,1.314,0v7.01A.666.666,0,0,1,14.907,17.075Z" transform="translate(-1.462 -0.843)" />
			<path id="Path_20875" data-name="Path 20875" d="M8.907,17.075a.666.666,0,0,1-.657-.657V9.407a.657.657,0,1,1,1.314,0v7.01A.666.666,0,0,1,8.907,17.075Z" transform="translate(-0.731 -0.843)" />
			<path id="Path_20876" data-name="Path 20876" d="M11.907,17.075a.666.666,0,0,1-.657-.657V9.407a.657.657,0,1,1,1.314,0v7.01A.666.666,0,0,1,11.907,17.075Z" transform="translate(-1.096 -0.843)" />
		</g>
	</svg>
);

const Star = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z' />
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

const Share1 = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 16.578 16.574">
		<path id="share_1_" d="M12.672,17.574H-.1a1.9,1.9,0,0,1-1.9-1.9V2.9A1.9,1.9,0,0,1-.1,1h3.8a.634.634,0,1,1,0,1.268H-.1A.634.634,0,0,0-.732,2.9v12.77a.634.634,0,0,0,.634.634h12.77a.634.634,0,0,0,.634-.634V13.136a.634.634,0,0,1,1.268,0v2.536A1.9,1.9,0,0,1,12.672,17.574Zm-7.608-6.43a.634.634,0,0,1-.634-.634V9.242A4.438,4.438,0,0,1,8.868,4.8h3.544L10.954,3.352a.637.637,0,1,1,.9-.9L14.39,4.988a.634.634,0,0,1,0,.9L11.854,8.424a.637.637,0,1,1-.9-.9l1.458-1.452H8.868A3.17,3.17,0,0,0,5.7,9.242V10.51A.634.634,0,0,1,5.064,11.144Z" transform="translate(2 -1)" />
	</svg>
);

const SettingsSliders = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M1,4.75H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2ZM7.333,2a1.75,1.75,0,1,1-1.75,1.75A1.752,1.752,0,0,1,7.333,2Z' />
		<path d='M23,11H20.264a3.727,3.727,0,0,0-7.194,0H1a1,1,0,0,0,0,2H13.07a3.727,3.727,0,0,0,7.194,0H23a1,1,0,0,0,0-2Zm-6.333,2.75A1.75,1.75,0,1,1,18.417,12,1.752,1.752,0,0,1,16.667,13.75Z' />
		<path d='M23,19.25H10.931a3.728,3.728,0,0,0-7.195,0H1a1,1,0,0,0,0,2H3.736a3.728,3.728,0,0,0,7.195,0H23a1,1,0,0,0,0-2ZM7.333,22a1.75,1.75,0,1,1,1.75-1.75A1.753,1.753,0,0,1,7.333,22Z' />
	</svg>
);

const Settings = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z' />
		<path d='M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z' />
	</svg>
);

const Search = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`mr-1 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 18 18">
		<g id="Group_4" data-name="Group 4" transform="translate(0.75 0.75)">
			<path id="Shape" d="M6.344,13.438a7.094,7.094,0,1,1,7.094-7.094A7.1,7.1,0,0,1,6.344,13.438Zm0-12.287a5.193,5.193,0,1,0,5.193,5.193A5.2,5.2,0,0,0,6.344,1.15Z" transform="translate(0 0)" fill="#363637" />
			<path id="Shape-2" data-name="Shape" d="M6.333,5.828a.946.946,0,0,1-.559-.183L.39,1.718A.95.95,0,1,1,1.51.183L6.894,4.11a.95.95,0,0,1-.561,1.718Z" transform="translate(10.037 10.465) rotate(8)" fill="#363637" />
		</g>
	</svg>
);

const Refresh = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`mr-1 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 20'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.4' d='M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97' />
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
const EditIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z' />
		<path d='M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z' />
	</svg>
);

const MenuBurger = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<rect y='11' width='24' height='2' rx='1' />
		<rect y='4' width='24' height='2' rx='1' />
		<rect y='18' width='24' height='2' rx='1' />
	</svg>
);

const Megaphone = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m17 0a1 1 0 0 0 -1 1c0 2.949-2.583 4-5 4h-7a4 4 0 0 0 -4 4v2a3.979 3.979 0 0 0 1.514 3.109l3.572 7.972a3.233 3.233 0 0 0 2.953 1.919 2.982 2.982 0 0 0 2.72-4.2l-2.2-4.8h2.441c2.417 0 5 1.051 5 4a1 1 0 0 0 2 0v-18a1 1 0 0 0 -1-1zm-8.063 20.619a.983.983 0 0 1 -.898 1.381 1.232 1.232 0 0 1 -1.126-.734l-2.808-6.266h2.254zm7.063-6.019a7.723 7.723 0 0 0 -5-1.6h-7a2 2 0 0 1 -2-2v-2a2 2 0 0 1 2-2h7a7.723 7.723 0 0 0 5-1.595zm7.9.852a1 1 0 0 1 -1.342.448l-2-1a1 1 0 0 1 .894-1.79l2 1a1 1 0 0 1 .448 1.337zm-3.79-9a1 1 0 0 1 .448-1.342l2-1a1 1 0 1 1 .894 1.79l-2 1a1 1 0 0 1 -1.342-.448zm-.11 3.548a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 -1-1z' />
	</svg>
);

const Marker = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z' />
		<path d='M12,24a5.271,5.271,0,0,1-4.311-2.2c-3.811-5.257-5.744-9.209-5.744-11.747a10.055,10.055,0,0,1,20.11,0c0,2.538-1.933,6.49-5.744,11.747A5.271,5.271,0,0,1,12,24ZM12,2.181a7.883,7.883,0,0,0-7.874,7.874c0,2.01,1.893,5.727,5.329,10.466a3.145,3.145,0,0,0,5.09,0c3.436-4.739,5.329-8.456,5.329-10.466A7.883,7.883,0,0,0,12,2.181Z' />
	</svg>
);

const Lock = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 20'>
		<path d='M14 7h-1.5V4.5a4.5 4.5 0 1 0-9 0V7H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-5 8a1 1 0 1 1-2 0v-3a1 1 0 1 1 2 0v3Zm1.5-8h-5V4.5a2.5 2.5 0 1 1 5 0V7Z' />
	</svg>
);

const ListCheck = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m4 6a2.982 2.982 0 0 1 -2.122-.879l-1.544-1.374a1 1 0 0 1 1.332-1.494l1.585 1.414a1 1 0 0 0 1.456.04l3.604-3.431a1 1 0 0 1 1.378 1.448l-3.589 3.414a2.964 2.964 0 0 1 -2.1.862zm20-2a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.589-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1.023 1.023 0 0 1 -1.414 0l-1.59-1.585a1 1 0 0 0 -1.414 1.414l1.585 1.585a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.585-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1 1 0 0 1 -1.456-.04l-1.585-1.414a1 1 0 0 0 -1.332 1.494l1.544 1.374a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1z' />
	</svg>
);

const Key = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m22 0h-2.172a2.978 2.978 0 0 0 -2.121.879l-8.361 8.36a7.537 7.537 0 1 0 5.415 5.415l1.239-1.239v-2.415h3v-3h2.414l1.707-1.707a2.983 2.983 0 0 0 .879-2.122v-2.171a2 2 0 0 0 -2-2zm0 4.171a1 1 0 0 1 -.293.708l-1.121 1.121h-3.586v3h-3v3.585l-1.545 1.545a5.64 5.64 0 0 1 .545 2.37 5.5 5.5 0 1 1 -5.5-5.5 4.236 4.236 0 0 1 2.369.544l9.252-9.251a1.009 1.009 0 0 1 .707-.293h2.172zm-17 13.829a1 1 0 1 0 1-1 1 1 0 0 0 -1 1z' />
	</svg>
);

const Info = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
		<path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z' />
	</svg>
);

const Info2 = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox="0 0 80 80">
		<g id="info" transform="translate(5615 -8028)">
			<path id="information-button" d="M37.981,20a3.991,3.991,0,1,1-3.991,3.991A3.991,3.991,0,0,1,37.981,20Zm5.986,31.924H32a2,2,0,0,1,0-3.991h2V35.962H32a2,2,0,0,1,0-3.991h7.981a2,2,0,0,1,2,2V47.934h2a2,2,0,0,1,0,3.991Z" transform="translate(-5613 8032)" />
		</g>
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

const EyeCrossed = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm12.567,1.534C20.233,15.7,17.218,19.345,12,19.345A10.1,10.1,0,0,1,7.234,18.18l2.013-2.013a4.992,4.992,0,0,0,6.92-6.92l2.31-2.31a13.723,13.723,0,0,1,3.09,3.529A2.918,2.918,0,0,1,21.567,13.534Z' />
	</svg>
);

const Eye = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M23.271,9.419C21.72,6.893,18.192,2.655,12,2.655S2.28,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162C2.28,17.107,5.808,21.345,12,21.345s9.72-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419Zm-1.705,4.115C20.234,15.7,17.219,19.345,12,19.345S3.766,15.7,2.434,13.534a2.918,2.918,0,0,1,0-3.068C3.766,8.3,6.781,4.655,12,4.655s8.234,3.641,9.566,5.811A2.918,2.918,0,0,1,21.566,13.534Z' />
		<path d='M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z' />
	</svg>
);

const Exit = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M22.829,9.172,18.95,5.293a1,1,0,0,0-1.414,1.414l3.879,3.879a2.057,2.057,0,0,1,.3.39c-.015,0-.027-.008-.042-.008h0L5.989,11a1,1,0,0,0,0,2h0l15.678-.032c.028,0,.051-.014.078-.016a2,2,0,0,1-.334.462l-3.879,3.879a1,1,0,1,0,1.414,1.414l3.879-3.879a4,4,0,0,0,0-5.656Z' />
		<path d='M7,22H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H7A1,1,0,0,0,7,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H7a1,1,0,0,0,0-2Z' />
	</svg>
);
const Edit = ({ className = '', fontSize = '1em', onClick }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' onClick={onClick} className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 16 16">
		<g id="edit_3_" data-name="edit (3)" transform="translate(-8 -7.357)">
			<path id="Path_20938" data-name="Path 20938" d="M12.6,23.788h6.578a4.61,4.61,0,0,0,4.6-4.6V14.907a.658.658,0,0,0-1.316,0v4.276a3.293,3.293,0,0,1-3.289,3.289H12.6a3.293,3.293,0,0,1-3.289-3.289V12.6A3.293,3.293,0,0,1,12.6,9.316h4.276a.658.658,0,1,0,0-1.316H12.6A4.61,4.61,0,0,0,8,12.6v6.578a4.61,4.61,0,0,0,4.6,4.6Z" transform="translate(0 -0.431)" />
			<path id="Path_20939" data-name="Path 20939" d="M22.813,15.606l-.166,1.83a1.014,1.014,0,0,0,1.009,1.105.672.672,0,0,0,.092,0l1.829-.166a2.081,2.081,0,0,0,1.283-.6l4.705-4.7,1.781-1.781a1.647,1.647,0,0,0,0-2.326L32.225,7.838a1.647,1.647,0,0,0-2.326,0l-1.78,1.78-4.7,4.705A2.081,2.081,0,0,0,22.813,15.606Zm8.016-6.838a.329.329,0,0,1,.465,0l1.12,1.12a.329.329,0,0,1,0,.465l-.85.85L29.98,9.618Zm-6.706,6.958a.766.766,0,0,1,.221-.472l4.7-4.7,1.586,1.586-4.7,4.7a.766.766,0,0,1-.472.221l-1.468.134Z" transform="translate(-9.826)" />
		</g>
	</svg>
);

const Download = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z' />
		<path d='M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z' />
	</svg>
);

const Document = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='m17 14a1 1 0 0 1 -1 1h-8a1 1 0 0 1 0-2h8a1 1 0 0 1 1 1zm-4 3h-5a1 1 0 0 0 0 2h5a1 1 0 0 0 0-2zm9-6.515v8.515a5.006 5.006 0 0 1 -5 5h-10a5.006 5.006 0 0 1 -5-5v-14a5.006 5.006 0 0 1 5-5h4.515a6.958 6.958 0 0 1 4.95 2.05l3.484 3.486a6.951 6.951 0 0 1 2.051 4.949zm-6.949-7.021a5.01 5.01 0 0 0 -1.051-.78v4.316a1 1 0 0 0 1 1h4.316a4.983 4.983 0 0 0 -.781-1.05zm4.949 7.021c0-.165-.032-.323-.047-.485h-4.953a3 3 0 0 1 -3-3v-4.953c-.162-.015-.321-.047-.485-.047h-4.515a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3z' />
	</svg>
);

const CrossCircle = ({ className = '', fontSize = '1em', marginleft = '1px', marginbottom = '1px' }: IconSvg) => (
	<svg className={`w-6 h-6 text-gray-800 ${className}`} style={{ height: fontSize, width: fontSize, marginLeft: marginleft, marginBottom: marginbottom }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
	</svg>
);

const CrossCircled = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M16,8a1,1,0,0,0-1.414,0L12,10.586,9.414,8A1,1,0,0,0,8,9.414L10.586,12,8,14.586A1,1,0,0,0,9.414,16L12,13.414,14.586,16A1,1,0,0,0,16,14.586L13.414,12,16,9.414A1,1,0,0,0,16,8Z' />
		<path d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,22A10,10,0,1,1,22,12,10.011,10.011,0,0,1,12,22Z' />
	</svg>
);

const Cross = ({ className = '', fontSize = '0.6em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path id="Union_49" data-name="Union 49" d="M10.537,11.748,6,7.212,1.464,11.748A.857.857,0,0,1,.251,10.536L4.788,6,.251,1.463A.857.857,0,0,1,1.464.251L6,4.787,10.537.251a.857.857,0,0,1,1.212,1.213L7.212,6l4.536,4.537a.857.857,0,1,1-1.212,1.212Z" />
	</svg>
);

const Cross2 = ({ className = '', fontSize = '0.6em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.851 31.85" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path id="Path_28638" data-name="Path 28638" d="M186.332,181.552a3.379,3.379,0,1,1-4.779,4.779L171.4,176.175l-10.156,10.156a3.379,3.379,0,0,1-4.779-4.779L166.618,171.4l-10.156-10.156a3.379,3.379,0,0,1,4.779-4.779L171.4,166.618l10.156-10.156a3.379,3.379,0,0,1,4.779,4.779L176.175,171.4Zm0,0" transform="translate(-155.471 -155.471)" />
	</svg>
);

const CreditCard = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<circle cx='5.5' cy='15.5' r='1.5' />
		<path d='M19,3H5A5.006,5.006,0,0,0,0,8v8a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,5H19a3,3,0,0,1,3,3H2A3,3,0,0,1,5,5ZM19,19H5a3,3,0,0,1-3-3V10H22v6A3,3,0,0,1,19,19Z' />
	</svg>
);

const Clock = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg id="clock_2_" data-name="clock (2)" xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16.666 16.666">
		<g id="Group_12655" data-name="Group 12655" transform="translate(7.601 3.76)">
			<g id="Group_12654" data-name="Group 12654">
				<path id="Path_20892" data-name="Path 20892" d="M239.917,124.937l-2.41-1.807v-3.681a.669.669,0,1,0-1.339,0v4.016a.668.668,0,0,0,.268.535l2.677,2.008a.669.669,0,0,0,.8-1.071Z" transform="translate(-236.169 -118.779)" />
			</g>
		</g>
		<g id="Group_12657" data-name="Group 12657">
			<g id="Group_12656" data-name="Group 12656">
				<path id="Path_20893" data-name="Path 20893" d="M8.333,0a8.333,8.333,0,1,0,8.333,8.333A8.342,8.342,0,0,0,8.333,0Zm0,15.375a7.042,7.042,0,1,1,7.042-7.042A7.051,7.051,0,0,1,8.333,15.375Z" />
			</g>
		</g>
	</svg>
);

const Checkbox = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0Zm3,19a3,3,0,0,1-3,3H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3Z' />
		<path d='M9.333,15.919,5.414,12A1,1,0,0,0,4,12H4a1,1,0,0,0,0,1.414l3.919,3.919a2,2,0,0,0,2.829,0L20,8.081a1,1,0,0,0,0-1.414h0a1,1,0,0,0-1.414,0Z' />
	</svg>
);

const Check = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.272 24.795" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path id="check_2_" data-name="check (2)" d="M52.739,27.583,33.781,46.541a2.914,2.914,0,0,1-4.124,0l-9.479-9.479A2.916,2.916,0,1,1,24.3,32.938l7.417,7.417,16.9-16.9a2.916,2.916,0,0,1,4.124,4.124Zm0,0" transform="translate(-19.323 -22.601)" />
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

const Calendar = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 16.326 18">
		<g id="calendar" transform="translate(-2.25 -1.25)">
			<path id="Path_3843" data-name="Path 3843" d="M8,5.75A.755.755,0,0,1,7.25,5V2a.75.75,0,0,1,1.5,0V5A.755.755,0,0,1,8,5.75Z" transform="translate(-0.882)" />
			<path id="Path_3844" data-name="Path 3844" d="M16,5.75A.755.755,0,0,1,15.25,5V2a.75.75,0,0,1,1.5,0V5A.755.755,0,0,1,16,5.75Z" transform="translate(-2.293)" />
			<path id="Path_3845" data-name="Path 3845" d="M8.5,14.5a1,1,0,0,1-.38-.08.96.96,0,0,1-.62-.92,1,1,0,0,1,.08-.38,1.155,1.155,0,0,1,.21-.33,1.032,1.032,0,0,1,.33-.21,1.021,1.021,0,0,1,1.09.21,1.052,1.052,0,0,1,.29.71,1.5,1.5,0,0,1-.02.2.636.636,0,0,1-.06.18.757.757,0,0,1-.09.18,1.576,1.576,0,0,1-.12.15,1.052,1.052,0,0,1-.71.29Z" transform="translate(-0.952 -2.02)" />
			<path id="Path_3846" data-name="Path 3846" d="M12,14.5a1,1,0,0,1-.38-.08A.96.96,0,0,1,11,13.5a1,1,0,0,1,.08-.38,1.155,1.155,0,0,1,.21-.33,1.032,1.032,0,0,1,.33-.21,1,1,0,0,1,1.09.21,1.052,1.052,0,0,1,.29.71,1.5,1.5,0,0,1-.02.2.636.636,0,0,1-.06.18.757.757,0,0,1-.09.18,1.576,1.576,0,0,1-.12.15,1.052,1.052,0,0,1-.71.29Z" transform="translate(-1.587 -2.019)" />
			<path id="Path_3847" data-name="Path 3847" d="M15.5,14.5a1,1,0,0,1-.38-.08,1.032,1.032,0,0,1-.33-.21l-.12-.15a.757.757,0,0,1-.09-.18.636.636,0,0,1-.06-.18,1.5,1.5,0,0,1-.02-.2,1.052,1.052,0,0,1,.29-.71,1.032,1.032,0,0,1,.33-.21,1,1,0,0,1,1.09.21,1.052,1.052,0,0,1,.29.71,1.5,1.5,0,0,1-.02.2.636.636,0,0,1-.06.18.757.757,0,0,1-.09.18,1.576,1.576,0,0,1-.12.15,1.052,1.052,0,0,1-.71.29Z" transform="translate(-2.222 -2.019)" />
			<path id="Path_3848" data-name="Path 3848" d="M8.5,18a1,1,0,0,1-.38-.08,1.155,1.155,0,0,1-.33-.21A1.052,1.052,0,0,1,7.5,17a1,1,0,0,1,.08-.38.933.933,0,0,1,.21-.33A1,1,0,1,1,8.5,18Z" transform="translate(-0.952 -2.648)" />
			<path id="Path_3849" data-name="Path 3849" d="M12,18a.99.99,0,0,1-1-1,1,1,0,0,1,.08-.38.933.933,0,0,1,.21-.33,1.047,1.047,0,0,1,1.42,0,.933.933,0,0,1,.21.33A1,1,0,0,1,13,17a.99.99,0,0,1-1,1Z" transform="translate(-1.587 -2.648)" />
			<path id="Path_3850" data-name="Path 3850" d="M15.5,18a1.052,1.052,0,0,1-.71-.29.933.933,0,0,1-.21-.33.942.942,0,0,1,0-.76.933.933,0,0,1,.21-.33,1,1,0,0,1,.9-.27.6.6,0,0,1,.19.06.757.757,0,0,1,.18.09,1.576,1.576,0,0,1,.15.12A1,1,0,0,1,15.5,18Z" transform="translate(-2.222 -2.647)" />
			<path id="Path_3851" data-name="Path 3851" d="M17.454,9.84H3.371a.7.7,0,0,1-.621-.75.7.7,0,0,1,.621-.75H17.454a.7.7,0,0,1,.621.75A.7.7,0,0,1,17.454,9.84Z" transform="translate(0 -1.241)" />
			<path id="Path_3852" data-name="Path 3852" d="M13.762,19.25h-6.7c-3.056,0-4.814-1.732-4.814-4.744V7.494c0-3.011,1.758-4.744,4.814-4.744h6.7c3.056,0,4.814,1.733,4.814,4.744v7.013C18.576,17.518,16.817,19.25,13.762,19.25ZM7.064,3.987c-2.394,0-3.558,1.147-3.558,3.506v7.013c0,2.36,1.164,3.506,3.558,3.506h6.7c2.394,0,3.558-1.147,3.558-3.506V7.494c0-2.359-1.164-3.506-3.558-3.506Z" transform="translate(0 0)" />
		</g>
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

const ArrowSmallLeft = ({ className = 'mr-1', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 10'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M13 5H1m0 0 4 4M1 5l4-4' />
	</svg>
);

const Email = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={` ${className} `} fill='currentColor' aria-hidden='true' style={{ height: fontSize, width: fontSize }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 16'>
		<path d='m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z' />
		<path d='M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z' />
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

const Question2 = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 40 40">
		<g id="Group_17058" data-name="Group 17058">
			<g id="Group_17057" data-name="Group 17057">
				<path id="Path_28738" data-name="Path 28738" d="M20,0A20,20,0,1,0,40,20,19.989,19.989,0,0,0,20,0Zm0,37.209A17.209,17.209,0,1,1,37.209,20,17.229,17.229,0,0,1,20,37.209Z" />
			</g>
		</g>
		<g id="Group_17060" data-name="Group 17060" transform="translate(17.456 25.378)">
			<g id="Group_17059" data-name="Group 17059">
				<path id="Path_28739" data-name="Path 28739" d="M224.766,323.924a1.977,1.977,0,0,0,0,3.953,1.976,1.976,0,0,0,0-3.953Z" transform="translate(-222.815 -323.924)" />
			</g>
		</g>
		<g id="Group_17062" data-name="Group 17062" transform="translate(14.699 10.086)">
			<g id="Group_17061" data-name="Group 17061">
				<path id="Path_28740" data-name="Path 28740" d="M191.478,127.469c-3.465,0-5.057,2.054-5.057,3.44a1.472,1.472,0,0,0,1.54,1.463c1.386,0,.821-1.977,3.44-1.977,1.283,0,2.31.565,2.31,1.745,0,1.386-1.437,2.182-2.284,2.9a4.7,4.7,0,0,0-1.72,3.9c0,1.335.359,1.72,1.412,1.72,1.258,0,1.514-.565,1.514-1.052a3.223,3.223,0,0,1,1.437-3.208c.693-.539,2.875-2.284,2.875-4.7S194.763,127.469,191.478,127.469Z" transform="translate(-186.421 -127.469)" />
			</g>
		</g>
	</svg>
);

const Child = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M24,11.5a3.5,3.5,0,0,0-2.149-3.226,10,10,0,0,0-19.7,0,3.5,3.5,0,0,0,1.119,6.718,10.607,10.607,0,0,0,2.071,2.955,8.908,8.908,0,0,0-2.272,4.928,1,1,0,0,0,.868,1.117A1.093,1.093,0,0,0,4.061,24a1,1,0,0,0,.991-.875,6.924,6.924,0,0,1,1.815-3.872A8.948,8.948,0,0,0,12,21a8.94,8.94,0,0,0,5.119-1.74,6.922,6.922,0,0,1,1.808,3.862,1,1,0,0,0,.991.876,1.063,1.063,0,0,0,.125-.008,1,1,0,0,0,.868-1.116,8.9,8.9,0,0,0-2.261-4.918,10.622,10.622,0,0,0,2.082-2.966A3.5,3.5,0,0,0,24,11.5Zm-3.752,1.473a.993.993,0,0,0-1.117.651C18.215,16.222,15.13,19,12,19s-6.215-2.78-7.131-5.378a.994.994,0,0,0-1.117-.651A1.606,1.606,0,0,1,3.5,13a1.5,1.5,0,0,1-.27-2.972,1,1,0,0,0,.816-.878A7.961,7.961,0,0,1,8.13,3a4.075,4.075,0,0,0-.022,1.942,4,4,0,0,0,7.688.318A.977.977,0,0,0,14.851,4H14.7a.867.867,0,0,0-.806.631A2,2,0,1,1,12,2a7.978,7.978,0,0,1,7.954,7.15,1,1,0,0,0,.816.878A1.5,1.5,0,0,1,20.5,13,1.606,1.606,0,0,1,20.248,12.973Z' />
		<circle cx='9.5' cy='11.5' r='1.5' />
		<circle cx='14.5' cy='11.5' r='1.5' />
	</svg>
);

const Save = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
		<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
	</svg>
);

const Cancel = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<circle cx='12' cy='12' r='10' /> <line x1='15' y1='9' x2='9' y2='15' /> <line x1='9' y1='9' x2='15' y2='15' />
	</svg>
);
const Reset = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`mr-2 ${className}`} style={{ height: fontSize, width: fontSize }} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		{' '}
		<polyline points='1 4 1 10 7 10' /> <polyline points='23 20 23 14 17 14' /> <path d='M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' />
	</svg>
);

const AnnouncementIco = ({ className = '', fontSize = '20px' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} height={20} width={20} fill='currentColor' viewBox='100 0 576 512' xmlns='http://www.w3.org/2000/svg' stroke='currentColor'>
		<path d='M576 240c0-23.63-12.95-44.04-32-55.12V32.01C544 23.26 537.02 0 512 0c-7.12 0-14.19 2.38-19.98 7.02l-85.03 68.03C364.28 109.19 310.66 128 256 128H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h33.7c-1.39 10.48-2.18 21.14-2.18 32 0 39.77 9.26 77.35 25.56 110.94 5.19 10.69 16.52 17.06 28.4 17.06h74.28c26.05 0 41.69-29.84 25.9-50.56-16.4-21.52-26.15-48.36-26.15-77.44 0-11.11 1.62-21.79 4.41-32H256c54.66 0 108.28 18.81 150.98 52.95l85.03 68.03a32.023 32.023 0 0 0 19.98 7.02c24.92 0 32-22.78 32-32V295.13C563.05 284.04 576 263.63 576 240zm-96 141.42l-33.05-26.44C392.95 311.78 325.12 288 256 288v-96c69.12 0 136.95-23.78 190.95-66.98L480 98.58v282.84z' />
	</svg>
);

const BannerIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='M19.5,0H4.5A4.505,4.505,0,0,0,0,4.5v15A4.505,4.505,0,0,0,4.5,24h15A4.505,4.505,0,0,0,24,19.5V4.5A4.505,4.505,0,0,0,19.5,0ZM4.5,3h15A1.5,1.5,0,0,1,21,4.5v15a1.492,1.492,0,0,1-.44,1.06l-8.732-8.732a4,4,0,0,0-5.656,0L3,15V4.5A1.5,1.5,0,0,1,4.5,3Z' />
	</svg>
);
const Category = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M7,6H23a1,1,0,0,0,0-2H7A1,1,0,0,0,7,6Z' />
		<path d='M23,11H7a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z' />
		<path d='M23,18H7a1,1,0,0,0,0,2H23a1,1,0,0,0,0-2Z' />
		<circle cx='2' cy='5' r='2' />
		<circle cx='2' cy='12' r='2' />
		<circle cx='2' cy='19' r='2' />
	</svg>
);
const SuggestionIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path d='M24,16v5a3,3,0,0,1-3,3H16a8,8,0,0,1-6.92-4,10.968,10.968,0,0,0,2.242-.248A5.988,5.988,0,0,0,16,22h5a1,1,0,0,0,1-1V16a5.988,5.988,0,0,0-2.252-4.678A10.968,10.968,0,0,0,20,9.08,8,8,0,0,1,24,16ZM17.977,9.651A9,9,0,0,0,8.349.023,9.418,9.418,0,0,0,0,9.294v5.04C0,16.866,1.507,18,3,18H8.7A9.419,9.419,0,0,0,17.977,9.651Zm-4.027-5.6a7.018,7.018,0,0,1,2.032,5.46A7.364,7.364,0,0,1,8.7,16H3c-.928,0-1-1.275-1-1.666V9.294A7.362,7.362,0,0,1,8.49,2.018Q8.739,2,8.988,2A7.012,7.012,0,0,1,13.95,4.051Z' />
	</svg>
);
const GetAscIcon = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-8 h-8'>
			<path strokeLinecap='round' strokeLinejoin='round' d='M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
		</svg>
	);
};
const GetDescIcon = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-8 h-8'>
			<path strokeLinecap='round' strokeLinejoin='round' d='M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
		</svg>
	);
};
const GetDefaultIcon = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' className={`w-3 h-3 ml-1 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox='0 0 320 512'>
			<path d='M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z' />
		</svg>
	);
};
const ManageRulesSetsIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,3a8.947,8.947,0,0,1,5.207,1.672L4.672,17.206A8.986,8.986,0,0,1,12,3Zm0,18a8.942,8.942,0,0,1-5.206-1.672L19.328,6.793A8.986,8.986,0,0,1,12,21Z' />
	</svg>
);

const TreeViewIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='m14.831,12l8.144,4.987-1.566,2.559-7.95-4.868v9.323h-3v-9.323l-7.95,4.868-1.566-2.559,8.144-4.987L.942,7.013l1.566-2.559,7.95,4.868V0h3v9.323l7.95-4.868,1.566,2.559-8.144,4.987Z' />
	</svg>
);

const Gift = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
			<path d='M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z' />
		</svg>
	);
};
const Alerts = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<path id="Union_9" data-name="Union 9" d="M-242.094,32.341A2.908,2.908,0,0,1-245,29.435a2.906,2.906,0,0,1,.372-1.423l6.888-12.524A2.915,2.915,0,0,1-235.2,14a2.912,2.912,0,0,1,2.534,1.482l6.894,12.534a2.9,2.9,0,0,1,.369,1.418,2.908,2.908,0,0,1-2.906,2.906Zm5.327-16.312-6.888,12.524a1.8,1.8,0,0,0-.232.882,1.794,1.794,0,0,0,1.792,1.792h13.782a1.794,1.794,0,0,0,1.792-1.792,1.794,1.794,0,0,0-.229-.877l-6.893-12.534a1.8,1.8,0,0,0-1.562-.91A1.8,1.8,0,0,0-236.767,16.029Zm.781,11.839a.783.783,0,0,1,.783-.783.783.783,0,0,1,.783.783.783.783,0,0,1-.783.784A.783.783,0,0,1-235.986,27.868Zm.226-3.131v-4.7a.557.557,0,0,1,.557-.557.557.557,0,0,1,.557.557v4.7a.557.557,0,0,1-.557.556A.557.557,0,0,1-235.761,24.737Z" transform="translate(584.146 2691.975)" />
			</g>
		</svg>
	);
};
const Dashboard = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<g id="Iconly_Light_Category" data-name="Iconly Light Category" transform="translate(-182.632 1703.795)">
					<g id="Category-4">
						<path id="Stroke_1-12" data-name="Stroke 1-12" d="M526.278,1001.851c1.924,0,2.889.267,3.441.952s.559,1.681.559,3.048v.024c0,1.363,0,2.348-.548,3.029s-1.517.947-3.452.947-2.9-.266-3.452-.947-.548-1.665-.548-3.029v-.024c0-1.367,0-2.355.559-3.048S524.354,1001.851,526.278,1001.851Zm0,7c1.549,0,2.349-.172,2.673-.574s.327-1.2.327-2.4v-.024a4.444,4.444,0,0,0-.337-2.421c-.328-.406-1.124-.579-2.663-.579s-2.335.173-2.663.579a4.444,4.444,0,0,0-.337,2.421v.024c0,1.2,0,2,.327,2.4S524.729,1008.851,526.278,1008.851Z" />
						<path id="Stroke_3-6" data-name="Stroke 3-6" d="M537.278,1001.851c1.924,0,2.889.267,3.441.952s.559,1.681.559,3.048v.024c0,1.363,0,2.348-.548,3.029s-1.517.947-3.452.947-2.9-.266-3.452-.947-.548-1.665-.548-3.029v-.024c0-1.367,0-2.355.559-3.048S535.354,1001.851,537.278,1001.851Zm0,7c1.549,0,2.349-.172,2.673-.574s.327-1.2.327-2.4v-.024a4.444,4.444,0,0,0-.337-2.421c-.328-.406-1.124-.579-2.663-.579s-2.335.173-2.663.579a4.444,4.444,0,0,0-.337,2.421v.024c0,1.2,0,2,.327,2.4S535.729,1008.851,537.278,1008.851Z" />
						<path id="Stroke_5-2" data-name="Stroke 5-2" d="M526.278,1012.851c1.924,0,2.889.267,3.441.952s.559,1.681.559,3.048v.024c0,1.363,0,2.348-.548,3.029s-1.517.947-3.452.947-2.9-.266-3.452-.947-.548-1.665-.548-3.029v-.024c0-1.367,0-2.355.559-3.048S524.354,1012.851,526.278,1012.851Zm0,7c1.549,0,2.349-.172,2.673-.574s.327-1.2.327-2.4v-.024a4.444,4.444,0,0,0-.337-2.421c-.328-.406-1.124-.579-2.663-.579s-2.335.173-2.663.579a4.444,4.444,0,0,0-.337,2.421v.024c0,1.2,0,2,.327,2.4S524.729,1019.851,526.278,1019.851Z" />
						<path id="Stroke_7-2" data-name="Stroke 7-2" d="M537.278,1012.851c1.924,0,2.889.267,3.441.952s.559,1.681.559,3.048v.024c0,1.363,0,2.348-.548,3.029s-1.517.947-3.452.947-2.9-.266-3.452-.947-.548-1.665-.548-3.029v-.024c0-1.367,0-2.355.559-3.048S535.354,1012.851,537.278,1012.851Zm0,7c1.549,0,2.349-.172,2.673-.574s.327-1.2.327-2.4v-.024a4.444,4.444,0,0,0-.337-2.421c-.328-.406-1.124-.579-2.663-.579s-2.335.173-2.663.579a4.444,4.444,0,0,0-.337,2.421v.024c0,1.2,0,2,.327,2.4S535.729,1019.851,537.278,1019.851Z" />
					</g>
				</g>
			</g>
		</svg>
	);
};
const Reports = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" viewBox="0 0 25 25">
			<g id="Menuicon" transform="translate(-338.65 -2704.65)">
				<rect id="Rectangle_335" data-name="Rectangle 335" width="25" height="25" transform="translate(338.65 2704.65)" fill="none" opacity="0.5" />
				<g id="Reports-01" transform="translate(341.156 2705.136)">
					<g id="Group_12264" data-name="Group 12264" transform="translate(0)">
						<path id="Path_20798" data-name="Path 20798" d="M19.464,0H4.282A2.626,2.626,0,0,0,1.65,2.62V21.854a2.628,2.628,0,0,0,2.632,2.632H19.464a2.626,2.626,0,0,0,2.632-2.62V2.62A2.626,2.626,0,0,0,19.464,0Zm1.42,21.866a1.427,1.427,0,0,1-1.42,1.408H4.282a1.427,1.427,0,0,1-1.42-1.408V2.62a1.427,1.427,0,0,1,1.42-1.408H19.464a1.427,1.427,0,0,1,1.42,1.408V21.866Z" transform="translate(-1.65)" fill="#a9acae" />
					</g>
					<g id="Group_12265" data-name="Group 12265" transform="translate(14.153 11.117)">
						<path id="Path_20799" data-name="Path 20799" d="M16.467,9.692a.614.614,0,0,1-.612.612H13.822a.606.606,0,0,1-.612-.612.614.614,0,0,1,.612-.612h2.032A.639.639,0,0,1,16.467,9.692Z" transform="translate(-13.21 -9.08)" fill="#a9acae" />
					</g>
					<g id="Group_12266" data-name="Group 12266" transform="translate(14.153 8.081)">
						<path id="Path_20800" data-name="Path 20800" d="M16.467,7.212a.614.614,0,0,1-.612.612H13.822a.606.606,0,0,1-.612-.612.614.614,0,0,1,.612-.612h2.032A.639.639,0,0,1,16.467,7.212Z" transform="translate(-13.21 -6.6)" fill="#a9acae" />
					</g>
					<g id="Group_12267" data-name="Group 12267" transform="translate(14.153 14.153)">
						<path id="Path_20801" data-name="Path 20801" d="M16.467,12.172a.614.614,0,0,1-.612.612H13.822a.606.606,0,0,1-.612-.612.614.614,0,0,1,.612-.612h2.032A.639.639,0,0,1,16.467,12.172Z" transform="translate(-13.21 -11.56)" fill="#a9acae" />
					</g>
					<g id="Group_12268" data-name="Group 12268" transform="translate(14.153 17.19)">
						<path id="Path_20802" data-name="Path 20802" d="M16.467,14.652a.614.614,0,0,1-.612.612H13.822a.606.606,0,0,1-.612-.612.614.614,0,0,1,.612-.612h2.032A.639.639,0,0,1,16.467,14.652Z" transform="translate(-13.21 -14.04)" fill="#a9acae" />
					</g>
					<g id="Group_12269" data-name="Group 12269" transform="translate(3.024 20.226)">
						<path id="Path_20803" data-name="Path 20803" d="M18.506,17.132a.614.614,0,0,1-.612.612H4.732a.614.614,0,0,1-.612-.612.622.622,0,0,1,.612-.612H17.894A.639.639,0,0,1,18.506,17.132Z" transform="translate(-4.12 -16.52)" fill="#a9acae" />
					</g>
					<g id="Group_12270" data-name="Group 12270" transform="translate(3.024 8.093)">
						<path id="Path_20804" data-name="Path 20804" d="M9.287,6.61a5.168,5.168,0,0,0-3.648,8.827c.024.024.061.049.086.073a5.164,5.164,0,1,0,3.563-8.9ZM5.344,11.764A3.909,3.909,0,0,1,8.687,7.883v3.648L6.116,14.1A3.91,3.91,0,0,1,5.344,11.764Zm3.942,3.955a3.909,3.909,0,0,1-2.314-.759l2.755-2.755a.641.641,0,0,0,.171-.441V7.883a3.941,3.941,0,0,1-.612,7.836Z" transform="translate(-4.12 -6.61)" fill="#a9acae" />
					</g>
				</g>
			</g>
		</svg>
	);
};
const EducationEngagement = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<g id="Education_and_Engagement-01" data-name="Education and Engagement-01" transform="translate(339.067 2705.056)">
					<path id="Path_20792" data-name="Path 20792" d="M19.78,13.78,18.2,12.21V6.81l1.07-.38a.509.509,0,0,0,.33-.48.5.5,0,0,0-.33-.48L10.01,2.12a.525.525,0,0,0-.35,0L.41,5.47a.5.5,0,0,0-.33.48.5.5,0,0,0,.33.48L3.87,7.71v3.91a.529.529,0,0,0,.09.3,3.559,3.559,0,0,0,1.29.97,9.891,9.891,0,0,0,4.46.87,10.163,10.163,0,0,0,4.5-.87,3.6,3.6,0,0,0,1.3-.97.514.514,0,0,0,.1-.3V7.75l.05-.02,1.52-.55v5.03l-1.57,1.57a.533.533,0,0,0-.15.36.475.475,0,0,0,.15.36l1.57,1.57V17.4a.51.51,0,1,0,1.02,0V16.07l.03-.02,1.55-1.55a.506.506,0,0,0,.14-.36A.524.524,0,0,0,19.78,13.78Zm-5.2-2.36-.02.03c-.98.88-2.89,1.28-4.78,1.28-2.03,0-4.05-.46-4.86-1.28l-.03-.02V8.09L9.54,9.81a.1.1,0,0,1,.04.01.457.457,0,0,0,.31-.01l4.69-1.69ZM9.72,8.79l-.03-.01L2.07,5.95l.19-.07L9.84,3.14l.02.01,7.73,2.8Zm7.97,6.35-.05-.06-.95-.94.06-.05.94-.95,1,1Z" />
				</g>
			</g>
		</svg>

	);
}
const RecyclingWasteManagement = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<g id="Group_12263" data-name="Group 12263" transform="translate(339.145 2705.151)">
					<g id="Group_12262" data-name="Group 12262">
						<g id="Group_12259" data-name="Group 12259">
							<path id="Path_20795" data-name="Path 20795" d="M8.81,13.47l-4.18-.01.95-1.97.71.32a.412.412,0,0,0,.49-.1.44.44,0,0,0,.07-.5L5,7.82a.45.45,0,0,0-.47-.22L.74,8.41a.425.425,0,0,0-.34.38.438.438,0,0,0,.25.44l.52.23L.13,11.43a1.14,1.14,0,0,0,.02,1.09l3.27,5.64a1.113,1.113,0,0,0,.97.56H8.81a.427.427,0,0,0,.43-.43V13.9A.427.427,0,0,0,8.81,13.47Zm-5.67,1.1a3.1,3.1,0,0,0-.29.89L.9,12.09a.268.268,0,0,1-.01-.26L2.14,9.46a.492.492,0,0,0,.03-.34A.746.746,0,0,0,2.1,9l2.3-.49L5.48,10.5a.431.431,0,0,0-.49.23Zm5.24,3.29H4.39a.265.265,0,0,1-.23-.13l-.15-.26a2.7,2.7,0,0,1-.09-2.53l.29-.62,4.17.01Z" />
						</g>
						<g id="Group_12260" data-name="Group 12260">
							<path id="Path_20796" data-name="Path 20796" d="M19.85,10.83,17.64,7a.431.431,0,0,0-.59-.16l-3.81,2.2a.425.425,0,0,0-.15.58l2.08,3.63-2.19.17-.07-.78a.431.431,0,0,0-.8-.18l-2.01,3.3a.422.422,0,0,0,.05.51l2.6,2.88a.416.416,0,0,0,.32.14.381.381,0,0,0,.17-.04.417.417,0,0,0,.25-.43l-.05-.57,2.22-.09a1.09,1.09,0,0,0,.93-.56l3.26-5.65A1.12,1.12,0,0,0,19.85,10.83Zm-4,6.34a.261.261,0,0,1-.22.13l-2.68.11a.4.4,0,0,0-.3.15.284.284,0,0,0-.08.11L11,15.93,12.18,14a.453.453,0,0,0,.45.31l4.24-.32a3.5,3.5,0,0,0,.92-.19Zm3.25-5.65-.14.26a2.7,2.7,0,0,1-2.15,1.35l-.68.05L14.05,9.57,17.11,7.8l1.99,3.46A.244.244,0,0,1,19.1,11.52Z" />
						</g>
						<g id="Group_12261" data-name="Group 12261">
							<path id="Path_20797" data-name="Path 20797" d="M15.88,2.77a.42.42,0,0,0-.5,0l-.47.33L13.73,1.22A1.123,1.123,0,0,0,12.78.7H6.25a1.134,1.134,0,0,0-.97.56L3.07,5.09a.424.424,0,0,0-.04.33.407.407,0,0,0,.2.26l3.8,2.2a.425.425,0,0,0,.59-.16L9.72,4.1l1.23,1.82-.63.45a.413.413,0,0,0-.16.47.429.429,0,0,0,.4.31l3.86.09a.456.456,0,0,0,.42-.29l1.2-3.7A.453.453,0,0,0,15.88,2.77ZM7.09,6.92,4.03,5.15l2-3.46a.248.248,0,0,1,.22-.13h.3A2.713,2.713,0,0,1,8.8,2.75l.38.56Zm7.03-.54-2.26-.06a.424.424,0,0,0,.04-.54L9.51,2.26a3.8,3.8,0,0,0-.63-.7h3.9a.251.251,0,0,1,.22.12l1.43,2.27a.4.4,0,0,0,.28.19.285.285,0,0,0,.13,0Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
}
const EquipmentMaintenance = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<g id="Equipement_Management-01" data-name="Equipement Management-01" transform="translate(339.146 2705.146)">
					<path id="Path_20793" data-name="Path 20793" d="M12.17,20H7.83l-.11-1.78a8.218,8.218,0,0,1-1.91-.8L4.47,18.61,1.4,15.54,2.59,14.2a8.37,8.37,0,0,1-.79-1.91L0,12.17V7.83l1.78-.11a8.958,8.958,0,0,1,.8-1.92L1.39,4.47,4.46,1.4,5.8,2.58a8.445,8.445,0,0,1,1.92-.79L7.83,0h4.35l.11,1.78a8.643,8.643,0,0,1,1.91.79l1.34-1.19,3.07,3.07L17.42,5.8a9.1,9.1,0,0,1,.8,1.91L20,7.83v4.35l-1.78.11a8.218,8.218,0,0,1-.8,1.91l1.19,1.34-3.07,3.07L14.2,17.42a8.879,8.879,0,0,1-1.91.8Zm-3.45-.95h2.55l.1-1.59.35-.08A7.5,7.5,0,0,0,14,16.43l.3-.19,1.2,1.06,1.8-1.8-1.06-1.19.19-.3a7.6,7.6,0,0,0,.95-2.28l.08-.35,1.59-.1V8.72l-1.59-.1-.08-.35A7.656,7.656,0,0,0,16.43,6l-.19-.3L17.3,4.5,15.5,2.7,14.3,3.76,14,3.57a7.6,7.6,0,0,0-2.28-.95l-.35-.08L11.27.95H8.72l-.1,1.59-.34.08A7.6,7.6,0,0,0,6,3.57l-.3.19L4.5,2.7,2.7,4.5,3.76,5.7,3.57,6a7.6,7.6,0,0,0-.95,2.28l-.08.35-1.59.1v2.55l1.59.1.08.35A7.548,7.548,0,0,0,3.57,14l.19.3L2.7,15.5l1.8,1.8,1.19-1.06.31.19a7.6,7.6,0,0,0,2.28.95l.35.08ZM10,16.24A6.24,6.24,0,1,1,16.24,10,6.248,6.248,0,0,1,10,16.24ZM10,4.71A5.29,5.29,0,1,0,15.29,10,5.292,5.292,0,0,0,10,4.71Z" />
					<path id="Path_20794" data-name="Path 20794" d="M11.61,15.67h-.95V14.09a1.459,1.459,0,0,1,.82-1.37,2.921,2.921,0,0,0,.14-4.96v2.73l-1.62.8-1.61-.8V7.76a2.715,2.715,0,0,0-.64.58l-.27.38a2.924,2.924,0,0,0,1.03,3.99,1.5,1.5,0,0,1,.84,1.38v1.58H8.39V14.09a.527.527,0,0,0-.35-.55A3.887,3.887,0,0,1,6.68,8.2l.31-.44A3.981,3.981,0,0,1,8.71,6.54l.63-.22V9.9l.66.33.65-.33V6.32l.64.22a3.875,3.875,0,0,1,.69,6.98.561.561,0,0,0-.37.57Z" />
				</g>
			</g>
		</svg>
	);
}
const CustomerService = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<g id="Customer_Service-01" data-name="Customer Service-01" transform="translate(339.146 2705.146)">
					<g id="Group_12254" data-name="Group 12254">
						<g id="Group_12253" data-name="Group 12253">
							<path id="Path_20787" data-name="Path 20787" d="M16.92,6.71a6.923,6.923,0,0,0-13.84,0A2.243,2.243,0,0,0,1.23,9.1v3.49A2.328,2.328,0,0,0,3.7,15.06H4.77a.606.606,0,0,0,.61-.61V7.27a.606.606,0,0,0-.61-.61H4.31a5.7,5.7,0,0,1,11.38-.01h-.46a.606.606,0,0,0-.61.61v7.17a.612.612,0,0,0,.61.61h.45c-.17,2.13-1.21,2.62-3.27,2.75a1,1,0,0,0-.99-.99H9.08a1,1,0,0,0-.99.99V19a1.007,1.007,0,0,0,.99,1h2.34a.988.988,0,0,0,.99-.97c2.12-.13,4.29-.62,4.5-4.04a2.246,2.246,0,0,0,1.86-2.4V9.11A2.239,2.239,0,0,0,16.92,6.71ZM4.16,13.82H3.68a1.1,1.1,0,0,1-1.24-1.24V9.09A1.1,1.1,0,0,1,3.68,7.85h.48Zm5.17,4.95v-.71h1.85v.71Zm8.21-6.17a1.1,1.1,0,0,1-1.24,1.24h-.46V7.88h.48a1.1,1.1,0,0,1,1.24,1.24Z" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
}
const MyAccount = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<path id="My_Account-01" data-name="My Account-01" d="M17.07,2.93A10,10,0,1,0,2.93,17.07,10,10,0,1,0,17.07,2.93ZM4.34,16.77A5.716,5.716,0,0,1,10,11.74a5.7,5.7,0,0,1,5.66,5.04,8.789,8.789,0,0,1-11.32-.01ZM10,10.53a3.04,3.04,0,1,1,3.04-3.04A3.045,3.045,0,0,1,10,10.53Zm6.67,5.25a6.9,6.9,0,0,0-4.31-4.8,4.21,4.21,0,1,0-4.72,0,6.87,6.87,0,0,0-4.31,4.79,8.826,8.826,0,1,1,13.34.01Z" transform="translate(339.146 2705.146)" />
			</g>
		</svg>
	);
}
const Management = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 21.645 20">
			<g id="Menuicon" transform="translate(-339.146 -2705.146)">
				<rect id="Rectangle_335" data-name="Rectangle 335" transform="translate(339.146 2705.146)" opacity="0.5" />
				<g id="data-management" transform="translate(1415.654 3510.905)">
					<path id="Path_20805" data-name="Path 20805" d="M-1067.066-805.759a11.351,11.351,0,0,0-4.555.859,4.571,4.571,0,0,0-1.482,1,2.123,2.123,0,0,0-.624,1.438l0,4.417c0,.015,0,.03,0,.045,0,.053,0,.107,0,.156l.009,4.234a.539.539,0,0,0-.013.08,1.669,1.669,0,0,0,.013.214l0,4.47a.531.531,0,0,0,.009.089c.174,1.015,1.086,1.728,2.266,2.222a11.691,11.691,0,0,0,4.377.775,9.086,9.086,0,0,0,5.788-1.616c.1,0,.2.009.307.009a6.012,6.012,0,0,0,1.06-.094.534.534,0,0,0,.41-.347l.285-.8c.151-.053.3-.116.445-.182l.766.365a.534.534,0,0,0,.539-.045,6.105,6.105,0,0,0,1.491-1.5.534.534,0,0,0,.045-.534l-.365-.77c.071-.143.129-.294.187-.441l.8-.285a.535.535,0,0,0,.347-.41,6.491,6.491,0,0,0,.089-1.06,6.4,6.4,0,0,0-.089-1.055.534.534,0,0,0-.347-.414l-.8-.285c-.053-.147-.116-.3-.182-.441l.365-.77a.535.535,0,0,0-.045-.534,6.2,6.2,0,0,0-1.5-1.5.534.534,0,0,0-.539-.044l-.766.365c-.147-.067-.294-.129-.445-.183l-.285-.8a.534.534,0,0,0-.41-.347,4.726,4.726,0,0,0-.5-.067c0-1.006.009-1.99.013-2.921a2.119,2.119,0,0,0-.628-1.443,4.593,4.593,0,0,0-1.483-1A11.354,11.354,0,0,0-1067.066-805.759Zm0,1.068a10.419,10.419,0,0,1,4.123.761,3.739,3.739,0,0,1,1.144.757,1.038,1.038,0,0,1,.338.712,1.038,1.038,0,0,1-.338.712,3.74,3.74,0,0,1-1.144.757,10.346,10.346,0,0,1-4.123.757,10.369,10.369,0,0,1-4.114-.761,3.738,3.738,0,0,1-1.144-.757,1.032,1.032,0,0,1-.334-.708,1.032,1.032,0,0,1,.334-.708,3.584,3.584,0,0,1,1.144-.757,10.442,10.442,0,0,1,4.114-.766Zm-5.588,4.07a5.478,5.478,0,0,0,1.033.6,11.355,11.355,0,0,0,4.555.855,11.28,11.28,0,0,0,4.564-.855,5.477,5.477,0,0,0,1.033-.6c0,.356,0,.7,0,1.073a4.646,4.646,0,0,0-.543.071.534.534,0,0,0-.41.347l-.285.8c-.151.058-.3.116-.445.187l-.766-.365a.534.534,0,0,0-.539.044,6.1,6.1,0,0,0-1.492,1.5.535.535,0,0,0-.045.534l.294.619a.538.538,0,0,0-.142-.009c-.387.036-.8.053-1.22.053a10.363,10.363,0,0,1-4.114-.766,3.658,3.658,0,0,1-1.144-.752,1.14,1.14,0,0,1-.329-.61Zm11.688,2.124h0a4.98,4.98,0,0,1,.574.036l.258.73a.534.534,0,0,0,.352.334,4.231,4.231,0,0,1,.761.316.534.534,0,0,0,.485.013l.7-.334a5.106,5.106,0,0,1,.806.806l-.334.7a.534.534,0,0,0,.013.481,3.956,3.956,0,0,1,.316.766.535.535,0,0,0,.334.352l.73.258a4.818,4.818,0,0,1,.036.57,4.818,4.818,0,0,1-.036.57l-.73.263a.535.535,0,0,0-.334.347,4.218,4.218,0,0,1-.316.761.535.535,0,0,0-.013.485l.334.7a4.95,4.95,0,0,1-.806.81l-.7-.334a.534.534,0,0,0-.481.009,4.055,4.055,0,0,1-.761.32.534.534,0,0,0-.352.329l-.258.73a4.991,4.991,0,0,1-.574.04c-.187,0-.378-.018-.57-.036l-.258-.735a.534.534,0,0,0-.352-.329,4.062,4.062,0,0,1-.761-.321.534.534,0,0,0-.481-.009l-.7.334a5.116,5.116,0,0,1-.806-.806l.334-.7a.534.534,0,0,0-.013-.481,4.262,4.262,0,0,1-.316-.766.534.534,0,0,0-.334-.352l-.73-.258a4.905,4.905,0,0,1-.036-.57,4.844,4.844,0,0,1,.036-.57l.73-.258a.534.534,0,0,0,.334-.352,3.971,3.971,0,0,1,.316-.766.534.534,0,0,0,.013-.481l-.334-.7a4.939,4.939,0,0,1,.806-.806l.7.334a.534.534,0,0,0,.485-.013,4.137,4.137,0,0,1,.766-.316.534.534,0,0,0,.347-.334l.263-.73A4.752,4.752,0,0,1-1060.966-798.5Zm-11.683,2.346a5.416,5.416,0,0,0,1.028.592,11.368,11.368,0,0,0,4.555.859h.165a.535.535,0,0,0-.067.178,5.965,5.965,0,0,0-.089,1.055,6,6,0,0,0,.089,1.055.535.535,0,0,0,.347.414l.8.285c.049.138.107.271.169.405a.534.534,0,0,0-.249-.045c-.374.036-.761.053-1.167.053a10.379,10.379,0,0,1-4.114-.766,3.66,3.66,0,0,1-1.144-.757,1.118,1.118,0,0,1-.321-.57Zm0,4.47a5.512,5.512,0,0,0,1.024.592,11.352,11.352,0,0,0,4.555.859c.347,0,.69-.013,1.024-.036a.533.533,0,0,0,.089.3,6.045,6.045,0,0,0,1.5,1.5.534.534,0,0,0,.534.045l.766-.365c.147.067.294.129.445.183l.267.752a9.779,9.779,0,0,1-4.613,1.029,10.641,10.641,0,0,1-3.963-.695c-.993-.414-1.532-.962-1.621-1.389Z" transform="translate(0 0)" />
					<path id="Path_20806" data-name="Path 20806" d="M-1014.272-752.573a3.469,3.469,0,0,0-3.461,3.461,3.468,3.468,0,0,0,3.461,3.456,3.468,3.468,0,0,0,3.461-3.456A3.469,3.469,0,0,0-1014.272-752.573Zm0,1.1a2.351,2.351,0,0,1,2.358,2.358,2.35,2.35,0,0,1-2.358,2.353,2.347,2.347,0,0,1-2.358-2.353A2.348,2.348,0,0,1-1014.272-751.47Z" transform="translate(-46.892 -44.395)" />
				</g>
			</g>
		</svg>
	);
}
const CompaniesDirectory = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20.569 19.998">
			<path id="Path_29041" data-name="Path 29041" d="M25,23.855H22.713v-16a.571.571,0,0,0-.571-.571H20.427V5.571A.571.571,0,0,0,19.856,5H10.714a.571.571,0,0,0-.571.571V7.285H8.428a.571.571,0,0,0-.571.571v16H5.571a.571.571,0,0,0,0,1.143H25a.571.571,0,1,0,0-1.143ZM11.285,6.143h8V7.285h-8Zm1.143,17.713V20.427h2.285v3.428Zm3.428,0V20.427h2.285v3.428Zm3.428,0v-4a.571.571,0,0,0-.571-.571H11.856a.571.571,0,0,0-.571.571v4H9V8.428H21.57V23.855Zm1.143-13.142a.571.571,0,0,1-.571.571H17.57a.571.571,0,1,1,0-1.143h2.285A.571.571,0,0,1,20.427,10.714Zm-6.856,0a.571.571,0,0,1-.571.571H10.714a.571.571,0,0,1,0-1.143H13A.571.571,0,0,1,13.571,10.714Zm6.856,2.857a.571.571,0,0,1-.571.571H17.57a.571.571,0,1,1,0-1.143h2.285A.571.571,0,0,1,20.427,13.571Zm-6.856,0a.571.571,0,0,1-.571.571H10.714a.571.571,0,1,1,0-1.143H13A.571.571,0,0,1,13.571,13.571Zm6.856,2.857a.571.571,0,0,1-.571.571H17.57a.571.571,0,1,1,0-1.143h2.285A.571.571,0,0,1,20.427,16.427Zm-6.856,0A.571.571,0,0,1,13,17H10.714a.571.571,0,0,1,0-1.143H13A.571.571,0,0,1,13.571,16.427Z" transform="translate(-5 -5)" fill="#a9acae" />
		</svg>
	);
}
const Logout = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 20.001 20">
			<path id="noun-logout-4432782" d="M124.929,45.307a.536.536,0,0,1-.064.107v.036L120.8,50.529a.715.715,0,0,1-.557.272.765.765,0,0,1-.45-.157.714.714,0,0,1-.107-1.007l3.114-3.921H111.072a.714.714,0,1,1,0-1.429H122.8l-3.136-3.921a.714.714,0,1,1,1.114-.893l4.064,5.086h0a.235.235,0,0,1,.043.071.248.248,0,0,1,.036.057.711.711,0,0,1,.071.236.872.872,0,0,1,0,.236v.064s-.05.064-.064.086ZM115,53.571h-8.571V36.429H115A.714.714,0,1,0,115,35h-9.286a.714.714,0,0,0-.714.714V54.286a.714.714,0,0,0,.714.714H115a.714.714,0,1,0,0-1.429Z" transform="translate(-105 -35)" />
		</svg>
	);
}
const Fileimage = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={`w-6 h-6 text-gray-800 fill-white ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 20'>
			<path fill='currentColor' d='M11.045 7.514a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-4.572 3.072L3.857 15.92h7.949l-1.811-3.37-1.61 2.716-1.912-4.679Z' />
			<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 1v4a1 1 0 0 1-1 1H1m14 12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2v16ZM11.045 7.514a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM3.857 15.92l2.616-5.333 1.912 4.68 1.61-2.717 1.81 3.37H3.858Z' />
		</svg>
	);
};
const CheckCircle = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg className={` text-white ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'>
			<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='m7 10 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
		</svg>
	);
};
const PlayIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='M9,17.879V6.707A1,1,0,0,1,10.707,6l5.586,5.586a1,1,0,0,1,0,1.414l-5.586,5.586A1,1,0,0,1,9,17.879Z' />
	</svg>
);

const PlayIcon2 = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path id="play-button_1_" data-name="play-button (1)" d="M23.709,35a1.937,1.937,0,0,1-.951-.25,2,2,0,0,1-1.009-1.741V19.991a2,2,0,0,1,1.009-1.741,1.929,1.929,0,0,1,1.989.053L35,24.811a2.008,2.008,0,0,1,0,3.377L24.748,34.7A1.935,1.935,0,0,1,23.709,35Zm0-15.622a.59.59,0,0,0-.291.077.615.615,0,0,0-.312.536V33.008a.614.614,0,0,0,.311.536.6.6,0,0,0,.612-.016l10.247-6.509a.618.618,0,0,0,0-1.04L24.029,19.471A.6.6,0,0,0,23.709,19.378Z" transform="translate(-21.75 -17.999)" />
	</svg>
);

const DownIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg viewBox='0 0 24 24' fill='currentColor' className={className} style={{ height: fontSize, width: fontSize }}>
		<path xmlns='http://www.w3.org/2000/svg' d='M6.414,9H17.586a1,1,0,0,1,.707,1.707l-5.586,5.586a1,1,0,0,1-1.414,0L5.707,10.707A1,1,0,0,1,6.414,9Z' />
	</svg>
);

const Group = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 21.708 18">
			<g id="group" transform="translate(0 -43.729)">
				<g id="Group_13700" data-name="Group 13700" transform="translate(0 51.613)">
					<g id="Group_13699" data-name="Group 13699">
						<path id="Path_22402" data-name="Path 22402" d="M18.528,231.311H16.4a3.17,3.17,0,0,0-.836.112,3.183,3.183,0,0,0-2.835-1.743H8.976a3.183,3.183,0,0,0-2.836,1.743,3.17,3.17,0,0,0-.836-.112H3.18A3.184,3.184,0,0,0,0,234.491v3.4A1.91,1.91,0,0,0,1.908,239.8H19.8a1.91,1.91,0,0,0,1.908-1.908v-3.4A3.184,3.184,0,0,0,18.528,231.311ZM5.8,232.86v5.664H1.908a.637.637,0,0,1-.636-.636v-3.4a1.91,1.91,0,0,1,1.908-1.908H5.3a1.9,1.9,0,0,1,.5.067C5.8,232.719,5.8,232.789,5.8,232.86Zm8.844,5.664H7.068V232.86a1.91,1.91,0,0,1,1.908-1.908h3.756a1.91,1.91,0,0,1,1.908,1.908Zm5.8-.636a.637.637,0,0,1-.636.636H15.912V232.86c0-.071,0-.141-.008-.21a1.9,1.9,0,0,1,.5-.067h2.125a1.91,1.91,0,0,1,1.908,1.908Z" transform="translate(0 -229.68)" />
					</g>
				</g>
				<g id="Group_13702" data-name="Group 13702" transform="translate(1.417 47.239)">
					<g id="Group_13701" data-name="Group 13701">
						<path id="Path_22403" data-name="Path 22403" d="M36.24,126.5a2.826,2.826,0,1,0,2.826,2.826A2.829,2.829,0,0,0,36.24,126.5Zm0,4.379a1.554,1.554,0,1,1,1.554-1.554A1.555,1.555,0,0,1,36.24,130.883Z" transform="translate(-33.414 -126.504)" />
					</g>
				</g>
				<g id="Group_13704" data-name="Group 13704" transform="translate(7.079 43.729)">
					<g id="Group_13703" data-name="Group 13703">
						<path id="Path_22404" data-name="Path 22404" d="M170.737,43.729a3.775,3.775,0,1,0,3.775,3.775A3.779,3.779,0,0,0,170.737,43.729Zm0,6.278a2.5,2.5,0,1,1,2.5-2.5A2.506,2.506,0,0,1,170.737,50.007Z" transform="translate(-166.962 -43.729)" />
					</g>
				</g>
				<g id="Group_13706" data-name="Group 13706" transform="translate(14.64 47.239)">
					<g id="Group_13705" data-name="Group 13705">
						<path id="Path_22405" data-name="Path 22405" d="M348.12,126.5a2.826,2.826,0,1,0,2.826,2.826A2.829,2.829,0,0,0,348.12,126.5Zm0,4.379a1.554,1.554,0,1,1,1.554-1.554A1.556,1.556,0,0,1,348.12,130.883Z" transform="translate(-345.294 -126.504)" />
					</g>
				</g>
			</g>
		</svg>
	);
};

const Message = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 18'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 5h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8m4-13H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z' />
	</svg>
);
const MessageBox = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 13.091">
		<path id="Union_81" data-name="Union 81" d="M1.385,13.091A1.35,1.35,0,0,1,0,11.782V.656Q0,.626,0,.6V.589H0v0H0A.62.62,0,0,1,.027.473h0v0h0v0h0A.644.644,0,0,1,.182.212.691.691,0,0,1,.418.053.723.723,0,0,1,.679,0H17.321a.724.724,0,0,1,.252.05.691.691,0,0,1,.245.162A.633.633,0,0,1,18,.661V11.782a1.35,1.35,0,0,1-1.385,1.309Zm14.145-1.309-5.017-4.35-1.045.905a.722.722,0,0,1-.936,0L7.488,7.432l-5.017,4.35ZM1.385,10.947l5.078-4.4-5.078-4.4Zm15.231,0v-8.8l-5.078,4.4ZM9,6.967l6.528-5.657H2.472Z" />
	</svg>
);
const List = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 17 10'>
		<path stroke='currentColor' strokeLinecap='round' strokeWidth='2' d='M6 1h10M6 5h10M6 9h10M1.49 1h.01m-.01 4h.01m-.01 4h.01' />
	</svg>
);
const AngleUp = ({ className = 'ml-1', fontSize = '0.5em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 8'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7' />
	</svg>
);
const AngleDown = ({ className = 'ml-1', fontSize = '0.5em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 8'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1' />
	</svg>
);
const ArrowRight = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 10'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M1 5h12m0 0L9 1m4 4L9 9' />
	</svg>
);
const ProfileIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`w-4 h-4 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 18'>
		<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z' />
	</svg>
);
const BackwardIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={`w-6 h-6 text-gray-800 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
		<path d="M10.819.4a1.974 1.974 0 0 0-2.147.33l-6.5 5.773A2.014 2.014 0 0 0 2 6.7V1a1 1 0 0 0-2 0v14a1 1 0 1 0 2 0V9.3c.055.068.114.133.177.194l6.5 5.773a1.982 1.982 0 0 0 2.147.33A1.977 1.977 0 0 0 12 13.773V2.227A1.977 1.977 0 0 0 10.819.4Z" />
	</svg>
);
const AngleLeftIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
		<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
	</svg>
);

const AngleRightIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
		<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
	</svg>
);
const ForwordIcon = ({ className = '', fontSize = '1em' }: IconSvg) => (

	<svg className={`w-6 h-6 text-gray-800 ${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 12 16">
		<path d="M11 0a1 1 0 0 0-1 1v5.7a2.028 2.028 0 0 0-.177-.194L3.33.732A2 2 0 0 0 0 2.227v11.546A1.977 1.977 0 0 0 1.181 15.6a1.982 1.982 0 0 0 2.147-.33l6.5-5.773A1.88 1.88 0 0 0 10 9.3V15a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1Z" />
	</svg>
);
const ArrowSortingUp = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true' viewBox="0 0 10.569 12.863">
			<path id="Union_21" data-name="Union 21" d="M5.284,0A1.756,1.756,0,0,0,4.01.553L.206,4.545a.765.765,0,0,0,0,1.045.681.681,0,0,0,1,0L4.58,2.045V12.124a.705.705,0,1,0,1.409,0V2.045L9.367,5.59a.681.681,0,0,0,1,0,.766.766,0,0,0,0-1.046L6.558.553A1.756,1.756,0,0,0,5.286,0Z" />
		</svg>
	);
}
const ArrowSortingDown = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 13" className={`w-6 h-6  ${className} `} style={{ height: fontSize, width: fontSize }} fill="currentColor" aria-hidden='true'>
			<path d="m5.3 12.9q0.2 0 0.3-0.1 0.2 0 0.4-0.1 0.1-0.1 0.3-0.2 0.1-0.1 0.3-0.2l3.8-4q0.1-0.1 0.1-0.2 0.1-0.2 0.1-0.3 0-0.2-0.1-0.3 0-0.1-0.1-0.2-0.1-0.1-0.3-0.2-0.1-0.1-0.2-0.1-0.2 0-0.3 0.1-0.1 0.1-0.2 0.2l-3.4 3.5v-10.1q0-0.3-0.2-0.5-0.2-0.2-0.5-0.2-0.3 0-0.5 0.2-0.2 0.2-0.2 0.5v10.1l-3.4-3.5q-0.1-0.1-0.2-0.2-0.2-0.1-0.3-0.1-0.1 0-0.3 0.1-0.1 0.1-0.2 0.2-0.1 0.1-0.1 0.2-0.1 0.1-0.1 0.3 0 0.1 0.1 0.3 0 0.1 0.1 0.2l3.8 4q0.1 0.1 0.3 0.2 0.1 0.1 0.3 0.2 0.2 0.1 0.3 0.1 0.2 0.1 0.4 0.1z" />
		</svg>
	);
}
const DropdownArrowDown = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' viewBox="0 0 12 6.693">
			<path id="Path_13498" data-name="Path 13498" d="M.692,0a.685.685,0,0,1,.49.2L6.491,5.51a.7.7,0,0,1,0,.98L1.182,11.8A.693.693,0,1,1,.2,10.816L5.016,6,.2,1.184A.692.692,0,0,1,.2.2.684.684,0,0,1,.692,0Z" transform="translate(12) rotate(90)" />
		</svg>
	);
}
const Camera = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='none' viewBox="0 0 22.003 21.001">
			<g id="Group_12049" data-name="Group 12049" transform="translate(23161.049 8798)">
				<path id="Path_14572" data-name="Path 14572" d="M1737,4676.364c0-.349,0-.528.01-.678a3.012,3.012,0,0,1,2.677-2.683c.149-.01.338-.01.707-.01h.269a1.991,1.991,0,0,0,1.722-1.247,1.641,1.641,0,0,0,.089-.25,1.622,1.622,0,0,1,.09-.25,1.992,1.992,0,0,1,1.722-1.247h5.335a1.991,1.991,0,0,1,1.722,1.247,1.591,1.591,0,0,1,.089.25,1.644,1.644,0,0,0,.09.25,1.991,1.991,0,0,0,1.722,1.247h.269c.368,0,.557,0,.707.01a3.012,3.012,0,0,1,2.677,2.683c.01.149.01.33.01.678v7.8a7.367,7.367,0,0,1-.328,3.152,2.854,2.854,0,0,1-1.3,1.307,7.327,7.327,0,0,1-3.146.33h-10.351a7.318,7.318,0,0,1-3.145-.329,2.855,2.855,0,0,1-1.3-1.307,7.369,7.369,0,0,1-.328-3.151Z" transform="translate(-24897 -13467)" fill="none" stroke="#fff" />
				<path id="Path_14573" data-name="Path 14573" d="M1747,4684.5a4,4,0,1,0-4-4A4,4,0,0,0,1747,4684.5Z" transform="translate(-24897.047 -13467.028)" fill="none" stroke="#fff" />
			</g>
		</svg>
	);
}
const Planning = ({ className = '' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} aria-hidden='true' fill='currentColor' viewBox="0 0 32 32">
			<g id="Group_12715" data-name="Group 12715">
				<g id="Group_12714" data-name="Group 12714">
					<path id="Path_20940" data-name="Path 20940" d="M30.125,20.787V2.813A2.816,2.816,0,0,0,27.313,0H6.625A2.816,2.816,0,0,0,3.812,2.813v1h-1a2.813,2.813,0,0,0,0,5.625h1v3.75h-1a2.813,2.813,0,1,0,0,5.625h1v3.75h-1a2.813,2.813,0,0,0,0,5.625h1v.938a2.891,2.891,0,0,0,.809,2,2.755,2.755,0,0,0,2,.87H25.438a6.6,6.6,0,0,0,4.687-11.213ZM2.813,7.562a.937.937,0,1,1,0-1.875H4.75a.937.937,0,1,1,0,1.875Zm0,9.375a.938.938,0,0,1,0-1.875H4.75a.938.938,0,0,1,0,1.875ZM4.75,26.313H2.813a.938.938,0,0,1,0-1.875H4.75a.938.938,0,0,1,0,1.875Zm1.875,3.812a1,1,0,0,1-.937-1v-1.1a2.812,2.812,0,0,0,0-5.3V18.651a2.812,2.812,0,0,0,0-5.3V9.276a2.812,2.812,0,0,0,0-5.3V2.813a.939.939,0,0,1,.938-.937H27.313a.939.939,0,0,1,.938.938V19.447a6.561,6.561,0,0,0-9.375,5.928,6.636,6.636,0,0,0,1.993,4.75Zm18.813,0a4.719,4.719,0,1,1,4.687-4.75A4.724,4.724,0,0,1,25.438,30.125Z" />
				</g>
			</g>
			<g id="Group_12717" data-name="Group 12717" transform="translate(18.875 7.563)">
				<g id="Group_12716" data-name="Group 12716">
					<path id="Path_20941" data-name="Path 20941" d="M308.563,121h-5.625a.938.938,0,0,0,0,1.875h5.625a.938.938,0,0,0,0-1.875Z" transform="translate(-302 -121)" />
				</g>
			</g>
			<g id="Group_12719" data-name="Group 12719" transform="translate(18.875 15.063)">
				<g id="Group_12718" data-name="Group 12718">
					<path id="Path_20942" data-name="Path 20942" d="M308.563,241h-5.625a.938.938,0,0,0,0,1.875h5.625a.937.937,0,0,0,0-1.875Z" transform="translate(-302 -241)" />
				</g>
			</g>
			<g id="Group_12721" data-name="Group 12721" transform="translate(24.5 22.563)">
				<g id="Group_12720" data-name="Group 12720">
					<path id="Path_20943" data-name="Path 20943" d="M394.813,362.875h-.937v-.937a.938.938,0,0,0-1.875,0v1.875a.938.938,0,0,0,.938.938h1.875a.938.938,0,0,0,0-1.875Z" transform="translate(-392 -361)" />
				</g>
			</g>
			<g id="Group_12723" data-name="Group 12723" transform="translate(9.174 5.687)">
				<g id="Group_12722" data-name="Group 12722">
					<path id="Path_20944" data-name="Path 20944" d="M154.271,91.274a.937.937,0,0,0-1.326,0l-3.087,3.087-1.476-1.476a.937.937,0,0,0-1.326,1.326L149.2,96.35a.937.937,0,0,0,1.326,0l3.75-3.75A.937.937,0,0,0,154.271,91.274Z" transform="translate(-146.783 -91)" />
				</g>
			</g>
			<g id="Group_12725" data-name="Group 12725" transform="translate(9.174 13.187)">
				<g id="Group_12724" data-name="Group 12724">
					<path id="Path_20945" data-name="Path 20945" d="M154.271,211.274a.937.937,0,0,0-1.326,0l-3.087,3.087-1.476-1.476a.937.937,0,1,0-1.326,1.326l2.139,2.139a.937.937,0,0,0,1.326,0l3.75-3.75A.937.937,0,0,0,154.271,211.274Z" transform="translate(-146.783 -211)" />
				</g>
			</g>
			<g id="Group_12727" data-name="Group 12727" transform="translate(9.174 20.687)">
				<g id="Group_12726" data-name="Group 12726">
					<path id="Path_20946" data-name="Path 20946" d="M154.271,331.274a.937.937,0,0,0-1.326,0l-3.087,3.087-1.476-1.476a.937.937,0,0,0-1.326,1.326l2.139,2.139a.937.937,0,0,0,1.326,0l3.75-3.75A.937.937,0,0,0,154.271,331.274Z" transform="translate(-146.783 -331)" />
				</g>
			</g>
		</svg>
	);
}
const AddContent = ({ className = '' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} aria-hidden='true' fill='currentColor' viewBox="0 0 31.999 32">
			<g id="add" transform="translate(-0.5 -0.5)">
				<path id="Path_20947" data-name="Path 20947" d="M28.233,16.621V3.7a3.2,3.2,0,0,0-3.2-3.2H10.1a1.04,1.04,0,0,0-.135.027.924.924,0,0,0-.138.028,1.045,1.045,0,0,0-.481.258L.813,9.346a1.049,1.049,0,0,0-.259.483.989.989,0,0,0-.027.134A1.04,1.04,0,0,0,.5,10.1V29.3a3.2,3.2,0,0,0,3.2,3.2H23.966a8.047,8.047,0,0,0,2.557-.4v0c.026-.008.051-.018.077-.029l.006,0h0a8.491,8.491,0,0,0,1.624-15.447ZM9.033,4.142V7.967A1.067,1.067,0,0,1,7.967,9.033H4.142ZM3.7,30.366A1.067,1.067,0,0,1,2.633,29.3V11.167H7.967a3.2,3.2,0,0,0,3.2-3.2V2.633H25.033A1.067,1.067,0,0,1,26.1,3.7v12c-.047-.012-.1-.016-.144-.028-.073-.018-.147-.027-.221-.043a8.357,8.357,0,0,0-1.769-.2,8.543,8.543,0,0,0-8.533,8.533,7.964,7.964,0,0,0,.847,3.65,8.3,8.3,0,0,0,.8,1.329c.081.114.167.222.253.331a8.443,8.443,0,0,0,.879.951c.046.043.081.1.128.139Zm22.21-.315a1.077,1.077,0,0,0-.124.048,5.964,5.964,0,0,1-1.82.267,6.377,6.377,0,0,1-5.77-3.685,5.911,5.911,0,0,1-.63-2.715,6.407,6.407,0,0,1,6.4-6.4,5.966,5.966,0,0,1,2.75.647,6.372,6.372,0,0,1-.806,11.838Z" />
				<path id="Path_20948" data-name="Path 20948" d="M16.967,12.7H14.833V10.567a1.067,1.067,0,0,0-2.133,0V12.7H10.567a1.067,1.067,0,0,0,0,2.133H12.7v2.133a1.067,1.067,0,1,0,2.133,0V14.833h2.133a1.067,1.067,0,1,0,0-2.133Z" transform="translate(10.2 10.2)" />
			</g>
		</svg>
	);
}
const Faq = ({ className = '' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} aria-hidden='true' fill='currentColor' viewBox="0 0 34.063 30.049">
			<path id="Union_48" data-name="Union 48" d="M21830.678,8052.237a10.724,10.724,0,0,0-9.41-5.659l-4.381.729a1,1,0,0,1-1.15-1.151l.729-4.381a16.328,16.328,0,1,1,31.135,6.01l.729,4.387a1,1,0,0,1-1.15,1.146l-4.381-.729a12.056,12.056,0,0,1-12.119-.351Zm6.361-.181a10.049,10.049,0,0,0,5.066-1.371.992.992,0,0,1,.67-.126l3.35.56-.559-3.351a1,1,0,0,1,.125-.674,10.023,10.023,0,0,0-7.3-14.992q.185.535.316,1.088a.178.178,0,0,1,.008.031l.035.148.012.054c.018.076.033.152.049.228l.018.093c.008.036.014.073.021.109s.014.077.02.115.012.063.016.095c.012.066.021.133.033.2,0,.023.006.046.01.069.006.052.014.1.02.155,0,.024.008.049.01.073l.023.2c0,.005,0,.011,0,.017.008.073.014.146.021.219,0,.022,0,.044,0,.066.006.059.01.117.014.175,0,.017,0,.033,0,.049l.012.222a.388.388,0,0,0,0,.047c0,.06,0,.12,0,.179,0,.021,0,.042,0,.064,0,.074,0,.148,0,.222,0,.211,0,.421-.016.63h3.225a1,1,0,0,1,0,2h-3.5a11.73,11.73,0,0,1-.8,2.385h4.3a1,1,0,0,1,0,2h-5.463a12.072,12.072,0,0,1-1.2,1.42c-.049.05-.1.1-.148.147-.014.015-.029.029-.045.044-.043.043-.088.086-.133.128l-.064.06-.082.076-.139.125-.041.037c-.137.12-.275.236-.414.349h7.729a1,1,0,0,1,0,2h-10.418a.99.99,0,0,1-.535-.156,11.827,11.827,0,0,1-1.3.41l-.047.012-.158.039-.158.036-.031.007c-.23.05-.461.094-.7.13A9.974,9.974,0,0,0,21837.039,8052.056Zm-15.08-7.386a9.993,9.993,0,0,0,5.063,1.371h.18a10.069,10.069,0,0,0,9.842-9.891c0-.042,0-.084,0-.127a9.883,9.883,0,0,0-1.092-4.551,10.022,10.022,0,1,0-17.58,9.612.99.99,0,0,1,.121.669l-.555,3.351,3.352-.554a.874.874,0,0,1,.168-.016A1.011,1.011,0,0,1,21821.959,8044.67Zm4.064-3a1,1,0,1,1,1,1A1.012,1.012,0,0,1,21826.023,8041.665Zm0-3.328V8035.4a1,1,0,0,1,1-1,1.511,1.511,0,1,0-1.514-1.514,1,1,0,1,1-2,0,3.512,3.512,0,1,1,4.512,3.367v2.084a1,1,0,1,1-2,0Z" transform="translate(-21815.002 -8024.003)" />
		</svg>
	);
}
const PublishCourse = ({ className = '' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} aria-hidden='true' fill='currentColor' viewBox="0 0 32 32">
			<g id="Icon" transform="translate(-1.25 -1.25)">
				<circle id="Ellipse_82" data-name="Ellipse 82" cx="1.116" cy="1.116" r="1.116" transform="translate(6.087 5.715)" />
				<circle id="Ellipse_83" data-name="Ellipse 83" cx="1.116" cy="1.116" r="1.116" transform="translate(9.808 5.715)" />
				<circle id="Ellipse_84" data-name="Ellipse 84" cx="1.116" cy="1.116" r="1.116" transform="translate(13.529 5.715)" />
				<path id="Path_20949" data-name="Path 20949" d="M33.25,14.273V6.087A4.837,4.837,0,0,0,28.413,1.25H6.087A4.837,4.837,0,0,0,1.25,6.087V28.413A4.837,4.837,0,0,0,6.087,33.25h8.186a1.116,1.116,0,0,0,0-2.233H6.087a2.6,2.6,0,0,1-2.6-2.6V6.087a2.6,2.6,0,0,1,2.6-2.6H28.413a2.6,2.6,0,0,1,2.6,2.6v8.186a1.116,1.116,0,0,0,2.233,0Z" />
				<path id="Path_20950" data-name="Path 20950" d="M32.134,7.25H2.366a1.116,1.116,0,1,0,0,2.233H32.134a1.116,1.116,0,1,0,0-2.233Z" transform="translate(0 2.93)" />
				<path id="Path_20951" data-name="Path 20951" d="M19.552,10.25a9.3,9.3,0,1,0,9.3,9.3A9.308,9.308,0,0,0,19.552,10.25Zm0,2.233a7.07,7.07,0,1,1-7.07,7.07A7.072,7.072,0,0,1,19.552,12.483Z" transform="translate(4.395 4.395)" />
				<path id="Path_20952" data-name="Path 20952" d="M17.983,21.314v-6.7a1.116,1.116,0,1,0-2.233,0v6.7a1.116,1.116,0,0,0,2.233,0Z" transform="translate(7.081 5.983)" />
				<path id="Path_20953" data-name="Path 20953" d="M21.608,16.8l-2.977-2.977a1.115,1.115,0,0,0-1.578,0L14.077,16.8a1.116,1.116,0,0,0,1.578,1.578L17.843,16.2l2.188,2.186A1.116,1.116,0,0,0,21.608,16.8Z" transform="translate(6.105 5.983)" />
			</g>
		</svg>
	);
}
const Quiz = ({ className = '' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} aria-hidden='true' fill='currentColor' viewBox="0 0 30.047 30.049">
			<path id="Union_54" data-name="Union 54" d="M15606.417,10243.445v-3.57a7.042,7.042,0,0,0-2.17-5.047,9.787,9.787,0,1,1,13.549,0,7.044,7.044,0,0,0-2.172,5.047v3.57a4.6,4.6,0,0,1-9.207,0Zm2.3,0a2.3,2.3,0,0,0,4.609,0v-2.424h-4.609Zm4.689-4.717a9.314,9.314,0,0,1,2.8-5.557,7.488,7.488,0,1,0-10.371,0,9.388,9.388,0,0,1,2.809,5.551Zm7.26-6.584,1.627-1.627,2.939,2.947-1.619,1.621Zm-23.855,1.32,2.941-2.947,1.625,1.627-2.939,2.941Zm13.066-2.807v-1.189a3.677,3.677,0,0,1,1.488-2.947.571.571,0,0,0,.24-.467.58.58,0,0,0-1.16,0v1.15h-2.3v-1.15a2.875,2.875,0,1,1,4.578,2.316,1.364,1.364,0,0,0-.551,1.1v1.189Zm12.086-1.725v-2.3h4.086v2.3Zm-25.961,0v-2.3h4.086v2.3Zm24.682-5.525,2.947-2.949,1.627,1.627-2.947,2.947Zm-23.891-1.322,1.621-1.627,2.945,2.949-1.619,1.625Z" transform="translate(-15596.001 -10218)" />
		</svg>
	);
}
const UploadImage = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 50.941 41.478">
			<path id="Path_113" data-name="Path 113" d="M33.686,27.537a8.215,8.215,0,1,1-8.216-8.216,8.215,8.215,0,0,1,8.216,8.216ZM50.941,15.871V39.205a5.633,5.633,0,0,1-5.633,5.633H5.633A5.633,5.633,0,0,1,0,39.205V15.871a5.633,5.633,0,0,1,5.633-5.633h6.929V8.289A4.928,4.928,0,0,1,17.491,3.36h15.96A4.928,4.928,0,0,1,38.38,8.29v1.947h6.929a5.635,5.635,0,0,1,5.632,5.634ZM37.911,27.537a12.44,12.44,0,1,0-12.44,12.44A12.44,12.44,0,0,0,37.911,27.537Z" transform="translate(0 -3.36)" />
		</svg>
	);
}
const Filter = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 17.981 16.574">
			<path id="filter" d="M17.929,10a.545.545,0,0,0-.493-.313H.545a.545.545,0,0,0-.42.892L6.617,18.45v7.262A.545.545,0,0,0,7.4,26.2l3.648-1.808a.545.545,0,0,0,.3-.488l.007-5.454,6.494-7.876A.545.545,0,0,0,17.929,10ZM10.4,17.908a.545.545,0,0,0-.124.346l-.007,5.312L7.707,24.834V18.254a.545.545,0,0,0-.124-.347L1.7,10.773H16.28Z" transform="translate(0 -9.683)" />
		</svg>
	);
}
const Filter2 = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16.575 14">
			<path id="Union_24" data-name="Union 24" d="M7.174,14a1,1,0,0,1,0-2h3a1,1,0,0,1,0,2ZM5.287,10a.945.945,0,0,1-1-1,.945.945,0,0,1,1-1h6a.944.944,0,0,1,1,1,.944.944,0,0,1-1,1Zm-3-4a.945.945,0,0,1-1-1,.945.945,0,0,1,1-1h12a.945.945,0,0,1,1,1,.945.945,0,0,1-1,1ZM.829,2C.331,2,0,1.6,0,1S.331,0,.829,0H15.746c.5,0,.829.4.829,1s-.331,1-.829,1Z" />
		</svg>
	);
}
const Location = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 13.5 18.5">
			<path id="Location" d="M161.794,31.855a28.4,28.4,0,0,1-4.661-6,10.968,10.968,0,0,1-1.506-5.285,6.6,6.6,0,0,1,1.9-4.651,6.446,6.446,0,0,1,9.192,0,6.6,6.6,0,0,1,1.9,4.651,10.966,10.966,0,0,1-1.506,5.285,28.39,28.39,0,0,1-4.661,6,.463.463,0,0,1-.66.006Zm.333-14a2.661,2.661,0,0,0-1.9.8,2.743,2.743,0,0,0,0,3.843,2.666,2.666,0,0,0,3.8,0l.023-.022a2.743,2.743,0,0,0-.023-3.821,2.662,2.662,0,0,0-1.9-.8Zm-2.561.126a3.591,3.591,0,0,1,5.121,0,3.692,3.692,0,0,1,.025,5.154l-.025.028a3.591,3.591,0,0,1-5.121,0,3.694,3.694,0,0,1,0-5.182Zm-1.614,7.42a26.647,26.647,0,0,0,4.174,5.445A26.649,26.649,0,0,0,166.3,25.4a10.044,10.044,0,0,0,1.389-4.83,5.647,5.647,0,0,0-1.629-3.981,5.519,5.519,0,0,0-7.869,0,5.646,5.646,0,0,0-1.629,3.981A10.044,10.044,0,0,0,157.953,25.4Z" transform="translate(-155.377 -13.746)" />
		</svg>
	);
}
const Composter = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 30.979 28">
			<g id="compost" transform="translate(0 -0.5)">
				<path id="Path_20894" data-name="Path 20894" d="M30.085,6.457h-1.8a4.467,4.467,0,0,0-5.026-4.134,4.469,4.469,0,0,0-5.687-1.307,4.469,4.469,0,0,0-4.17,0A4.469,4.469,0,0,0,7.717,2.324,4.467,4.467,0,0,0,2.691,6.457H.893A.894.894,0,0,0,0,7.351v4.766a.894.894,0,0,0,.894.894H2.778L4.291,26.126A2.68,2.68,0,0,0,6.954,28.5h17.07a2.68,2.68,0,0,0,2.663-2.374L28.2,13.011h1.884a.894.894,0,0,0,.894-.894V7.351a.894.894,0,0,0-.894-.894ZM7.148,4.074a2.691,2.691,0,0,1,.749.107.894.894,0,0,0,1.042-.446,2.679,2.679,0,0,1,3.943-.944.893.893,0,0,0,1.044,0,2.677,2.677,0,0,1,3.126,0,.894.894,0,0,0,1.044,0,2.679,2.679,0,0,1,3.943.944.894.894,0,0,0,1.042.446,2.681,2.681,0,0,1,3.413,2.276H4.484A2.685,2.685,0,0,1,7.148,4.074ZM24.911,25.922a.893.893,0,0,1-.888.791H6.954a.893.893,0,0,1-.888-.791L4.577,13.011H26.4Zm4.28-14.7H1.787V8.245h27.4Zm0,0" fill="#fff" />
				<path id="Path_20895" data-name="Path 20895" d="M210.6,253.064V254.7a.894.894,0,1,0,1.787,0v-1.632a2.869,2.869,0,0,0,1.134-4.753l-1.4-1.4a.893.893,0,0,0-1.264,0l-1.4,1.4a2.869,2.869,0,0,0,1.134,4.753Zm.13-3.49.764-.764.764.764a1.081,1.081,0,1,1-1.528,0Zm0,0" transform="translate(-196.001 -231.26)" />
			</g>
		</svg>
	);
}
const Recycle = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 29.08 28.5">
			<g id="recycle-sign" transform="translate(-32.1 -33.315)">
				<path id="Path_20901" data-name="Path 20901" d="M43.209,219.707,38.1,219.7l2.2-3.809,1.179.68a.693.693,0,0,0,1-.839l-1.845-5.016a.692.692,0,0,0-.768-.443l-5.266.91a.693.693,0,0,0-.228,1.282l1.177.68-2.8,4.846a4.8,4.8,0,0,0,4.147,7.2l6.315.011h0a1.385,1.385,0,0,0,1.384-1.385v-2.72A1.387,1.387,0,0,0,43.209,219.707Zm-9.268,2.386a3.38,3.38,0,0,1,0-3.411l3.144-5.446a.693.693,0,0,0-.253-.946l-.121-.07,2.813-.486.985,2.679-.122-.071a.692.692,0,0,0-.946.254L36.3,220.042l-.861,1.492a2.441,2.441,0,0,0-.264,1.805A3.407,3.407,0,0,1,33.941,222.093Zm9.266,1.72-5.942-.01a1.079,1.079,0,0,1-.629-1.576l.661-1.145,5.91.01v2.721Z" transform="translate(0 -165.458)" />
				<path id="Path_20902" data-name="Path 20902" d="M259.91,241.229l-3.161-5.453a1.387,1.387,0,0,0-1.891-.5l-2.356,1.36a1.385,1.385,0,0,0-.506,1.894l2.559,4.415-4.422-.008v-1.35a.692.692,0,0,0-1.225-.443l-3.421,4.105a.693.693,0,0,0,0,.887l3.421,4.105a.693.693,0,0,0,1.224-.443v-1.37l5.617.01h.009a4.8,4.8,0,0,0,4.15-7.2Zm-6.715-3.4,2.356-1.36,2.98,5.142a1.078,1.078,0,0,1-1.049,1.331h-1.323Zm5.519,7.511a3.375,3.375,0,0,1-2.954,1.706h-.007l-6.311-.011h0a.693.693,0,0,0-.693.692v.151l-1.827-2.193,1.827-2.192v.129a.693.693,0,0,0,.691.693l6.318.011h1.724a2.44,2.44,0,0,0,1.7-.676,3.417,3.417,0,0,1-.464,1.69Z" transform="translate(-199.384 -188.671)" />
				<path id="Path_20903" data-name="Path 20903" d="M141.014,43.045l2.356,1.36a1.387,1.387,0,0,0,1.892-.507l2.541-4.4,2.22,3.831-1.157.667a.693.693,0,0,0,.228,1.282l5.266.91a.692.692,0,0,0,.768-.443l1.844-5.015a.692.692,0,0,0-1-.839l-1.2.692-2.825-4.874a4.752,4.752,0,0,0-4.153-2.392h0a4.75,4.75,0,0,0-4.151,2.4l-3.141,5.439a1.385,1.385,0,0,0,.507,1.892ZM147.8,34.7h0a3.381,3.381,0,0,1,2.954,1.7l3.171,5.472a.692.692,0,0,0,.945.252l.141-.081-.985,2.678-2.812-.486.1-.058a.693.693,0,0,0,.253-.947L148.4,37.765l-.861-1.49a2.44,2.44,0,0,0-1.431-1.131A3.406,3.406,0,0,1,147.8,34.7Zm-3.14,2.031a1.075,1.075,0,0,1,1.682.236L147,38.113l-2.94,5.092-2.356-1.36Z" transform="translate(-101.195 0)" />
			</g>
		</svg>
	);
}
const World = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 25.971 28">
			<path id="Path_20904" data-name="Path 20904" d="M11.049,146.867a2.294,2.294,0,0,0-.989-1.1l-3.2-1.776a.761.761,0,0,0-.61-.057,2.747,2.747,0,0,0-1.433,1.1v-4.992A3.047,3.047,0,0,0,1.775,137H.761a.761.761,0,0,0-.761.761v10.551a.761.761,0,0,0,.122.414l2.647,4.086a.759.759,0,0,1,.122.414v4.065a.761.761,0,0,0,.761.761h7.71a.761.761,0,0,0,.761-.761v-7.136a3.783,3.783,0,0,0-.308-1.5Zm-.448,9.662H4.413v-3.3a2.278,2.278,0,0,0-.367-1.241l-2.525-3.9v-9.565h.254A1.523,1.523,0,0,1,3.3,140.043v5.428a.761.761,0,0,0,.119.408l2.841,4.464a.761.761,0,0,0,1.284-.817l-1.463-2.3a1.243,1.243,0,0,1,.381-1.717l2.862,1.59a.765.765,0,0,1,.33.365l.766,1.788a2.27,2.27,0,0,1,.185.9v6.375Z" transform="translate(0 -130.051)" />
			<path id="Path_20905" data-name="Path 20905" d="M284.362,137h-1.014a3.047,3.047,0,0,0-3.043,3.043v4.992a2.747,2.747,0,0,0-1.433-1.1.761.761,0,0,0-.61.057l-3.2,1.776a2.294,2.294,0,0,0-.99,1.1l-.766,1.788a3.782,3.782,0,0,0-.308,1.5v7.136a.761.761,0,0,0,.761.761h7.71a.761.761,0,0,0,.761-.761v-4.065a.759.759,0,0,1,.122-.414L285,148.725a.761.761,0,0,0,.122-.414V137.761A.761.761,0,0,0,284.362,137Zm-.761,11.087-2.525,3.9a2.278,2.278,0,0,0-.367,1.241v3.3h-6.188v-6.375a2.271,2.271,0,0,1,.185-.9l.766-1.788a.765.765,0,0,1,.33-.365l2.862-1.59a1.243,1.243,0,0,1,.381,1.717l-1.463,2.3a.761.761,0,0,0,1.284.817l2.841-4.464a.761.761,0,0,0,.119-.408v-5.427a1.523,1.523,0,0,1,1.522-1.522h.254v9.565Z" transform="translate(-259.152 -130.051)" />
			<path id="Path_20906" data-name="Path 20906" d="M126.609,7.3a7.3,7.3,0,1,0-7.3,7.3A7.313,7.313,0,0,0,126.609,7.3Zm-6.543-5.732a5.783,5.783,0,0,1,4.774,7.406h-1.621a.578.578,0,0,1-.46-.23l-.473-.631a.578.578,0,0,1-.107-.44l.092-.553a2.1,2.1,0,0,0-1.724-2.413.574.574,0,0,1-.481-.568V1.572Zm-3.145,11a5.8,5.8,0,0,1-3.348-4.507h1.368a.759.759,0,0,1,.584.274l1.22,1.464a.763.763,0,0,1,.176.487Zm2.384.515a5.8,5.8,0,0,1-.862-.064V10.29a2.287,2.287,0,0,0-.529-1.461l-1.22-1.464a2.276,2.276,0,0,0-1.754-.821h-1.368a5.8,5.8,0,0,1,4.972-4.972V4.143A2.091,2.091,0,0,0,120.3,6.212a.576.576,0,0,1,.473.662l-.092.553a2.107,2.107,0,0,0,.391,1.6l.473.631a2.107,2.107,0,0,0,1.678.839h.9a5.782,5.782,0,0,1-4.817,2.587Z" transform="translate(-106.319 0)" />
		</svg>
	);
}
const Waste = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 27.979 28.198">
			<g id="garbage" transform="translate(-1.99)">
				<path id="Path_20911" data-name="Path 20911" d="M29.884,25.084l-1.019-3.839a5.989,5.989,0,0,0-3.825-4.117L27.1,15.49a1.744,1.744,0,0,0,.012-2.723,6.416,6.416,0,0,0-6.9-.745l.112-1.5h1a.826.826,0,0,0,.826-.826V7.931a.826.826,0,0,0-.242-.584l-1.52-1.52V4.3a2.481,2.481,0,0,0-2.478-2.478H12.895V.826a.826.826,0,0,0-1.652,0v.991H6.231A2.481,2.481,0,0,0,3.752,4.3v1.53l-1.52,1.52a.826.826,0,0,0-.242.584V9.693a.826.826,0,0,0,.826.826h1l.95,12.711a2.612,2.612,0,0,0-.7,4.17,2.537,2.537,0,0,0,1.843.8H27.489A2.478,2.478,0,0,0,29.884,25.084ZM19.9,16.157l1.223.97a5.991,5.991,0,0,0-1.346.667Zm.185-2.1a4.794,4.794,0,0,1,5.989,0,.091.091,0,0,1,0,.143l-2.994,2.374L20.09,14.2a.087.087,0,0,1-.034-.067v-.018a.089.089,0,0,1,.032-.058ZM5.4,4.3a.827.827,0,0,1,.826-.826H17.906a.827.827,0,0,1,.826.826V5.342H5.4ZM3.642,8.273,4.921,6.994h14.3l1.278,1.278v.594H3.642V8.273Zm15.026,2.246-.683,9.131a5.963,5.963,0,0,0-.684,1.595l-1.019,3.839a2.462,2.462,0,0,0,.058,1.462H8.3A2.6,2.6,0,0,0,6.4,23.015l-.934-12.5ZM5.9,24.618a.937.937,0,0,1,.936.936.99.99,0,0,1-.936.991.99.99,0,0,1-.936-.991A.937.937,0,0,1,5.9,24.618Zm21.589,1.928H18.678a.826.826,0,0,1-.8-1.038L18.9,21.668a4.327,4.327,0,0,1,1.8-2.5,5.427,5.427,0,0,0-.206,1.541.826.826,0,1,0,1.652,0,2.313,2.313,0,0,1,.936-2.188,2.313,2.313,0,0,1,.936,2.188.826.826,0,1,0,1.652,0,5.427,5.427,0,0,0-.206-1.541,4.326,4.326,0,0,1,1.8,2.5l1.019,3.839A.826.826,0,0,1,27.489,26.546Z" transform="translate(0)" />
				<path id="Path_20912" data-name="Path 20912" d="M166.92,222.989a2.844,2.844,0,0,1,1.991,1.839.749.749,0,0,0-.933,1.162l1.153,1.123a.757.757,0,0,0,1.119.045l1.182-1.213a.748.748,0,0,0-.972-1.13,4.347,4.347,0,0,0-3.171-3.277.749.749,0,0,0-.369,1.451Z" transform="translate(-155.089 -208.973)" />
				<path id="Path_20913" data-name="Path 20913" d="M101.065,279.433a.748.748,0,0,0,.95.078,4.347,4.347,0,0,0,3.169,3.265.749.749,0,1,0,.369-1.451,2.844,2.844,0,0,1-1.992-1.843.748.748,0,0,0,.945-1.153c-1.317-1.283-1.214-1.184-1.256-1.22a.749.749,0,0,0-1.016.051l-1.182,1.213A.749.749,0,0,0,101.065,279.433Z" transform="translate(-93.27 -261.257)" />
			</g>
		</svg>
	);
}
const Map = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 13.654 18.5">
			<path id="Location" d="M161.867,31.855a28.445,28.445,0,0,1-4.716-6,10.871,10.871,0,0,1-1.524-5.285,6.577,6.577,0,0,1,13.154,0,10.869,10.869,0,0,1-1.524,5.285,28.433,28.433,0,0,1-4.716,6,.472.472,0,0,1-.668.006Zm.337-14a2.717,2.717,0,1,0,1.921,4.638l.023-.022a2.718,2.718,0,0,0-1.945-4.616Zm-2.591.126a3.664,3.664,0,0,1,5.208,5.154l-.026.028a3.664,3.664,0,1,1-5.182-5.182ZM157.98,25.4a26.681,26.681,0,0,0,4.224,5.445,26.684,26.684,0,0,0,4.224-5.445,9.956,9.956,0,0,0,1.406-4.83,5.629,5.629,0,1,0-11.259,0A9.955,9.955,0,0,0,157.98,25.4Z" transform="translate(-155.377 -13.746)" />
		</svg>
	);
}
const Equalizer = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16.576 16.576">
			<g id="Group_12077" data-name="Group 12077" transform="translate(-107 -16.712)">
				<path id="Equalizer_1_" d="M27.938,13.913H20.2a2.538,2.538,0,0,0-4.919,0H12.638a.638.638,0,0,0,0,1.275h2.641a2.538,2.538,0,0,0,4.919,0h7.741a.638.638,0,1,0,0-1.275Zm-10.2,1.913a1.275,1.275,0,1,1,1.275-1.275A1.276,1.276,0,0,1,17.738,15.825Zm10.2,3.825H25.3a2.538,2.538,0,0,0-4.919,0H12.638a.638.638,0,0,0,0,1.275h7.741a2.538,2.538,0,0,0,4.919,0h2.641a.638.638,0,1,0,0-1.275Zm-5.1,1.913a1.275,1.275,0,1,1,1.275-1.275A1.276,1.276,0,0,1,22.838,21.563Zm5.1,3.825H20.2a2.538,2.538,0,0,0-4.919,0H12.638a.638.638,0,0,0,0,1.275h2.641a2.538,2.538,0,0,0,4.919,0h7.741a.638.638,0,1,0,0-1.275ZM17.738,27.3a1.275,1.275,0,1,1,1.275-1.275A1.276,1.276,0,0,1,17.738,27.3Z" transform="translate(95 4.712)" />
			</g>
		</svg>
	);
}
const Printer = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 17.97 16.574">
			<g id="printer_1_" transform="translate(0 -9.633)">
				<path id="Path_20858" data-name="Path 20858" d="M16.7,13.463H14.689V10.176a.543.543,0,0,0-.543-.543H3.824a.543.543,0,0,0-.543.543v3.286H1.268A1.269,1.269,0,0,0,0,14.73V21.7a1.269,1.269,0,0,0,1.268,1.268H3.28v2.7a.543.543,0,0,0,.543.543H14.146a.543.543,0,0,0,.543-.543v-2.7H16.7A1.269,1.269,0,0,0,17.97,21.7V14.73A1.269,1.269,0,0,0,16.7,13.463ZM4.367,10.72H13.6v2.743H4.367ZM13.6,25.12H4.367v-5.39H13.6ZM16.883,21.7a.184.184,0,0,1-.181.181H14.689V19.187a.543.543,0,0,0-.543-.543H3.824a.543.543,0,0,0-.543.543v2.695H1.268a.184.184,0,0,1-.181-.181V14.73a.183.183,0,0,1,.181-.181H16.7a.183.183,0,0,1,.181.181V21.7Z" />
				<circle id="Ellipse_59" data-name="Ellipse 59" cx="0.773" cy="0.773" r="0.773" transform="translate(13.373 15.824)" />
				<path id="Path_20859" data-name="Path 20859" d="M87.894,163.822H82.95a.543.543,0,1,0,0,1.087h4.944a.543.543,0,1,0,0-1.087Z" transform="translate(-76.437 -143.019)" />
				<path id="Path_20860" data-name="Path 20860" d="M87.894,193.623H82.95a.543.543,0,0,0,0,1.087h4.944a.543.543,0,0,0,0-1.087Z" transform="translate(-76.437 -170.662)" />
			</g>
		</svg>
	);
}
const Layout = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 17 17">
			<g id="layout" transform="translate(-5 -6)">
				<path id="Path_20877" data-name="Path 20877" d="M21.177,6H5.823A.847.847,0,0,0,5,6.869v5.818a.847.847,0,0,0,.823.869H21.177A.847.847,0,0,0,22,12.687V6.869A.847.847,0,0,0,21.177,6ZM5.895,12.611V6.944h4.474v5.667Zm15.211,0H11.263V6.944h9.842Z" />
				<path id="Path_20878" data-name="Path 20878" d="M22.472,11.944h6.611a.472.472,0,1,0,0-.944H22.472a.472.472,0,0,0,0,.944Z" transform="translate(-9.917 -2.639)" />
				<path id="Path_20879" data-name="Path 20879" d="M22.472,15.944H26.25a.472.472,0,0,0,0-.944H22.472a.472.472,0,0,0,0,.944Z" transform="translate(-9.546 -4.75)" />
				<path id="Path_20880" data-name="Path 20880" d="M21.177,26H5.823A.847.847,0,0,0,5,26.869v5.818a.847.847,0,0,0,.823.869H21.177A.847.847,0,0,0,22,32.687V26.869A.847.847,0,0,0,21.177,26ZM5.895,32.611V26.944h4.474v5.667Zm15.211,0H11.263V26.944h9.842Z" transform="translate(0 -10.556)" />
				<path id="Path_20881" data-name="Path 20881" d="M22.472,31.944h6.611a.472.472,0,1,0,0-.944H22.472a.472.472,0,1,0,0,.944Z" transform="translate(-9.917 -13.194)" />
				<path id="Path_20882" data-name="Path 20882" d="M22.472,35.944H26.25a.472.472,0,0,0,0-.944H22.472a.472.472,0,0,0,0,.944Z" transform="translate(-9.546 -15.306)" />
			</g>
		</svg>
	);
}
const Sorting = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 17 17">
			<path id="Union_25" data-name="Union 25" d="M10.268,17a.848.848,0,0,1-.823-.869V10.313a.848.848,0,0,1,.823-.869h5.909a.848.848,0,0,1,.823.869v5.818a.848.848,0,0,1-.823.869Zm.121-.944h5.667V10.389H10.389ZM.823,17A.848.848,0,0,1,0,16.131V10.313a.848.848,0,0,1,.823-.869H6.732a.848.848,0,0,1,.823.869v5.818A.848.848,0,0,1,6.732,17Zm.121-.944H6.611V10.389H.944Zm9.323-8.5a.848.848,0,0,1-.823-.869V.869A.848.848,0,0,1,10.268,0h5.909A.848.848,0,0,1,17,.869V6.687a.848.848,0,0,1-.823.869Zm.121-.944h5.667V.944H10.389ZM.823,7.556A.848.848,0,0,1,0,6.687V.869A.848.848,0,0,1,.823,0H6.732a.848.848,0,0,1,.823.869V6.687a.848.848,0,0,1-.823.869Zm.121-.944H6.611V.944H.944Z" />
		</svg>
	);
}
const PDF = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 28 32">
			<path id="pdf" d="M39.163,20.808H55.485a.438.438,0,0,1,0,.876H39.163a.438.438,0,0,1,0-.876Zm16.323,3.281H39.163a.438.438,0,0,0,0,.876H55.485a.438.438,0,0,0,0-.876ZM36.3,11.8H34.97v1.24H36.3a.62.62,0,0,0,0-1.24ZM55.485,27.371H39.163a.438.438,0,0,0,0,.875H55.485a.438.438,0,0,0,0-.875ZM41.067,14.184v-1.4a.976.976,0,0,0-.974-.976h-.974v3.357h.974a.977.977,0,0,0,.974-.978ZM59.18,9.395V29.316A2.684,2.684,0,0,1,56.5,32H38.144a2.683,2.683,0,0,1-2.676-2.684V18.009H32.11a.933.933,0,0,1-.93-.934V9.891a.933.933,0,0,1,.93-.934h3.358V2.686A2.684,2.684,0,0,1,38.144,0H49.819a.437.437,0,0,1,.308.128l8.925,8.957a.441.441,0,0,1,.128.309ZM36.3,13.92a1.5,1.5,0,0,0,0-2.991H34.534a.437.437,0,0,0-.436.437V15.6a.436.436,0,1,0,.872,0V13.92ZM58.308,9.833H51.063a1.686,1.686,0,0,1-1.681-1.687V.875H38.144a1.81,1.81,0,0,0-1.8,1.811V8.957H48.075a.933.933,0,0,1,.93.934v7.184a.933.933,0,0,1-.93.934H36.34V29.316a1.809,1.809,0,0,0,1.8,1.809H56.5a1.809,1.809,0,0,0,1.8-1.809Zm-19.626,6.2h1.41a1.852,1.852,0,0,0,1.846-1.853v-1.4a1.851,1.851,0,0,0-1.846-1.851h-1.41a.437.437,0,0,0-.436.438V15.6A.437.437,0,0,0,38.682,16.037Zm4.586-2.993V11.8h2.383a.438.438,0,0,0,0-.875H42.832a.437.437,0,0,0-.436.438V15.6a.436.436,0,1,0,.872,0V13.92h1.965a.438.438,0,0,0,0-.875Z" transform="translate(-31.18)" />
		</svg>
	);
}
const VideoLession = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 18 18">
			<g id="video-lesson" transform="translate(-2 -2)">
				<path id="Path_20918" data-name="Path 20918" d="M16.368,10.466a2.1,2.1,0,1,0-2.1-2.1A2.1,2.1,0,0,0,16.368,10.466Zm0-3a.9.9,0,1,1-.9.9A.9.9,0,0,1,16.368,7.468Z" transform="translate(-5.368 -1.868)" />
				<path id="Path_20919" data-name="Path 20919" d="M15.979,15.993a1.806,1.806,0,0,1,1.558.9l1.041-.6a3,3,0,0,0-5.2,0l1.041.6a1.806,1.806,0,0,1,1.558-.9Z" transform="translate(-4.979 -5.595)" />
				<path id="Path_20920" data-name="Path 20920" d="M19.122,2.877A2.981,2.981,0,0,0,17,2H5A3,3,0,0,0,2,5v8.4a3,3,0,0,0,3,3H9.155A5.316,5.316,0,0,1,8.3,18.762V18.8H7.4V20h7.2V18.8h-.877v-.034a5.316,5.316,0,0,1-.855-2.362h4.157A3,3,0,0,0,20,13.4V5a2.976,2.976,0,0,0-.878-2.121ZM12.327,18.8H9.672a6.5,6.5,0,0,0,.692-2.4h1.271a6.508,6.508,0,0,0,.692,2.4ZM18.8,13.4A1.8,1.8,0,0,1,17,15.2H5a1.8,1.8,0,0,1-1.8-1.8V5A1.8,1.8,0,0,1,5,3.2H17A1.8,1.8,0,0,1,18.8,5Z" transform="translate(0 0)" />
				<path id="Path_20921" data-name="Path 20921" d="M13.73,21.2h7.2v1.2h-7.2Z" transform="translate(-5.132 -8.4)" />
				<path id="Path_20922" data-name="Path 20922" d="M9.47,21.2h1.2v1.2H9.47Z" transform="translate(-3.268 -8.4)" />
			</g>
		</svg>
	);
}
const Certificate = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 18 18.285">
			<g id="certificate" transform="translate(-15.989)">
				<g id="Group_12689" data-name="Group 12689" transform="translate(18.561 0)">
					<g id="Group_12688" data-name="Group 12688">
						<path id="Path_20923" data-name="Path 20923" d="M95.389,5.539a.636.636,0,0,0-.139-.208L90.109.189A.652.652,0,0,0,89.653,0H81.3a1.288,1.288,0,0,0-1.286,1.286V6.071a.643.643,0,1,0,1.286,0V1.286h7.714V5.143A1.288,1.288,0,0,0,90.3,6.428h3.857v9.285H86.439a.643.643,0,1,0,0,1.286h7.714a1.288,1.288,0,0,0,1.286-1.286V5.785A.642.642,0,0,0,95.389,5.539Zm-5.092-.4V2.195l2.948,2.948Z" transform="translate(-80.011 0)" />
					</g>
				</g>
				<g id="Group_12691" data-name="Group 12691" transform="translate(15.989 8)">
					<g id="Group_12690" data-name="Group 12690">
						<path id="Path_20924" data-name="Path 20924" d="M22.4,233.487l-.985-3.951a3.214,3.214,0,1,0-4.423,0l-.985,3.951a.643.643,0,0,0,.912.73l2.285-1.142,2.283,1.142a.653.653,0,0,0,.288.068.644.644,0,0,0,.625-.8Zm-2.909-1.7a.645.645,0,0,0-.575,0l-1.323.661.55-2.209a2.991,2.991,0,0,0,2.12,0l.55,2.209Zm-.287-2.639a1.928,1.928,0,1,1,1.928-1.928A1.931,1.931,0,0,1,19.2,229.143Z" transform="translate(-15.989 -224)" />
					</g>
				</g>
				<g id="Group_12693" data-name="Group 12693" transform="translate(21.133 3.857)">
					<g id="Group_12692" data-name="Group 12692" transform="translate(0)">
						<path id="Path_20925" data-name="Path 20925" d="M148.511,96h-3.857a.643.643,0,0,0,0,1.286h3.857a.643.643,0,1,0,0-1.286Z" transform="translate(-144.011 -96)" />
					</g>
				</g>
				<g id="Group_12695" data-name="Group 12695" transform="translate(22.418 7.714)">
					<g id="Group_12694" data-name="Group 12694">
						<path id="Path_20926" data-name="Path 20926" d="M184.368,192h-7.714a.643.643,0,0,0,0,1.286h7.714a.643.643,0,0,0,0-1.286Z" transform="translate(-176.011 -192)" />
					</g>
				</g>
				<g id="Group_12697" data-name="Group 12697" transform="translate(23.704 11.571)">
					<g id="Group_12696" data-name="Group 12696">
						<path id="Path_20927" data-name="Path 20927" d="M215.082,288h-6.428a.643.643,0,0,0,0,1.286h6.428a.643.643,0,0,0,0-1.286Z" transform="translate(-208.011 -288)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const Prerequisites = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 18 19.286">
			<g id="Layer_2" data-name="Layer 2" transform="translate(-5 -1)">
				<path id="Path_20928" data-name="Path 20928" d="M22.814,5.044,18.956,1.186A.643.643,0,0,0,18.5,1H7.128A2.128,2.128,0,0,0,5,3.128v15.03a2.128,2.128,0,0,0,2.128,2.128H20.872A2.128,2.128,0,0,0,23,18.158V5.5a.643.643,0,0,0-.186-.456ZM19.143,3.192l1.665,1.665H19.143Zm2.571,14.966a.842.842,0,0,1-.842.842H7.128a.842.842,0,0,1-.842-.842V3.128a.842.842,0,0,1,.842-.842H17.857V5.5a.643.643,0,0,0,.643.643h3.214Z" transform="translate(0)" />
				<g id="Group_12699" data-name="Group 12699" transform="translate(8.188 7.429)">
					<path id="Path_20932" data-name="Path 20932" d="M12.743,19.2l-1.286,1.286-.4-.4a.643.643,0,1,0-.913.906l.861.855a.643.643,0,0,0,.906,0l1.716-1.71a.645.645,0,0,0-.913-.913Z" transform="translate(-9.959 -19.013)" />
					<path id="Path_20933" data-name="Path 20933" d="M23.786,19H18.643a.643.643,0,0,0,0,1.286h5.143a.643.643,0,1,0,0-1.286Z" transform="translate(-12.831 -19)" />
					<path id="Path_20934" data-name="Path 20934" d="M18.643,23.286h2.571a.643.643,0,0,0,0-1.286H18.643a.643.643,0,0,0,0,1.286Z" transform="translate(-12.831 -20.071)" />
				</g>
				<g id="Group_12698" data-name="Group 12698" transform="translate(8.188 13.214)">
					<path id="Path_20935" data-name="Path 20935" d="M12.743,26.2l-1.286,1.286-.4-.4a.643.643,0,1,0-.913.906l.861.855a.643.643,0,0,0,.906,0l1.716-1.71a.645.645,0,0,0-.913-.913Z" transform="translate(-9.959 -26.013)" />
					<path id="Path_20936" data-name="Path 20936" d="M23.786,26H18.643a.643.643,0,0,0,0,1.286h5.143a.643.643,0,1,0,0-1.286Z" transform="translate(-12.831 -26)" />
					<path id="Path_20937" data-name="Path 20937" d="M21.214,29H18.643a.643.643,0,0,0,0,1.286h2.571a.643.643,0,0,0,0-1.286Z" transform="translate(-12.831 -27.071)" />
				</g>
			</g>
		</svg>
	);
}
const Plus = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16.002 16">
			<path id="Union_29" data-name="Union 29" d="M7,16V9H0V7H7V0H9V7h7V9H9v7Z" />
		</svg>
	);
}
const Minus = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16 2">
			<path id="Union_26" data-name="Union 26" d="M-3330,7h-16V5h16Z" transform="translate(3346 -5)" />
		</svg>
	);
}
const ImportDoc = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 18 18">
			<g id="g2037" transform="translate(0 682.665)">
				<g id="g2039" transform="translate(0 -682.665)">
					<g id="g2041">
						<g id="g2047" transform="translate(0.563 9.035)">
							<path id="path2049" d="M-315.78-150.962a4.824,4.824,0,0,1-4.819-4.819,4.824,4.824,0,0,1,4.819-4.819,4.824,4.824,0,0,1,4.819,4.819A4.824,4.824,0,0,1-315.78-150.962Zm0-8.438a3.623,3.623,0,0,0-3.619,3.619,3.623,3.623,0,0,0,3.619,3.619,3.623,3.623,0,0,0,3.619-3.619A3.623,3.623,0,0,0-315.78-159.4Z" transform="translate(319.999 160)" />
						</g>
						<g id="g2051" transform="translate(4.781 0.527)">
							<path id="path2053" d="M11.6-625.12H0a.6.6,0,0,1-.6-.6.6.6,0,0,1,.6-.6H11.6a.455.455,0,0,0,.455-.455V-638.9l-3.164-3.164H1.055a.455.455,0,0,0-.455.455v7.453a.6.6,0,0,1-.6.6.6.6,0,0,1-.6-.6v-7.453a1.657,1.657,0,0,1,1.655-1.655H9.141a.6.6,0,0,1,.424.176l3.515,3.516a.6.6,0,0,1,.176.424v12.375A1.657,1.657,0,0,1,11.6-625.12Z" transform="translate(0 642.665)" />
						</g>
						<g id="g2055" transform="translate(13.922 0.527)">
							<path id="path2057" d="M0-.6a.6.6,0,0,1,.424.176L3.94,3.091a.6.6,0,0,1-.424,1.024H0a.6.6,0,0,1-.6-.6V0A.6.6,0,0,1-.23-.554.6.6,0,0,1,0-.6ZM2.067,2.916.6,1.449V2.916Z" />
						</g>
						<g id="g2059" transform="translate(7.571 10.09)">
							<path id="path2061" d="M7.405.6H0A.6.6,0,0,1-.6,0,.6.6,0,0,1,0-.6H7.405a.6.6,0,0,1,.6.6A.6.6,0,0,1,7.405.6Z" />
						</g>
						<g id="g2063" transform="translate(7.242 6.926)">
							<path id="path2065" d="M7.734.6H0A.6.6,0,0,1-.6,0,.6.6,0,0,1,0-.6H7.734a.6.6,0,0,1,.6.6A.6.6,0,0,1,7.734.6Z" />
						</g>
						<g id="g2067" transform="translate(9 13.254)">
							<path id="path2069" d="M5.977.6H0A.6.6,0,0,1-.6,0,.6.6,0,0,1,0-.6H5.977a.6.6,0,0,1,.6.6A.6.6,0,0,1,5.977.6Z" />
						</g>
					</g>
				</g>
				<path id="Path_23763" data-name="Path 23763" d="M182.8,254.4l-1.767-1.767.623-.623,1.016,1.012v-3.015h.884v3.015l1.012-1.012.623.623-1.767,1.767A.442.442,0,0,1,182.8,254.4Z" transform="translate(-178.565 -922.051)" />
			</g>
		</svg>
	);
}
const Grade = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 37.8 36">
			<g id="_11-grade" data-name="11-grade" transform="translate(-4 -28)">
				<path id="Path_28929" data-name="Path 28929" d="M38.5,28H12.1a3.3,3.3,0,0,0-3.3,3.3V57.4H4.9a.9.9,0,0,0-.9.9v2.4A3.3,3.3,0,0,0,7.3,64H33.7A3.3,3.3,0,0,0,37,60.7V35.8h3.9a.9.9,0,0,0,.9-.9V31.3A3.3,3.3,0,0,0,38.5,28ZM7.3,62.2a1.5,1.5,0,0,1-1.5-1.5V59.2H30.4v1.5a3.28,3.28,0,0,0,.361,1.5Zm27.9-1.5a1.5,1.5,0,1,1-3,0V58.3a.9.9,0,0,0-.9-.9H10.6V31.3a1.5,1.5,0,0,1,1.5-1.5H35.561a3.28,3.28,0,0,0-.361,1.5ZM40,34H37V31.3a1.5,1.5,0,1,1,3,0Z" />
				<path id="Path_28930" data-name="Path 28930" d="M148.7,164a8.7,8.7,0,1,0,8.7,8.7A8.7,8.7,0,0,0,148.7,164Zm0,15.6a6.9,6.9,0,1,1,6.9-6.9A6.9,6.9,0,0,1,148.7,179.6Z" transform="translate(-125.8 -125.8)" />
				<path id="Path_28931" data-name="Path 28931" d="M214.474,220.424a3.3,3.3,0,0,0-3.3,3.3v4.8a.9.9,0,1,0,1.8,0v-1.5h3v1.5a.9.9,0,1,0,1.8,0v-4.8A3.3,3.3,0,0,0,214.474,220.424Zm1.5,4.8h-3v-1.5a1.5,1.5,0,1,1,3,0Z" transform="translate(-191.636 -177.992)" />
				<path id="Path_28932" data-name="Path 28932" d="M314.7,78.4h-1.5V76.9a.9.9,0,1,0-1.8,0v1.5h-1.5a.9.9,0,0,0,0,1.8h1.5v1.5a.9.9,0,1,0,1.8,0V80.2h1.5a.9.9,0,1,0,0-1.8Z" transform="translate(-282.125 -44.4)" />
				<path id="Path_28933" data-name="Path 28933" d="M116.9,77.8h12a.9.9,0,1,0,0-1.8h-12a.9.9,0,0,0,0,1.8Z" transform="translate(-103.6 -44.4)" />
				<path id="Path_28934" data-name="Path 28934" d="M123.2,124.9a.9.9,0,0,0-.9-.9h-5.4a.9.9,0,0,0,0,1.8h5.4a.9.9,0,0,0,.9-.9Z" transform="translate(-103.6 -88.8)" />
			</g>
		</svg>
	);
}
const Architecture = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 45.873 45.48">
			<g id="architecture" transform="translate(-2 -2.171)">
				<path id="Path_4774" data-name="Path 4774" d="M10.647,8A1.147,1.147,0,0,0,9.5,9.147V11.44a1.147,1.147,0,0,0,1.147,1.147H12.94a1.147,1.147,0,0,0,1.147-1.147V9.147A1.147,1.147,0,0,0,12.94,8Z" transform="translate(9.702 7.54)" />
				<path id="Path_4775" data-name="Path 4775" d="M9.5,12.147A1.147,1.147,0,0,1,10.647,11H12.94a1.147,1.147,0,0,1,1.147,1.147V14.44a1.147,1.147,0,0,1-1.147,1.147H10.647A1.147,1.147,0,0,1,9.5,14.44Z" transform="translate(9.702 11.421)" />
				<path id="Path_4776" data-name="Path 4776" d="M10.647,14A1.147,1.147,0,0,0,9.5,15.147V17.44a1.147,1.147,0,0,0,1.147,1.147H12.94a1.147,1.147,0,0,0,1.147-1.147V15.147A1.147,1.147,0,0,0,12.94,14Z" transform="translate(9.702 15.302)" />
				<path id="Path_4777" data-name="Path 4777" d="M12.5,9.147A1.147,1.147,0,0,1,13.647,8H15.94a1.147,1.147,0,0,1,1.147,1.147V11.44a1.147,1.147,0,0,1-1.147,1.147H13.647A1.147,1.147,0,0,1,12.5,11.44Z" transform="translate(13.583 7.54)" />
				<path id="Path_4778" data-name="Path 4778" d="M13.647,11A1.147,1.147,0,0,0,12.5,12.147V14.44a1.147,1.147,0,0,0,1.147,1.147H15.94a1.147,1.147,0,0,0,1.147-1.147V12.147A1.147,1.147,0,0,0,15.94,11Z" transform="translate(13.583 11.421)" />
				<path id="Path_4779" data-name="Path 4779" d="M12.5,15.147A1.147,1.147,0,0,1,13.647,14H15.94a1.147,1.147,0,0,1,1.147,1.147V17.44a1.147,1.147,0,0,1-1.147,1.147H13.647A1.147,1.147,0,0,1,12.5,17.44Z" transform="translate(13.583 15.302)" />
				<path id="Path_4780" data-name="Path 4780" d="M12.321,4.467a2.294,2.294,0,0,1,2.953-2.2L35.917,8.462a2.294,2.294,0,0,1,1.635,2.2v5.362l6.872,3.927a2.294,2.294,0,0,1,1.156,1.992V45.358h1.147a1.147,1.147,0,0,1,0,2.294H3.147a1.147,1.147,0,1,1,0-2.294H4.294v-34.4A2.294,2.294,0,0,1,6.587,8.659h5.734ZM43.286,45.358V21.94l-5.734-3.277V45.358ZM35.258,16.665q0,.021,0,.042v28.65H29.524V39.624A2.294,2.294,0,0,0,27.23,37.33H22.643a2.294,2.294,0,0,0-2.294,2.294v5.734H14.615V4.467l20.643,6.193ZM12.321,45.358H6.587v-34.4h5.734Zm10.321,0H27.23V39.624H22.643Z" transform="translate(0 0)" fillRule="evenodd" />
			</g>
		</svg>
	);
}
const Manager = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 44.745 45">
			<g id="manager" transform="translate(-4.74 -3.006)">
				<path id="Path_22407" data-name="Path 22407" d="M5.729,76.334H48.5a.979.979,0,0,0,.989-.969V70.581a7.8,7.8,0,0,0-3.267-6.3c-3.875-2.777-7.054-4.4-9.669-4.91a.923.923,0,0,0-.267-.349l-2.348-1.89a1,1,0,0,0-1.3.034l-5.526,4.944L21.586,57.15a1,1,0,0,0-1.3-.034l-2.348,1.89a.923.923,0,0,0-.267.349c-2.615.528-5.793,2.147-9.664,4.929a7.785,7.785,0,0,0-3.272,6.3v4.779a.979.979,0,0,0,.989.969ZM27.113,64.672l2.674,2.152-1.429,1.755H25.887l-1.429-1.764Zm-1.028,5.845h2.056L29.584,74.4H24.641Zm21.424.053V74.4H31.69l-1.73-4.663,1.359-1.682.554.446a1,1,0,0,0,.628.223,1.128,1.128,0,0,0,.252-.034.982.982,0,0,0,.667-.591l2.7-6.849c2.313.485,5.309,2.007,8.9,4.6a5.85,5.85,0,0,1,2.486,4.736ZM33.341,59.147l1.137.911-2.422,6.1L28.6,63.383Zm-12.457,0,4.745,4.231-3.46,2.777-2.422-6.1ZM6.717,70.581A5.849,5.849,0,0,1,9.189,65.85c3.613-2.593,6.609-4.135,8.9-4.6l2.719,6.844a.982.982,0,0,0,.672.586,1.127,1.127,0,0,0,.252.034,1,1,0,0,0,.628-.223l.554-.446,1.359,1.682L22.54,74.4H6.722Z" transform="translate(0 -28.328)" />
				<path id="Path_22408" data-name="Path 22408" d="M26.3,14.355a12.925,12.925,0,0,0,.839,5.211A12.76,12.76,0,0,0,27.88,24.6c1.08,2.908,5.408,6.117,7.846,6.408h1.123C39.259,30.718,43.6,27.5,44.7,24.6a12.737,12.737,0,0,0,.728-5.225v-.834a14.705,14.705,0,0,0,.815-6.868,9.992,9.992,0,0,0-9.08-8.55c-6.029-.737-7.928,2.133-9.157,4.033a6.742,6.742,0,0,1-1.022,1.318c-1.831,1.551-3.147,2.874-3.2,2.908a.968.968,0,0,0,.063,1.43A12.487,12.487,0,0,0,26.3,14.355Zm16.6,9.563c-.8,2.123-4.415,4.9-6.227,5.157H35.9c-1.812-.257-5.417-3.034-6.222-5.157a10.846,10.846,0,0,1-.607-4.4v-.039a.093.093,0,0,0,0-.039s.164-2.724,1.807-3.776a12.767,12.767,0,0,0,2.892,0,13.16,13.16,0,0,0,6.719-2.511c1.224.717,2.169,2.394,3.017,5.3v.969a1.016,1.016,0,0,0,0,.121,10.9,10.9,0,0,1-.612,4.367ZM28.213,9.959A8.115,8.115,0,0,0,29.6,8.233c1.166-1.774,2.492-3.776,7.345-3.184,6.747.824,7.374,6.636,7.4,6.883a1.228,1.228,0,0,0,0,.131A8.993,8.993,0,0,1,44.31,15a6.8,6.8,0,0,0-3.687-3.921.984.984,0,0,0-1.055.281s-1.619,1.822-6.029,2.37a10.711,10.711,0,0,1-2.728,0,.959.959,0,0,0-.554.1,4.908,4.908,0,0,0-2.01,1.915,12.674,12.674,0,0,1,0-1.9.97.97,0,0,0-.588-.969,13.019,13.019,0,0,1-1.706-.882C26.516,11.451,27.3,10.729,28.213,9.959Z" transform="translate(-9.23 0)" />
			</g>
		</svg>

	);
}
const Mail = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 80 80">
			<g id="Group_13769" data-name="Group 13769" transform="translate(-933 -182)">
				<g id="mail" transform="translate(951 131)">
					<g id="Group_13762" data-name="Group 13762" transform="translate(29.677 78.167)">
						<g id="Group_13761" data-name="Group 13761">
							<path id="Path_22415" data-name="Path 22415" d="M365.295,101.721l-13.084,13,13.084,13a3.748,3.748,0,0,0,.38-1.624v-22.75A3.748,3.748,0,0,0,365.295,101.721Z" transform="translate(-352.211 -101.721)" />
						</g>
					</g>
					<g id="Group_13764" data-name="Group 13764" transform="translate(2.167 76)">
						<g id="Group_13763" data-name="Group 13763">
							<path id="Path_22416" data-name="Path 22416" d="M62.9,76H27.345a3.748,3.748,0,0,0-1.624.38L42.443,93.018a3.8,3.8,0,0,0,5.362,0L64.527,76.38A3.748,3.748,0,0,0,62.9,76Z" transform="translate(-25.721 -76)" />
						</g>
					</g>
					<g id="Group_13766" data-name="Group 13766" transform="translate(0 78.167)">
						<g id="Group_13765" data-name="Group 13765">
							<path id="Path_22417" data-name="Path 22417" d="M.38,101.721A3.748,3.748,0,0,0,0,103.345V126.1a3.747,3.747,0,0,0,.38,1.624l13.084-13Z" transform="translate(0 -101.721)" />
						</g>
					</g>
					<g id="Group_13768" data-name="Group 13768" transform="translate(2.167 92.954)">
						<g id="Group_13767" data-name="Group 13767">
							<path id="Path_22418" data-name="Path 22418" d="M51.444,277.211l-1.851,1.851a6.326,6.326,0,0,1-8.936,0L38.8,277.211l-13.084,13a3.748,3.748,0,0,0,1.624.38H62.9a3.748,3.748,0,0,0,1.624-.38Z" transform="translate(-25.721 -277.211)" />
						</g>
					</g>
				</g>
			</g>
		</svg>
	);
}
const Lender = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 46.738 45">
			<path id="lender" d="M46.729,40.877a.732.732,0,0,0-.291-.477L32.786,30.445a.73.73,0,0,0-.861,0l-2.465,1.8V32.02a.73.73,0,0,0-.73-.73H23.49a.73.73,0,0,0-.73.73v.527a4.378,4.378,0,0,1-.346-.477V31.01a8.11,8.11,0,0,0,2.911-4.889h.439A2.22,2.22,0,0,0,27.983,23.9V21.687A2.219,2.219,0,0,0,26.495,19.6V16.763A7.255,7.255,0,0,0,19.244,9.52H15.424a7.255,7.255,0,0,0-7.251,7.243V19.6a2.219,2.219,0,0,0-1.488,2.092v2.217A2.22,2.22,0,0,0,8.9,26.122h.439a8.113,8.113,0,0,0,2.911,4.889v1.061c-1.129,1.783-3,2.016-4.512,2.016-4.558,0-7.742,3.62-7.742,8.8V48.5a.73.73,0,0,0,.73.73H22.224V53.79a.73.73,0,0,0,.73.73h18.8a.73.73,0,0,0,.73-.73V42.8l1.435,1.046a.73.73,0,0,0,1.021-.159L46.6,41.421a.732.732,0,0,0,.131-.544ZM18.511,35.846l3.02-2.5a5.371,5.371,0,0,0,.976.961l-1.633,3.326Zm-1.176-.923L13.762,31.97a8.115,8.115,0,0,0,7.146,0Zm-4.2-1.572,3.019,2.495-2.364,1.792-1.629-3.323A5.426,5.426,0,0,0,13.14,33.351Zm4.2,3.436,1.232.935a1.344,1.344,0,0,1-2.465,0Zm0,3.2h.034l1.566,7.784h-3.2L17.3,39.988Zm1.442-.4a2.811,2.811,0,0,0,.969-.973l.477.361-1.368,1Zm4.761-4.068V36.56l-.794.579ZM25,34.815h.933L25,35.5Zm-.779-2.065H28v.557l-.065.047H24.221Zm2.3-8.845a.758.758,0,0,1-.758.756h-.312V20.932h.312a.757.757,0,0,1,.758.756Zm-11.1-12.925h3.819a5.793,5.793,0,0,1,5.79,5.782v1.449h-.312a4.844,4.844,0,0,1-4.7-2.614.729.729,0,0,0-1.01-.26c-3.379,2.042-6,2.875-9.062,2.875H9.636V16.763a5.791,5.791,0,0,1,5.789-5.782ZM8.147,23.906V21.688a.758.758,0,0,1,.758-.756h.312v3.729H8.9A.758.758,0,0,1,8.147,23.906Zm2.53.785V19.655a17.644,17.644,0,0,0,8.472-2.707,6.083,6.083,0,0,0,4.843,2.695v5.047a6.657,6.657,0,0,1-13.315,0Zm-9.217,18.2c0-3.655,1.943-7.343,6.282-7.343a8.445,8.445,0,0,0,3.148-.517l1.983,4.044a.728.728,0,0,0,.487.389.706.706,0,0,0,.169.02.73.73,0,0,0,.441-.148l.952-.721a2.808,2.808,0,0,0,.97.974l-1.647,8.183H6.3V44.859a.73.73,0,0,0-1.461,0v2.914H1.461Zm18.964,4.88-.885-4.4.231.317a.729.729,0,0,0,1.02.159L22.224,42.8v4.972Zm9.4,5.287V45.6h5.055v7.463Zm11.2,0H36.344V44.867a.73.73,0,0,0-.73-.73H29.2a.728.728,0,0,0-.831.723v8.2H23.687V41.735l8.67-6.322,8.67,6.322V53.059Zm3.166-10.823L32.786,33.919a.73.73,0,0,0-.861,0L20.519,42.237l-.794-1.087,12.631-9.211,12.631,9.211Zm-30.9-19.657V21.215a.73.73,0,0,1,1.461,0v1.365a.73.73,0,0,1-1.461,0Zm6.619,0V21.215a.73.73,0,0,1,1.461,0v1.365a.73.73,0,0,1-1.461,0ZM16.152,25.42a1.088,1.088,0,0,1-.264-.857s0-.008,0-.013l.381-2.773a.73.73,0,0,1,1.447.2l-.323,2.357h.665a.73.73,0,1,1,0,1.461H16.975A1.075,1.075,0,0,1,16.152,25.42Zm-.857,1.5a2.2,2.2,0,0,0,2.04,1.186,2.2,2.2,0,0,0,2.04-1.186.73.73,0,1,1,1.338.586,3.8,3.8,0,0,1-6.757,0,.73.73,0,1,1,1.338-.586Z" transform="translate(0 -9.52)" />
		</svg>
	);
}
const Worker = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 37.308 45.48">
			<g id="worker" transform="translate(-46)">
				<g id="Group_13753" data-name="Group 13753" transform="translate(72.648 38.107)">
					<g id="Group_13752" data-name="Group 13752">
						<path id="Path_22409" data-name="Path 22409" d="M346.888,429a.888.888,0,1,0,.888.888A.889.889,0,0,0,346.888,429Z" transform="translate(-346 -429)" />
					</g>
				</g>
				<g id="Group_13755" data-name="Group 13755" transform="translate(54.883 38.107)">
					<g id="Group_13754" data-name="Group 13754">
						<path id="Path_22410" data-name="Path 22410" d="M146.888,429a.888.888,0,1,0,.888.888A.889.889,0,0,0,146.888,429Z" transform="translate(-146 -429)" />
					</g>
				</g>
				<g id="Group_13757" data-name="Group 13757" transform="translate(46)">
					<g id="Group_13756" data-name="Group 13756">
						<path id="Path_22411" data-name="Path 22411" d="M81.677,33.507a10.038,10.038,0,0,0-3.984-3.572.884.884,0,0,0-.5-.232,9.292,9.292,0,0,0-3.653-.745H70.872V26.614a10.189,10.189,0,0,0,3.188-5.029h.365a3.551,3.551,0,0,0,2.61-5.961c.056-.047.11-.1.163-.149a2.664,2.664,0,0,0-1.026-4.406A9.8,9.8,0,0,0,69.043,2.4,2.826,2.826,0,0,0,66.43,0H62.877a2.826,2.826,0,0,0-2.613,2.4,9.8,9.8,0,0,0-7.128,8.668,2.663,2.663,0,0,0-.863,4.556,3.551,3.551,0,0,0,2.609,5.962h.362a10.21,10.21,0,0,0,2.487,4.364c.223.233.46.454.7.664v2.344H55.771a9.293,9.293,0,0,0-3.653.745.884.884,0,0,0-.5.232A10.178,10.178,0,0,0,46,39v5.6a.888.888,0,0,0,.888.888H82.42a.888.888,0,0,0,.888-.888V39A10.1,10.1,0,0,0,81.677,33.507ZM51.33,43.7H47.777V39a8.486,8.486,0,0,1,3.553-6.829Zm23.1-23.895h-.04c.026-.3.04-.592.04-.888V16.256a1.777,1.777,0,1,1,0,3.553ZM60.212,4.276V8.261a.888.888,0,1,0,1.777,0V2.931c0-.55.465-1.155.888-1.155H66.43c.423,0,.888.6.888,1.155v5.33a.888.888,0,1,0,1.777,0V4.276a8.03,8.03,0,0,1,5.28,6.65H54.932A8.03,8.03,0,0,1,60.212,4.276Zm-5.33,15.533a1.777,1.777,0,1,1,0-3.553V18.92c0,.3.014.593.041.888Zm0-5.33h-.888a.888.888,0,0,1,0-1.777H75.313a.888.888,0,0,1,0,1.777H54.883Zm1.938,6.057c0-.01,0-.019-.006-.029a8.193,8.193,0,0,1-.156-1.586V16.256H72.648V18.92a8.2,8.2,0,0,1-.156,1.586c0,.01,0,.019-.006.029a8.415,8.415,0,0,1-3.1,5,7.626,7.626,0,0,1-9.477,0,8.232,8.232,0,0,1-.9-.811A8.424,8.424,0,0,1,56.821,20.536ZM63.766,43.7H56.659V41.66a.888.888,0,1,0-1.777,0V43.7H53.106V31.221a7.519,7.519,0,0,1,1.777-.434v5.544a.888.888,0,0,0,1.777,0v-5.6h2.284L63.766,35.8ZM60.212,29.491V27.836a9.355,9.355,0,0,0,8.883,0v1.654l-4.441,4.663ZM76.2,43.7H74.425V41.66a.888.888,0,1,0-1.777,0V43.7H65.542V35.8l4.822-5.063h2.284v5.6a.888.888,0,1,0,1.777,0V30.787a7.52,7.52,0,0,1,1.777.434Zm5.33,0H77.978V32.167A8.486,8.486,0,0,1,81.531,39Z" transform="translate(-46)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const NewDocument = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 38.208 45">
			<g id="new-document" transform="translate(0 8)">
				<path id="Path_22412" data-name="Path 22412" d="M29.215,16.839V2.711a1.117,1.117,0,0,0-.328-.791L19.3-7.672A1.12,1.12,0,0,0,18.5-8H1.119A1.119,1.119,0,0,0,0-6.88V35.881A1.119,1.119,0,0,0,1.119,37H28.1a10.111,10.111,0,0,0,1.119-20.161ZM19.624-4.178l5.77,5.77h-5.77ZM2.239,34.762V-5.761H17.385V2.711A1.119,1.119,0,0,0,18.5,3.83h8.472V16.839a10.107,10.107,0,0,0-5.218,17.922Zm25.857,0a7.873,7.873,0,1,1,7.873-7.873A7.882,7.882,0,0,1,28.1,34.762Zm0,0" />
				<path id="Path_22413" data-name="Path 22413" d="M328.45,324.33h-1.878v-1.878a1.119,1.119,0,1,0-2.239,0v1.878h-1.878a1.119,1.119,0,1,0,0,2.239h1.878v1.878a1.119,1.119,0,1,0,2.239,0v-1.878h1.878a1.119,1.119,0,1,0,0-2.239Zm0,0" transform="translate(-297.356 -298.56)" />
			</g>
		</svg>
	);
}
const Attachment = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 13.978 12.628">
			<g id="Layer_2" data-name="Layer 2" transform="translate(-0.988 -2.055)">
				<path id="Path_22414" data-name="Path 22414" d="M4.638,14.683a3.649,3.649,0,0,1-2.58-6.23L7.444,3.066a.476.476,0,0,1,.673.673L2.731,9.125a2.7,2.7,0,1,0,3.815,3.812L13.5,5.981a1.746,1.746,0,1,0-2.469-2.469L5.424,9.125a.793.793,0,0,0,1.122,1.122l3.589-3.59a.476.476,0,1,1,.673.673l-3.59,3.591A1.746,1.746,0,0,1,4.75,8.452l5.611-5.607A2.7,2.7,0,0,1,14.176,6.66L7.22,13.614a3.627,3.627,0,0,1-2.581,1.069Z" />
			</g>
		</svg>
	);
}
const File = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 16.525 18">
			<g id="_x31_45_x2C__csv_x2C__file_type_x2C__file_format_x2C__file_extension_x2C__document" transform="translate(-35.85 -15.85)">
				<g id="XMLID_1_" transform="translate(35.85 15.85)">
					<g id="XMLID_2791_" transform="translate(0 6.827)">
						<path id="XMLID_2710_" d="M49.062,214.249H38a2.021,2.021,0,0,1-2-2.037v-5.837a.368.368,0,1,1,.736,0v5.837A1.277,1.277,0,0,0,38,213.5H49.062a.558.558,0,0,0,.552-.562v-4.5a.558.558,0,0,0-.552-.562H39.312a.375.375,0,0,1,0-.75h9.751a1.3,1.3,0,0,1,1.288,1.312v4.5A1.3,1.3,0,0,1,49.062,214.249Z" transform="translate(-35.85 -205.85)" />
						<path id="XMLID_2710__-_Outline" data-name="XMLID_2710_ - Outline" d="M49.064,214.4H38a2.17,2.17,0,0,1-2.147-2.187v-5.837a.515.515,0,1,1,1.031,0v5.837A1.128,1.128,0,0,0,38,213.349H49.064a.409.409,0,0,0,.4-.412v-4.5a.409.409,0,0,0-.4-.412H39.31a.525.525,0,0,1,0-1.05h9.754a1.451,1.451,0,0,1,1.436,1.462v4.5A1.451,1.451,0,0,1,49.064,214.4Zm-12.7-8.249a.223.223,0,0,0-.221.225v5.837A1.872,1.872,0,0,0,38,214.1H49.064a1.153,1.153,0,0,0,1.141-1.162v-4.5a1.153,1.153,0,0,0-1.141-1.162H39.31a.225.225,0,0,0,0,.45h9.754a.707.707,0,0,1,.7.712v4.5a.707.707,0,0,1-.7.712H38a1.426,1.426,0,0,1-1.411-1.437v-5.837A.223.223,0,0,0,36.365,206.15Z" transform="translate(-35.85 -205.85)" />
					</g>
					<g id="XMLID_2789_" transform="translate(0 5.88)">
						<path id="XMLID_2709_" d="M39.374,179H37.5a1.5,1.5,0,0,1,0-3h1.875a.375.375,0,0,1,0,.75H37.5a.75.75,0,0,0,0,1.5h1.875a.375.375,0,0,1,0,.75Z" transform="translate(-35.85 -175.85)" />
						<path id="XMLID_2709__-_Outline" data-name="XMLID_2709_ - Outline" d="M39.374,179.15H37.5a1.65,1.65,0,0,1,0-3.3h1.875a.525.525,0,0,1,0,1.05H37.5a.6.6,0,0,0,0,1.2h1.875a.525.525,0,0,1,0,1.05Zm-1.875-3a1.35,1.35,0,0,0,0,2.7h1.875a.225.225,0,0,0,0-.45H37.5a.9.9,0,0,1,0-1.8h1.875a.225.225,0,0,0,0-.45Z" transform="translate(-35.85 -175.85)" />
					</g>
					<g id="XMLID_2787_" transform="translate(3 0)">
						<path id="XMLID_2708_" d="M127.756,33.7H117.469A1.474,1.474,0,0,1,116,32.225V30.75a.367.367,0,1,1,.735,0v1.475a.737.737,0,0,0,.735.737h10.286a.737.737,0,0,0,.735-.737V19.471l-2.724-2.734h-8.3a.737.737,0,0,0-.735.738v7.006a.367.367,0,1,1-.735,0V17.475A1.474,1.474,0,0,1,117.469,16h8.449a.367.367,0,0,1,.26.108l2.939,2.95a.37.37,0,0,1,.108.261V32.225A1.474,1.474,0,0,1,127.756,33.7Z" transform="translate(-115.85 -15.85)" />
						<path id="XMLID_2708__-_Outline" data-name="XMLID_2708_ - Outline" d="M127.758,33.85H117.467a1.622,1.622,0,0,1-1.617-1.623V30.752a.515.515,0,1,1,1.029,0v1.475a.59.59,0,0,0,.588.59h10.291a.59.59,0,0,0,.588-.59v-12.7l-2.639-2.648h-8.24a.59.59,0,0,0-.588.59v7.008a.515.515,0,1,1-1.029,0V17.473a1.622,1.622,0,0,1,1.617-1.623h8.453a.51.51,0,0,1,.364.151l2.94,2.951a.514.514,0,0,1,.151.365v12.91A1.622,1.622,0,0,1,127.758,33.85Zm-11.393-3.32a.221.221,0,0,0-.22.221v1.475a1.327,1.327,0,0,0,1.323,1.328h10.291a1.327,1.327,0,0,0,1.323-1.328V19.317a.223.223,0,0,0-.065-.156l-2.94-2.951a.219.219,0,0,0-.156-.065h-8.453a1.327,1.327,0,0,0-1.323,1.328v7.008a.22.22,0,1,0,.441,0V17.473a.885.885,0,0,1,.882-.885h8.362l2.811,2.821V32.227a.885.885,0,0,1-.882.885H117.467a.885.885,0,0,1-.882-.885V30.752A.221.221,0,0,0,116.365,30.53Z" transform="translate(-115.85 -15.85)" />
					</g>
					<g id="XMLID_2785_" transform="translate(12.475 0.375)">
						<path id="XMLID_2707_" d="M379,29.374h-2.625A.375.375,0,0,1,376,29V26.375a.375.375,0,0,1,.75,0v2.25H379a.375.375,0,1,1,0,.75Z" transform="translate(-375.85 -25.85)" />
						<path id="XMLID_2707__-_Outline" data-name="XMLID_2707_ - Outline" d="M379,29.524h-2.625A.526.526,0,0,1,375.85,29V26.375a.525.525,0,1,1,1.05,0v2.1H379a.525.525,0,0,1,0,1.05Zm-2.625-3.374a.225.225,0,0,0-.225.225V29a.225.225,0,0,0,.225.225H379a.225.225,0,1,0,0-.45h-2.4v-2.4A.225.225,0,0,0,376.375,26.15Z" transform="translate(-375.85 -25.85)" />
					</g>
					<g id="XMLID_2180_" transform="translate(4.77 2.625)">
						<path id="XMLID_2706_" d="M169.374,86.75h-3a.375.375,0,0,1,0-.75h3a.375.375,0,0,1,0,.75Z" transform="translate(-165.85 -85.85)" />
						<path id="XMLID_2706__-_Outline" data-name="XMLID_2706_ - Outline" d="M169.374,86.9h-3a.525.525,0,0,1,0-1.05h3a.525.525,0,0,1,0,1.05Zm-3-.75a.225.225,0,0,0,0,.45h3a.225.225,0,0,0,0-.45Z" transform="translate(-165.85 -85.85)" />
					</g>
					<g id="XMLID_2178_" transform="translate(4.738 4.053)">
						<path id="XMLID_2705_" d="M172.374,126.75h-6a.375.375,0,0,1,0-.75h6a.375.375,0,0,1,0,.75Z" transform="translate(-165.85 -125.85)" />
						<path id="XMLID_2705__-_Outline" data-name="XMLID_2705_ - Outline" d="M172.374,126.9h-6a.525.525,0,0,1,0-1.05h6a.525.525,0,0,1,0,1.05Zm-6-.75a.225.225,0,1,0,0,.45h6a.225.225,0,1,0,0-.45Z" transform="translate(-165.85 -125.85)" />
					</g>
					<g id="XMLID_8_" transform="translate(4.738 5.527)">
						<path id="XMLID_2704_" d="M172.374,166.75h-6a.375.375,0,0,1,0-.75h6a.375.375,0,0,1,0,.75Z" transform="translate(-165.85 -165.85)" />
						<path id="XMLID_2704__-_Outline" data-name="XMLID_2704_ - Outline" d="M172.374,166.9h-6a.525.525,0,1,1,0-1.05h6a.525.525,0,1,1,0,1.05Zm-6-.75a.225.225,0,1,0,0,.45h6a.225.225,0,1,0,0-.45Z" transform="translate(-165.85 -165.85)" />
					</g>
					<g id="XMLID_6_" transform="translate(3.126 9.912)">
						<path id="XMLID_2703_" d="M122.875,289.749a1.875,1.875,0,0,1,0-3.749.375.375,0,0,1,0,.75,1.125,1.125,0,1,0,0,2.25.375.375,0,0,1,0,.75Z" transform="translate(-120.85 -285.85)" />
						<path id="XMLID_2703__-_Outline" data-name="XMLID_2703_ - Outline" d="M122.875,289.9a2.025,2.025,0,1,1,0-4.049.525.525,0,1,1,0,1.05.975.975,0,0,0,0,1.95.525.525,0,1,1,0,1.05Zm0-3.749a1.725,1.725,0,0,0,0,3.449.225.225,0,0,0,0-.45,1.275,1.275,0,1,1,0-2.55.225.225,0,0,0,0-.45Z" transform="translate(-120.85 -285.85)" />
					</g>
					<g id="XMLID_4_" transform="translate(9.184 9.912)">
						<path id="XMLID_2702_" d="M287.5,289.746a.375.375,0,0,1-.351-.243l-1.125-3a.375.375,0,1,1,.7-.263l.774,2.063.774-2.063a.375.375,0,1,1,.7.263l-1.125,3A.375.375,0,0,1,287.5,289.746Z" transform="translate(-285.848 -285.847)" />
						<path id="XMLID_2702__-_Outline" data-name="XMLID_2702_ - Outline" d="M287.5,289.9a.527.527,0,0,1-.492-.341l-1.125-3a.525.525,0,1,1,.983-.369l.633,1.689.633-1.689a.525.525,0,0,1,.676-.307.525.525,0,0,1,.307.676l-1.125,3A.528.528,0,0,1,287.5,289.9Zm-1.125-3.75a.225.225,0,0,0-.211.3l1.125,3a.225.225,0,0,0,.421,0l1.125-3a.225.225,0,0,0-.211-.3.226.226,0,0,0-.211.146l-.914,2.438-.914-2.438A.226.226,0,0,0,286.373,286.147Z" transform="translate(-285.848 -285.847)" />
					</g>
					<g id="XMLID_2_" transform="translate(5.881 9.912)">
						<path id="XMLID_2701_" d="M197.5,289.749h-1.125a.375.375,0,0,1,0-.75H197.5a.375.375,0,1,0,0-.75h-.375a1.125,1.125,0,0,1,0-2.25h1.125a.375.375,0,0,1,0,.75h-1.125a.375.375,0,1,0,0,.75h.375a1.125,1.125,0,0,1,0,2.25Z" transform="translate(-195.85 -285.85)" />
						<path id="XMLID_2701__-_Outline" data-name="XMLID_2701_ - Outline" d="M197.5,289.9h-1.125a.525.525,0,1,1,0-1.05H197.5a.225.225,0,0,0,0-.45h-.375a1.275,1.275,0,1,1,0-2.55h1.125a.525.525,0,1,1,0,1.05h-1.125a.225.225,0,1,0,0,.45h.375a1.275,1.275,0,1,1,0,2.55Zm-1.125-.75a.225.225,0,1,0,0,.45H197.5a.975.975,0,0,0,0-1.95h-.375a.525.525,0,1,1,0-1.05h1.125a.225.225,0,0,0,0-.45h-1.125a.975.975,0,0,0,0,1.95h.375a.525.525,0,1,1,0,1.05Z" transform="translate(-195.85 -285.85)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const PdfFileIcon = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 28 30">
			<path id="pdf_1_" data-name="pdf (1)" d="M44.293,8.827,35.628.138A.467.467,0,0,0,35.3,0H25.483A4.153,4.153,0,0,0,21.34,4.154v8.221H17.7a1.277,1.277,0,0,0-1.274,1.277V21A1.277,1.277,0,0,0,17.7,22.273H21.34v3.572A4.153,4.153,0,0,0,25.483,30h14.8a4.153,4.153,0,0,0,4.143-4.154V9.159a.47.47,0,0,0-.137-.332ZM20.632,19.838V14.812a.468.468,0,0,1,.467-.469h1.506a1.978,1.978,0,0,1,1.973,1.978v.063a1.978,1.978,0,0,1-1.973,1.978H21.567v1.475a.467.467,0,1,1-.934,0Zm5.034,0V14.812a.468.468,0,0,1,.467-.469H27.64a1.978,1.978,0,0,1,1.973,1.978v2.007a1.978,1.978,0,0,1-1.973,1.978H26.134a.468.468,0,0,1-.467-.469ZM33.9,16.58a.468.468,0,0,1,0,.937H31.728v2.321a.467.467,0,1,1-.934,0V14.812a.468.468,0,0,1,.468-.469h3.011a.468.468,0,0,1,0,.937H31.728v1.3Zm9.6,9.266a3.216,3.216,0,0,1-3.208,3.217h-14.8a3.216,3.216,0,0,1-3.208-3.217V22.273H37.666A1.277,1.277,0,0,0,38.94,21V13.653a1.277,1.277,0,0,0-1.274-1.277H22.274V4.154A3.216,3.216,0,0,1,25.483.937H34.83V8.22a1.406,1.406,0,0,0,1.4,1.407H43.5Zm-20.89-8.419H21.567V15.281h1.039a1.041,1.041,0,0,1,1.038,1.041v.063a1.041,1.041,0,0,1-1.038,1.041ZM27.64,19.37H26.6V15.281H27.64a1.041,1.041,0,0,1,1.038,1.041v2.007A1.041,1.041,0,0,1,27.64,19.37Z" transform="translate(-16.43 0)" />
		</svg>
	);
}

const XlsFileIcon = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 28 30">
			<path id="xls_1_" data-name="xls (1)" d="M44.293,8.827,35.628.138A.467.467,0,0,0,35.3,0H25.483A4.153,4.153,0,0,0,21.34,4.154v8.221H17.7a1.277,1.277,0,0,0-1.274,1.277V21A1.277,1.277,0,0,0,17.7,22.273H21.34v3.572A4.153,4.153,0,0,0,25.483,30h14.8a4.153,4.153,0,0,0,4.143-4.154V9.159a.47.47,0,0,0-.137-.332ZM20.951,15.053a.467.467,0,1,1,.8-.482l1.105,1.845,1.106-1.845a.467.467,0,1,1,.8.482L23.4,17.326,24.763,19.6a.467.467,0,1,1-.8.482l-1.106-1.845L21.752,20.08a.467.467,0,1,1-.8-.482l1.361-2.272ZM29.46,19.37a.468.468,0,0,1,0,.937H26.449a.468.468,0,0,1-.467-.469V14.813a.467.467,0,1,1,.934,0V19.37Zm3.306-1.576a3.093,3.093,0,0,1-1.433-.278,1.527,1.527,0,0,1-.792-1.448,1.725,1.725,0,0,1,1.721-1.724h.745a1.483,1.483,0,0,1,1.48,1.484.467.467,0,1,1-.934,0,.546.546,0,0,0-.545-.547h-.745a.788.788,0,0,0-.787.788c0,.431.1.789,1.292.789a1.725,1.725,0,0,1,0,3.45h-.745a1.484,1.484,0,0,1-1.481-1.485.467.467,0,1,1,.934,0,.555.555,0,0,0,.547.548h.745a.788.788,0,0,0,0-1.576ZM43.5,25.846a3.216,3.216,0,0,1-3.208,3.217h-14.8a3.216,3.216,0,0,1-3.208-3.217V22.273H37.666A1.277,1.277,0,0,0,38.94,21V13.653a1.277,1.277,0,0,0-1.274-1.277H22.274V4.154A3.216,3.216,0,0,1,25.483.937H34.83V8.22a1.406,1.406,0,0,0,1.4,1.407H43.5Z" transform="translate(-16.43 0)" />
		</svg>
	);
}

const CsvFileIcon = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 28 30">
			<path id="csv_1_" data-name="csv (1)" d="M44.293,8.827,35.628.138A.467.467,0,0,0,35.3,0H25.483A4.153,4.153,0,0,0,21.34,4.154v8.221H17.7a1.277,1.277,0,0,0-1.274,1.277V21A1.277,1.277,0,0,0,17.7,22.273H21.34v3.572A4.153,4.153,0,0,0,25.483,30h14.8a4.153,4.153,0,0,0,4.143-4.154V9.159a.47.47,0,0,0-.137-.332Zm-23.441,9.5V16.322a1.973,1.973,0,1,1,3.946,0,.467.467,0,1,1-.934,0,1.039,1.039,0,1,0-2.077,0v2.007a1.039,1.039,0,1,0,2.077,0,.467.467,0,1,1,.934,0,1.973,1.973,0,1,1-3.946,0ZM43.5,25.846a3.216,3.216,0,0,1-3.208,3.217h-14.8a3.216,3.216,0,0,1-3.208-3.217V22.273H37.666A1.277,1.277,0,0,0,38.94,21V13.653a1.277,1.277,0,0,0-1.274-1.277H22.274V4.154A3.216,3.216,0,0,1,25.483.937H34.83V8.22a1.406,1.406,0,0,0,1.4,1.407H43.5ZM27.834,17.794a3.088,3.088,0,0,1-1.433-.278,1.528,1.528,0,0,1-.792-1.448,1.724,1.724,0,0,1,1.719-1.724h.746a1.484,1.484,0,0,1,1.481,1.484.467.467,0,1,1-.934,0,.547.547,0,0,0-.546-.547h-.746a.787.787,0,0,0-.785.788c0,.431.1.789,1.291.789a1.725,1.725,0,0,1,0,3.45h-.746a1.484,1.484,0,0,1-1.479-1.485.467.467,0,1,1,.934,0,.548.548,0,0,0,.545.548h.746a.788.788,0,0,0,0-1.576Zm2.742-3.428a.467.467,0,0,1,.59.3l1.22,3.688,1.221-3.688a.467.467,0,1,1,.887.3l-1.665,5.027a.466.466,0,0,1-.887,0l-1.663-5.027a.469.469,0,0,1,.3-.592Z" transform="translate(-16.43 0)" />
		</svg>
	);
}
const RequireEnteries = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 15.998 15.998">
			<path id="Union_23" data-name="Union 23" d="M21815,16022a8,8,0,1,1,8,8A7.995,7.995,0,0,1,21815,16022Zm1,0a7,7,0,1,0,7-7A7.011,7.011,0,0,0,21816,16022Zm6,3.528a.7.7,0,1,1,.707.707A.7.7,0,0,1,21822,16025.529Zm.2-2.811v-4.219a.5.5,0,0,1,1,0v4.219a.5.5,0,0,1-1,0Z" transform="translate(-21815.002 -16014.002)" />
		</svg>
	);
}
const Dollars = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg id="dollar" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 24 24">
			<g id="Group_12084" data-name="Group 12084">
				<g id="Group_12083" data-name="Group 12083">
					<path id="Path_20634" data-name="Path 20634" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm0,22.5A10.5,10.5,0,1,1,22.5,12,10.512,10.512,0,0,1,12,22.5Z" />
				</g>
			</g>
			<g id="Group_12086" data-name="Group 12086" transform="translate(8.25 5.25)">
				<g id="Group_12085" data-name="Group 12085">
					<path id="Path_20635" data-name="Path 20635" d="M179.75,118c-1.219,0-2.25-.687-2.25-1.5s1.031-1.5,2.25-1.5a2.662,2.662,0,0,1,1.752.591.75.75,0,1,0,1-1.122,3.97,3.97,0,0,0-2-.906v-.813a.75.75,0,1,0-1.5,0v.81a3.263,3.263,0,0,0-3,2.94c0,1.654,1.683,3,3.75,3,1.219,0,2.25.687,2.25,1.5s-1.031,1.5-2.25,1.5a2.662,2.662,0,0,1-1.752-.591.75.75,0,1,0-1,1.122,3.972,3.972,0,0,0,2,.908v.811a.75.75,0,1,0,1.5,0v-.81a3.263,3.263,0,0,0,3-2.94C183.5,119.346,181.817,118,179.75,118Z" transform="translate(-176 -112)" />
				</g>
			</g>
		</svg>
	);
}
const Agenda = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 17.94 24">
			<g id="agenda" transform="translate(-42.421)">
				<g id="Group_12088" data-name="Group 12088" transform="translate(42.421)">
					<path id="Path_20637" data-name="Path 20637" d="M58.964,0H45.455a3.04,3.04,0,0,0-3.034,3.02V20.98A3.04,3.04,0,0,0,45.455,24H58.972a1.352,1.352,0,0,0,1.389-1.369V1.4A1.4,1.4,0,0,0,58.964,0ZM52.97,1.143h3.357V6.5L55.135,4.6a.571.571,0,0,0-.98,0L52.97,6.494ZM43.578,3.02a1.886,1.886,0,0,1,1.877-1.877h6.371V6.971A1.031,1.031,0,0,0,52.538,8a1.11,1.11,0,0,0,1.223-.6l.889-1.429L55.538,7.4a1.129,1.129,0,0,0,1.234.6,1.031,1.031,0,0,0,.711-1.023V1.157h1.489a.243.243,0,0,1,.24.24V17.968a1.393,1.393,0,0,0-.24-.02H45.455a3.017,3.017,0,0,0-1.877.654ZM59.212,20.414l-13.174.014a.571.571,0,0,0,0,1.143l13.174-.014V22.62a.234.234,0,0,1-.24.24H45.455a1.879,1.879,0,1,1,0-3.757H58.972a.243.243,0,0,1,.24.24v1.071Z" transform="translate(-42.421)" />
				</g>
			</g>
		</svg>
	);
}
const Repair = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 19.999 20">
			<g id="repair" transform="translate(-0.01 0)">
				<g id="Group_12283" data-name="Group 12283" transform="translate(0.01 0)">
					<g id="Group_12282" data-name="Group 12282" transform="translate(0 0)">
						<path id="Path_20809" data-name="Path 20809" d="M19.153,15l-4.2-4.2a2.959,2.959,0,0,0-1.631-.822l1.85-1.85a4.1,4.1,0,0,0,4.422-5.8.586.586,0,0,0-.942-.162L17.312,3.514h-.828V2.686l1.343-1.343A.586.586,0,0,0,17.666.4a4.1,4.1,0,0,0-5.8,4.422L9.59,7.1l-3.2-3.2.414-.414a.586.586,0,0,0-.113-.916L2.553.084a.586.586,0,0,0-.715.088L.182,1.828a.586.586,0,0,0-.088.715L2.578,6.684a.586.586,0,0,0,.916.113l.414-.414,3.2,3.2L4.832,11.854a4.1,4.1,0,0,0-4.422,5.8.586.586,0,0,0,.942.162L2.7,16.474h.828V17.3L2.18,18.646a.586.586,0,0,0,.162.942,4.1,4.1,0,0,0,5.8-4.422l1.85-1.85a2.96,2.96,0,0,0,.822,1.631l4.2,4.2A2.928,2.928,0,1,0,19.153,15ZM3.2,5.438,1.333,2.333l1.01-1.01L5.448,3.186Zm1.54.116.828-.828,3.2,3.2-.828.828Zm2.353,9.01a.586.586,0,0,0-.152.565,2.929,2.929,0,0,1-3.243,3.658l.829-.829a.586.586,0,0,0,.172-.414V15.889a.586.586,0,0,0-.586-.586H2.453a.586.586,0,0,0-.414.172L1.21,16.3A2.929,2.929,0,0,1,4.868,13.06a.586.586,0,0,0,.565-.152l7.485-7.485a.586.586,0,0,0,.152-.565A2.929,2.929,0,0,1,16.313,1.2l-.829.829a.586.586,0,0,0-.172.414V4.1a.586.586,0,0,0,.586.586h1.656a.586.586,0,0,0,.414-.172l.829-.829A2.929,2.929,0,0,1,15.14,6.928a.586.586,0,0,0-.565.152Zm11.236,3.75a1.76,1.76,0,0,1-2.485,0l-4.2-4.2a1.757,1.757,0,0,1,2.484-2.485l4.2,4.2A1.759,1.759,0,0,1,18.325,18.315Z" transform="translate(-0.01 0)" />
					</g>
				</g>
				<g id="Group_12285" data-name="Group 12285" transform="translate(12.346 12.336)">
					<g id="Group_12284" data-name="Group 12284">
						<path id="Path_20810" data-name="Path 20810" d="M320.955,320.117l-4.138-4.138a.586.586,0,0,0-.828.828l4.138,4.138a.586.586,0,0,0,.828-.828Z" transform="translate(-315.817 -315.807)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const FullScreenIn = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 14.001 14">
			<g id="Group_12198" data-name="Group 12198" transform="translate(-780 -583)">
				<g id="full-size" transform="translate(780 583)">
					<path id="Path_20700" data-name="Path 20700" d="M.488,4.233a.488.488,0,0,0,.488-.488V1.667l3.14,3.14a.488.488,0,0,0,.69-.69L1.665.977H3.744a.488.488,0,1,0,0-.975H.488A.488.488,0,0,0,0,.49V3.746A.488.488,0,0,0,.488,4.233Z" transform="translate(0 -0.002)" />
					<path id="Path_20701" data-name="Path 20701" d="M142.311,138.566a.488.488,0,0,0-.488.488v2.079l-3.237-3.237a.488.488,0,1,0-.69.69l3.237,3.237h-2.079a.488.488,0,0,0,0,.975h3.256a.488.488,0,0,0,.488-.488v-3.256A.488.488,0,0,0,142.311,138.566Z" transform="translate(-128.798 -128.797)" />
					<path id="Path_20702" data-name="Path 20702" d="M4.217,137.895.98,141.132v-2.079a.488.488,0,1,0-.975,0v3.256a.488.488,0,0,0,.488.488H3.749a.488.488,0,1,0,0-.975H1.67l3.237-3.237a.488.488,0,0,0-.69-.69Z" transform="translate(-0.005 -128.796)" />
					<path id="Path_20703" data-name="Path 20703" d="M143.708,0h-3.256a.488.488,0,1,0,0,.975h2.079l-3.14,3.14a.488.488,0,0,0,.69.69l3.14-3.14V3.746a.488.488,0,0,0,.975,0V.49A.488.488,0,0,0,143.708,0Z" transform="translate(-130.195 -0.002)" />
				</g>
			</g>
		</svg>
	);
}
const FullScreenOut = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 18.008 18">
			<g id="Layer_2" data-name="Layer 2" transform="translate(-2.245 -2.25)">
				<path id="Union_30" data-name="Union 30" d="M6.034,6.728.981,1.675V5.728a.491.491,0,1,1-.981,0V1.145A1.145,1.145,0,0,1,1.145,0H6.383a.491.491,0,0,1,0,.981h-4.7l5.05,5.053a.49.49,0,0,1,.108.536.5.5,0,0,1-.454.3.492.492,0,0,1-.353-.142Z" transform="translate(9.123 9.123) rotate(180)" />
				<path id="Union_33" data-name="Union 33" d="M6.034.145.981,5.2V1.145a.491.491,0,1,0-.981,0V5.728A1.145,1.145,0,0,0,1.145,6.873H6.383a.491.491,0,0,0,0-.981h-4.7L6.728.839A.49.49,0,0,0,6.837.3.5.5,0,0,0,6.383,0a.492.492,0,0,0-.349.145Z" transform="translate(9.123 20.25) rotate(180)" />
				<path id="Union_31" data-name="Union 31" d="M5.893,6.382V1.675L.837,6.728a.478.478,0,0,1-.346.145.491.491,0,0,1-.348-.839L5.2.981H1.145a.491.491,0,0,1,0-.981H5.729A1.146,1.146,0,0,1,6.874,1.145V6.382a.491.491,0,0,1-.981,0Z" transform="translate(20.251 9.123) rotate(180)" />
				<path id="Union_32" data-name="Union 32" d="M5.893.491V5.2L.837.145A.478.478,0,0,0,.491,0,.491.491,0,0,0,.143.839L5.2,5.892H1.145a.491.491,0,0,0,0,.981H5.729A1.146,1.146,0,0,0,6.874,5.728V.491a.491.491,0,0,0-.981,0Z" transform="translate(20.251 20.25) rotate(180)" />
			</g>
		</svg>
	);
}
const FileUpload = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 22.928 18">
			<g id="cloud-computing_1_" data-name="cloud-computing (1)" transform="translate(0 -55.032)">
				<g id="Group_12638" data-name="Group 12638" transform="translate(0 55.032)">
					<g id="Group_12637" data-name="Group 12637" transform="translate(0 0)">
						<path id="Path_20869" data-name="Path 20869" d="M19.1,61A7.879,7.879,0,0,0,3.6,62.352,4.3,4.3,0,0,0,4.316,70.9H7.9V69.468H4.316a2.869,2.869,0,0,1,0-5.739.717.717,0,0,0,.716-.717,6.447,6.447,0,0,1,12.774-1.255.717.717,0,0,0,.609.574,3.587,3.587,0,0,1-.487,7.138H15.063V70.9h2.866A5.022,5.022,0,0,0,19.1,61Z" transform="translate(0 -55.032)" />
						<path id="Path_20870" data-name="Path 20870" d="M183.874,249.217l-2.839,2.839,1,1,1.633-1.625v6.807h1.42v-6.807l1.625,1.625,1-1-2.839-2.839A.71.71,0,0,0,183.874,249.217Z" transform="translate(-172.897 -240.239)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const Menuicon = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 24 24">
			<g id="Menuicon" transform="translate(0 0)">
				<rect id="Rectangle_335" data-name="Rectangle 335" width="24" height="24" transform="translate(0 0)" fill="none" opacity="0.5" />
				<g id="Iconly_Light_Category" data-name="Iconly Light Category" transform="translate(0.592 0.592)">
					<g id="Category-4">
						<path id="Stroke_1-12" data-name="Stroke 1-12" d="M527.012,1001.851c2.277,0,3.419.316,4.072,1.126s.661,1.989.661,3.607v.029c0,1.613,0,2.779-.649,3.584s-1.795,1.121-4.085,1.121-3.436-.314-4.085-1.121-.649-1.971-.649-3.584v-.029c0-1.618,0-2.787.661-3.607S524.735,1001.851,527.012,1001.851Zm0,8.284c1.834,0,2.78-.2,3.163-.679s.387-1.42.387-2.842v-.029c0-1.376,0-2.37-.4-2.865s-1.33-.686-3.151-.686-2.763.205-3.151.686-.4,1.489-.4,2.865v.029c0,1.422,0,2.361.387,2.842S525.178,1010.135,527.012,1010.135Z" transform="translate(-522.278 -1001.851)" />
						<path id="Stroke_3-6" data-name="Stroke 3-6" d="M538.012,1001.851c2.277,0,3.419.316,4.072,1.126s.661,1.989.661,3.607v.029c0,1.613,0,2.779-.649,3.584s-1.795,1.121-4.085,1.121-3.435-.314-4.085-1.121-.649-1.971-.649-3.584v-.029c0-1.618,0-2.787.661-3.607S535.735,1001.851,538.012,1001.851Zm0,8.284c1.834,0,2.78-.2,3.163-.679s.387-1.42.387-2.842v-.029c0-1.376,0-2.37-.4-2.865s-1.33-.686-3.151-.686-2.763.205-3.151.686-.4,1.489-.4,2.865v.029c0,1.422,0,2.361.387,2.842S536.178,1010.135,538.012,1010.135Z" transform="translate(-520.261 -1001.851)" />
						<path id="Stroke_5-2" data-name="Stroke 5-2" d="M527.012,1012.851c2.277,0,3.419.316,4.072,1.126s.661,1.989.661,3.607v.029c0,1.613,0,2.779-.649,3.584s-1.795,1.121-4.085,1.121-3.436-.314-4.085-1.121-.649-1.971-.649-3.584v-.029c0-1.618,0-2.787.661-3.607S524.735,1012.851,527.012,1012.851Zm0,8.284c1.834,0,2.78-.2,3.163-.679s.387-1.42.387-2.842v-.029c0-1.376,0-2.369-.4-2.864s-1.33-.686-3.151-.686-2.763.205-3.151.686-.4,1.489-.4,2.864v.029c0,1.422,0,2.362.387,2.842S525.178,1021.135,527.012,1021.135Z" transform="translate(-522.278 -999.834)" />
						<path id="Stroke_7-2" data-name="Stroke 7-2" d="M538.012,1012.851c2.277,0,3.419.316,4.072,1.126s.661,1.989.661,3.607v.029c0,1.613,0,2.779-.649,3.584s-1.795,1.121-4.085,1.121-3.435-.314-4.085-1.121-.649-1.971-.649-3.584v-.029c0-1.618,0-2.787.661-3.607S535.735,1012.851,538.012,1012.851Zm0,8.284c1.834,0,2.78-.2,3.163-.679s.387-1.42.387-2.842v-.029c0-1.376,0-2.369-.4-2.864s-1.33-.686-3.151-.686-2.763.205-3.151.686-.4,1.489-.4,2.864v.029c0,1.422,0,2.362.387,2.842S536.178,1021.135,538.012,1021.135Z" transform="translate(-520.261 -999.834)" />
					</g>
				</g>
			</g>
		</svg>
	);
}
const ReportsTracking = ({ className = '', fontSize = '1em' }: IconSvg) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className={`${className}`} style={{ height: fontSize, width: fontSize }} aria-hidden='true' fill='currentColor' viewBox="0 0 24 23.669">
			<g id="Menuicon" transform="translate(0 -0.275)">
				<rect id="Rectangle_335" data-name="Rectangle 335" width="24" height="23" transform="translate(0 0.275)" fill="none" opacity="0.5" />
				<g id="Reports-01" transform="translate(1.953 0.277)">
					<g id="Group_12264" data-name="Group 12264">
						<path id="Path_20798" data-name="Path 20798" d="M18.868,0H4.194A2.538,2.538,0,0,0,1.65,2.532V21.123a2.54,2.54,0,0,0,2.544,2.544H18.868a2.538,2.538,0,0,0,2.544-2.532V2.532A2.538,2.538,0,0,0,18.868,0Zm1.373,21.135A1.379,1.379,0,0,1,18.868,22.5H4.194a1.379,1.379,0,0,1-1.373-1.361V2.532A1.379,1.379,0,0,1,4.194,1.172H18.868a1.379,1.379,0,0,1,1.373,1.361v18.6Z" transform="translate(-1.65)" />
					</g>
					<g id="Group_12265" data-name="Group 12265" transform="translate(13.68 10.745)">
						<path id="Path_20799" data-name="Path 20799" d="M16.358,9.672a.593.593,0,0,1-.592.592H13.8a.586.586,0,0,1-.592-.592A.593.593,0,0,1,13.8,9.08h1.964A.618.618,0,0,1,16.358,9.672Z" transform="translate(-13.21 -9.08)" />
					</g>
					<g id="Group_12266" data-name="Group 12266" transform="translate(13.68 7.81)">
						<path id="Path_20800" data-name="Path 20800" d="M16.358,7.192a.593.593,0,0,1-.592.592H13.8a.586.586,0,0,1-.592-.592A.593.593,0,0,1,13.8,6.6h1.964A.618.618,0,0,1,16.358,7.192Z" transform="translate(-13.21 -6.6)" />
					</g>
					<g id="Group_12267" data-name="Group 12267" transform="translate(13.68 13.68)">
						<path id="Path_20801" data-name="Path 20801" d="M16.358,12.152a.593.593,0,0,1-.592.592H13.8a.586.586,0,0,1-.592-.592.593.593,0,0,1,.592-.592h1.964A.618.618,0,0,1,16.358,12.152Z" transform="translate(-13.21 -11.56)" />
					</g>
					<g id="Group_12268" data-name="Group 12268" transform="translate(13.68 16.615)">
						<path id="Path_20802" data-name="Path 20802" d="M16.358,14.632a.593.593,0,0,1-.592.592H13.8a.586.586,0,0,1-.592-.592.593.593,0,0,1,.592-.592h1.964A.618.618,0,0,1,16.358,14.632Z" transform="translate(-13.21 -14.04)" />
					</g>
					<g id="Group_12269" data-name="Group 12269" transform="translate(2.923 19.55)">
						<path id="Path_20803" data-name="Path 20803" d="M18.025,17.112a.593.593,0,0,1-.592.592H4.712a.593.593,0,0,1-.592-.592.6.6,0,0,1,.592-.592H17.433A.618.618,0,0,1,18.025,17.112Z" transform="translate(-4.12 -16.52)" />
					</g>
					<g id="Group_12270" data-name="Group 12270" transform="translate(2.923 7.822)">
						<path id="Path_20804" data-name="Path 20804" d="M9.114,6.61a5,5,0,0,0-3.526,8.532c.024.024.059.047.083.071a4.992,4.992,0,1,0,3.444-8.6ZM5.3,11.592A3.778,3.778,0,0,1,8.534,7.841v3.526L6.049,13.852A3.779,3.779,0,0,1,5.3,11.592Zm3.811,3.822a3.778,3.778,0,0,1-2.237-.734L9.54,12.018a.62.62,0,0,0,.166-.426V7.841a3.809,3.809,0,0,1-.592,7.574Z" transform="translate(-4.12 -6.61)" />
					</g>
				</g>
			</g>
		</svg>

	);
}
const EquipmentManagementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20.166" height="20" viewBox="0 0 20.166 20">
	<g id="Equipment_Management1" data-name="Equipment Management1" transform="translate(-0.54 -0.742)">
		<path id="Path_30442" data-name="Path 30442" d="M19.9,15.849l-4.508-4.515a.4.4,0,0,0-.554,0l-.894.894-1.053-1.051,2.541-2.555c1.062-.056,2.477-.051,2.539-.06.264-.04.769-.447,2.479-2.747a.4.4,0,0,0,.076-.224V4.556a.393.393,0,0,0-.2-.34.387.387,0,0,0-.393,0L18.13,5.29a1.24,1.24,0,0,1-1.41-.617c-.626-.894-.346-1.323.049-1.661a19.957,19.957,0,0,1,1.837-1.167.4.4,0,0,0,.2-.324.391.391,0,0,0-.17-.338,4.124,4.124,0,0,0-3.755-.042c-1.806.7-2.059,1.616-2.081,1.719l-.384,2.716L9.856,8.135,7.571,5.844a2.148,2.148,0,0,0,.152-.782,2.106,2.106,0,0,0-.621-1.5.333.333,0,0,0-.063-.051L3.17,1a.389.389,0,0,0-.49.049L1.074,2.652a.389.389,0,0,0-.049.49L3.548,7a.447.447,0,0,0,.051.063,2.12,2.12,0,0,0,2.28.469L8.164,9.827l-2.8,2.8-2.682.38H2.654c-.1.025-1.019.275-1.719,2.083A4.138,4.138,0,0,0,.98,18.844a.4.4,0,0,0,.333.172.387.387,0,0,0,.322-.194A20.13,20.13,0,0,1,2.8,16.984c.338-.4.773-.671,1.663-.051a1.234,1.234,0,0,1,.617,1.41L4.009,20.151a.389.389,0,0,0,.335.59H5.379a.378.378,0,0,0,.224-.078c2.347-1.734,2.72-2.235,2.751-2.488,0-.054,0-1.469.056-2.528L11.2,12.869l1.064,1.048-.894.894a.393.393,0,0,0,0,.554l4.515,4.513a2.7,2.7,0,0,0,3.822,0l.2-.2a2.7,2.7,0,0,0,0-3.822Zm-6.844-9.81a.4.4,0,0,0,.11-.224l.4-2.781c.025-.063.286-.646,1.6-1.153a4.209,4.209,0,0,1,2.354-.3,12.108,12.108,0,0,0-1.254.834,1.848,1.848,0,0,0-.181,2.7,2.04,2.04,0,0,0,2.365.894c.018,0,1.3-.767,1.3-.767v.224a20.819,20.819,0,0,1-1.916,2.318c-.514-.027-1.945.042-2.586.078a.389.389,0,0,0-.257.114l-2.646,2.633-.671-.671,2.553-2.564a.391.391,0,1,0-.552-.55L11.112,9.391l-.7-.7ZM5.088,6.9a1.319,1.319,0,0,1-.914-.362L1.852,2.981,3.01,1.823,6.57,4.152a1.341,1.341,0,0,1-.027,1.86l-.512.512a1.325,1.325,0,0,1-.943.389Zm2.669,8.3a.38.38,0,0,0-.114.255c-.036.644-.105,2.072-.076,2.586a21.3,21.3,0,0,1-2.32,1.918H5.023l.773-1.3A2.019,2.019,0,0,0,4.9,16.293a1.851,1.851,0,0,0-2.707.181,12.226,12.226,0,0,0-.834,1.254,4.193,4.193,0,0,1,.3-2.354c.51-1.321,1.1-1.565,1.153-1.6l2.792-.4a.387.387,0,0,0,.224-.11l2.888-2.892.7.7L6.6,13.906a.39.39,0,1,0,.552.552l2.823-2.823.671.671ZM6.546,7.1l.04-.036.51-.51.036-.04,6.258,6.258-.586.586ZM19.351,19.128l-.2.206a1.927,1.927,0,0,1-2.718,0l-4.236-4.247.894-.894,1.14-1.138.894-.894,4.247,4.247a1.918,1.918,0,0,1-.018,2.72Z" transform="translate(0 0)" fill="#a9acae" />
		<path id="Path_30443" data-name="Path 30443" d="M62.366,60.977a.387.387,0,0,0-.552,0,.391.391,0,0,0,0,.552l3.353,3.353a.392.392,0,0,0,.554-.554Z" transform="translate(-47.49 -46.682)" fill="#a9acae" />
	</g>
</svg>);

const VolumeManagementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20.75" viewBox="0 0 21 20.75">
	<path id="volume_management1" data-name="volume management1" d="M3.209,19.231C1.139,18.2,0,16.782,0,15.251a3.247,3.247,0,0,1,.45-1.625,3.161,3.161,0,0,1,0-3.25,3.161,3.161,0,0,1,0-3.249A3.251,3.251,0,0,1,0,5.5C0,3.965,1.138,2.551,3.2,1.517A16.7,16.7,0,0,1,10.5,0a16.7,16.7,0,0,1,7.294,1.517C19.862,2.551,21,3.965,21,5.5a3.251,3.251,0,0,1-.449,1.627,3.161,3.161,0,0,1,0,3.249,3.161,3.161,0,0,1,0,3.25A3.247,3.247,0,0,1,21,15.251c0,1.532-1.139,2.946-3.208,3.981A16.689,16.689,0,0,1,10.5,20.75,16.691,16.691,0,0,1,3.209,19.231ZM1,15.251c0,2.439,4.351,4.5,9.5,4.5s9.5-2.06,9.5-4.5a2.092,2.092,0,0,0-.073-.545,8.67,8.67,0,0,1-3.28,2.023A17.822,17.822,0,0,1,10.5,17.75a17.822,17.822,0,0,1-6.147-1.021,8.667,8.667,0,0,1-3.281-2.023A2.087,2.087,0,0,0,1,15.251ZM1,12c0,2.439,4.351,4.5,9.5,4.5S20,14.439,20,12a2.085,2.085,0,0,0-.073-.544,8.67,8.67,0,0,1-3.28,2.023A17.822,17.822,0,0,1,10.5,14.5a17.822,17.822,0,0,1-6.147-1.021,8.667,8.667,0,0,1-3.281-2.023A2.08,2.08,0,0,0,1,12ZM1,8.75c0,2.439,4.351,4.5,9.5,4.5S20,11.189,20,8.75a2.08,2.08,0,0,0-.073-.544,8.67,8.67,0,0,1-3.28,2.023A17.822,17.822,0,0,1,10.5,11.25a17.822,17.822,0,0,1-6.147-1.021A8.667,8.667,0,0,1,1.073,8.206,2.08,2.08,0,0,0,1,8.75ZM1,5.5C1,7.939,5.351,10,10.5,10S20,7.939,20,5.5,15.649,1,10.5,1,1,3.061,1,5.5Z" fill="#a9acae" />
</svg>);

const MaterialManagementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="17.773" height="19.828" viewBox="0 0 17.773 19.828">
	<path id="Material_Management1" data-name="Material Management1" d="M8.642,19.764.256,15.057a.5.5,0,0,1,0-.872l3.416-1.917L.256,10.35a.5.5,0,0,1,0-.872L3.672,7.56.256,5.643a.5.5,0,0,1,0-.872L8.642.064a.5.5,0,0,1,.49,0l8.387,4.707a.5.5,0,0,1,0,.872L14.1,7.56l3.416,1.918a.5.5,0,0,1,0,.872L14.1,12.268l3.417,1.917a.5.5,0,0,1,0,.872L9.131,19.764a.5.5,0,0,1-.49,0Zm-7.12-5.143,7.365,4.134,7.366-4.134L13.08,12.841,9.131,15.057a.5.5,0,0,1-.49,0L4.694,12.841Zm7.365-.573,3.93-2.206.036-.02,3.4-1.908L13.08,8.134,9.131,10.35a.5.5,0,0,1-.49,0L4.694,8.134,1.522,9.914l3.4,1.909.029.016ZM1.522,5.207,8.887,9.34l7.366-4.134L8.887,1.073ZM8.3,12.014a.586.586,0,1,1,.586.586A.586.586,0,0,1,8.3,12.014Zm2.146-1.123a.586.586,0,1,1,.586.586A.585.585,0,0,1,10.446,10.891Zm-4.291,0a.586.586,0,1,1,.586.586A.586.586,0,0,1,6.155,10.891Zm6.437-1.073a.586.586,0,1,1,.586.586A.587.587,0,0,1,12.592,9.818Zm-8.582,0A.586.586,0,1,1,4.6,10.4.586.586,0,0,1,4.01,9.818Z" fill="#a9acae" />
</svg>);

const FrequencyManagementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="21" height="20.75" fill='currentColor' shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 406.518"><path fillRule="nonzero" d="M50.187 135.359c0-24.751 10.033-47.159 26.252-63.377 16.219-16.22 38.626-26.252 63.378-26.252 17.992 0 34.747 5.303 48.787 14.431-2.865 2.288-6.142 4.886-9.675 7.715a77.54 77.54 0 00-34.226-10.352v10.341h-14.137v-9.949c-15.484 1.83-29.578 8.196-40.916 17.732l7.759 7.76-9.994 9.995-7.719-7.72c-11.159 13.49-17.867 30.8-17.867 49.676H50.187zm235.436-76.625h142.676v11.569H285.623V58.734zM512 0v339.709H336.768v34.199h51.215v32.61H122.929v-32.61h54.847v-34.199H0V0h512zM15.281 296.178H496.65V15.276H15.281v280.902zm61.316-48.007h145.332v10.839H76.597v-10.839zm-20.586-.347h11.344v11.532H56.011v-11.532zm20.586-32.019h145.332v10.839H76.597v-10.839zm-20.586-.348h11.344v11.532H56.011v-11.532zm20.586-32.023h145.332v10.839H76.597v-10.839zm-20.586-.347h11.344v11.532H56.011v-11.532zm244.507 4.247h20.636a2.17 2.17 0 012.161 2.162v59.943h15.02v-37.057c0-1.19.971-2.163 2.161-2.163h20.636c1.19 0 2.163.979 2.163 2.163v37.057h15.018v-84.625c0-1.19.973-2.16 2.161-2.16h20.637c1.192 0 2.165.981 2.165 2.16v84.625h15.02v-50.716c0-1.19.972-2.162 2.162-2.162h20.636a2.17 2.17 0 012.163 2.162v50.716h12.728v8.302H285.624v-8.302h12.731v-59.943c0-1.189.973-2.162 2.163-2.162zm-14.895-63.844h170.356v11.532H285.623V123.49zm0-32.37h170.356v11.532H285.623V91.12zm-77.555-13.857c13.33 15.646 21.378 35.932 21.378 58.096h-11.642c0-18.491-6.437-35.482-17.19-48.848l7.454-9.248z" /><path fill="#EF1C25" d="M203.602 58.91l-71.725 64.146c-13.622 11.254 4.597 30.196 16.888 14.071l59.647-74.002-4.81-4.215z" /></svg>);

const DiversionAdminIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" fill='currentColor' width="20" height="20" viewBox="0 0 102.39 122.88" enableBackground="new 0 0 102.39 122.88" xmlSpace="preserve"><g><path fillRule="evenodd" clipRule="evenodd" d="M30.529,84.792c6.151,3.507,10.299,10.125,10.299,17.713 c0,11.252-9.123,20.375-20.375,20.375s-20.375-9.123-20.375-20.375c0-7.438,3.986-13.944,9.938-17.502 c-0.581-12.169,0.074-37.095,0.193-46.967C4.107,34.516,0,27.925,0,20.375C0,9.122,9.123,0,20.375,0 c11.253,0,20.376,9.122,20.376,20.375c0,7.558-4.116,14.155-10.228,17.672v23.932c7.833-2.279,15.63-2.077,22.951-1.887 c3.04,0.079,5.972,0.156,8.801-0.066c5.989-0.471,10.397-4.068,10.645-21.415c-6.687-3.342-11.28-10.252-11.28-18.236 C61.64,9.122,70.762,0,82.016,0c11.252,0,20.374,9.122,20.374,20.375c0,7.131-3.664,13.406-9.212,17.046 C93.035,71.855,80.73,78.916,63.861,80.242c-3.343,0.263-7.034,0.167-10.862,0.067c-7.579-0.198-15.893-0.415-22.476,3.804 C30.523,84.336,30.526,84.563,30.529,84.792L30.529,84.792z M82.016,12.688c4.244,0,7.686,3.441,7.686,7.686 c0,4.245-3.441,7.687-7.686,7.687c-4.246,0-7.688-3.442-7.688-7.687C74.328,16.13,77.77,12.688,82.016,12.688L82.016,12.688z M20.375,12.688c4.245,0,7.687,3.441,7.687,7.686c0,4.245-3.441,7.687-7.687,7.687s-7.686-3.442-7.686-7.687 C12.689,16.13,16.13,12.688,20.375,12.688L20.375,12.688z M20.452,94.817c4.245,0,7.687,3.442,7.687,7.688 s-3.441,7.686-7.687,7.686s-7.687-3.44-7.687-7.686S16.207,94.817,20.452,94.817L20.452,94.817z" /></g></svg>);

const AssignedContractorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="21" height="20.75" viewBox="0 0 112.88 115.48" fill='currentColor' xmlSpace="preserve"><style type="text/css">{'.st0{fill-rule:evenodd;clip-rule:evenodd;}'}</style><g><path className="st0" d="M39.54,70.85l8.78,25.83l4.42-15.33l-2.17-2.37c-0.98-1.42-1.19-2.67-0.65-3.74c1.17-2.32,3.6-1.89,5.87-1.89 c2.38,0,5.31-0.45,6.05,2.52c0.25,0.99-0.06,2.04-0.76,3.11l-2.17,2.37l4.42,15.33l7.95-25.83c1.71,1.53,4.4,2.7,7.52,3.68 c0.47-0.56,0.97-1.11,1.49-1.63c4.51-4.51,10.75-7.31,17.64-7.31c6.89,0,13.12,2.79,17.64,7.31c4.51,4.51,7.31,10.75,7.31,17.64 s-2.79,13.12-7.31,17.64c-4.51,4.51-10.75,7.31-17.64,7.31c-5.22,0-10.07-1.61-14.08-4.35H6.07c-3.81-0.29-5.75-2.26-6.07-5.67 c0.97-6.57,1.24-15.16,5.24-20.45c1.45-1.92,3.26-3.34,5.26-4.45C16.82,77.04,33.8,76.01,39.54,70.85L39.54,70.85z M85.11,92.67 l4.54-4.76l6.55,6.3l10.2-13.59l5.07,4.09c-2.39,2.96-10.91,14.65-12.77,16.17c-1.53,1.25-3.73,1.25-5.15-0.12L85.11,92.67 L85.11,92.67z M112.95,75.52c-3.84-3.84-9.15-6.22-15.02-6.22c-5.87,0-11.18,2.38-15.02,6.22c-3.84,3.84-6.22,9.15-6.22,15.02 c0,5.87,2.38,11.18,6.22,15.02c3.84,3.84,9.15,6.22,15.02,6.22c5.87,0,11.18-2.38,15.02-6.22c3.84-3.84,6.22-9.15,6.22-15.02 C119.18,84.67,116.8,79.36,112.95,75.52L112.95,75.52z M35.32,33.91c0.68,0.19,1.38,0.21,2.11,0.06l-1.25-9.91 c0.64-2.45,1.62-4.36,2.92-5.76c1.36-1.46,3.06-2.37,5.09-2.76c2.69-0.19,3.5,1.77,6.19,3.49c8.18,5.23,15.1,6.99,25.21,7.12 l-1.25,6.32c-0.17,0.26-0.26,0.58-0.23,0.91c0,0.05,0.01,0.11,0.02,0.16l-0.18,0.9c0.28,0.02,0.55,0.03,0.82,0.02 c0.25,0.15,0.55,0.23,0.87,0.2c1.76-0.16,2.83,0,3.12,0.59c0.4,0.8,0.06,2.43-1.09,5.05l-5.53,9.11c-2.06,3.39-4.14,6.78-6.79,9.25 c-2.54,2.38-5.67,3.96-9.94,3.95c-3.95-0.01-6.93-1.53-9.4-3.78c-2.56-2.34-4.63-5.53-6.59-8.66l-4.91-7.81l0,0l-0.02-0.03 c-1.51-2.25-2.29-4.19-2.33-5.68c-0.01-0.5,0.06-0.94,0.23-1.3c0.15-0.32,0.38-0.59,0.7-0.81C33.62,34.19,34.36,33.98,35.32,33.91 L35.32,33.91L35.32,33.91z M78.98,32.1l0.31-12.72c-0.37-5.17-2.08-9.08-4.81-12.03c-6.69-7.24-19.19-9.1-28.62-5.69 c-1.59,0.57-3.09,1.3-4.46,2.17c-3.89,2.48-7.04,6.09-8.29,10.57c-0.3,1.06-0.5,2.12-0.61,3.18c-0.2,4.46-0.09,9.78,0.23,14.01 c-0.44,0.17-0.84,0.37-1.2,0.61c-0.76,0.51-1.33,1.18-1.7,1.97c-0.35,0.76-0.51,1.62-0.48,2.57c0.06,2.01,0.99,4.47,2.79,7.15 l4.91,7.8c2.07,3.28,4.24,6.64,7.08,9.24c2.94,2.69,6.53,4.51,11.3,4.53c5.11,0.01,8.84-1.88,11.87-4.71 c2.92-2.74,5.12-6.3,7.27-9.85l5.59-9.21c0.03-0.05,0.06-0.11,0.08-0.16l0,0c1.53-3.47,1.86-5.89,1.06-7.49 C80.84,33.05,80.06,32.43,78.98,32.1L78.98,32.1L78.98,32.1z" /></g></svg>);

const DraggableIcon = ({ className = '', fontSize = '1em', onClick }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} width="12" height="20" viewBox="0 0 12 20">
		<g id="drag" transform="translate(-6 -2)">
			<circle id="Ellipse_2282" data-name="Ellipse 2282" cx="2" cy="2" r="2" transform="translate(6 2)" fill="#363637" />
			<circle id="Ellipse_2283" data-name="Ellipse 2283" cx="2" cy="2" r="2" transform="translate(6 10)" fill="#363637" />
			<circle id="Ellipse_2284" data-name="Ellipse 2284" cx="2" cy="2" r="2" transform="translate(6 18)" fill="#363637" />
			<circle id="Ellipse_2285" data-name="Ellipse 2285" cx="2" cy="2" r="2" transform="translate(14 2)" fill="#363637" />
			<circle id="Ellipse_2286" data-name="Ellipse 2286" cx="2" cy="2" r="2" transform="translate(14 10)" fill="#363637" />
			<circle id="Ellipse_2287" data-name="Ellipse 2287" cx="2" cy="2" r="2" transform="translate(14 18)" fill="#363637" />
		</g>
	</svg>
);

const InfoIcon = ({ className = '', fontSize = '1em',  }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" id="Component_178_3" data-name="Component 178 – 3" className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 18 17.996">
		<path id="Union_173" data-name="Union 173" d="M-13861,7004a9,9,0,0,1,9-9,9,9,0,0,1,9,9,9,9,0,0,1-9,9A9,9,0,0,1-13861,7004Zm1.128,0a7.879,7.879,0,0,0,7.871,7.872,7.882,7.882,0,0,0,7.874-7.872,7.883,7.883,0,0,0-7.874-7.876A7.88,7.88,0,0,0-13859.873,7004Zm7.331,3.782V7003.6a.629.629,0,0,1,.629-.63.628.628,0,0,1,.626.63v4.184a.628.628,0,0,1-.626.628A.629.629,0,0,1-13852.542,7007.782Zm-.21-6.7a.835.835,0,0,1,.839-.835.837.837,0,0,1,.838.835.837.837,0,0,1-.838.837A.835.835,0,0,1-13852.752,7001.086Z" transform="translate(13861.001 -6995)" fill="current" />
	</svg>
);
const Archive = ({ className = '', fontSize = '1em' }: IconSvg) => (
	<svg className={className} style={{ height: fontSize, width: fontSize }} viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path d="M9 7.00001L5 11L6.4 12.4L8 10.8V15H10V10.8L11.6 12.4L13 11L9 7.00001ZM2 5.00001V16H16V5.00001H2ZM2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V3.52501C0 3.29167 0.0376666 3.06667 0.113 2.85001C0.188333 2.63334 0.300667 2.43334 0.45 2.25001L1.7 0.725005C1.88333 0.491672 2.11233 0.312339 2.387 0.187005C2.66167 0.061672 2.94933 -0.000661376 3.25 5.291e-06H14.75C15.05 5.291e-06 15.3377 0.0626719 15.613 0.188005C15.8883 0.313339 16.1173 0.492339 16.3 0.725005L17.55 2.25001C17.7 2.43334 17.8127 2.63334 17.888 2.85001C17.9633 3.06667 18.0007 3.29167 18 3.52501V16C18 16.55 17.8043 17.021 17.413 17.413C17.0217 17.805 16.5507 18.0007 16 18H2ZM2.4 3.00001H15.6L14.75 2.00001H3.25L2.4 3.00001Z" />
	</svg>
);
const PlayIcon3 = ({ className = '', fontSize = '0.46em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} style={{ height: fontSize, width: fontSize }} fill="currentColor" viewBox="0 0 18.75 22.501">
		<path id="play-button_1_" data-name="play-button (1)" d="M40.369,31.59l-15,9.375a1.875,1.875,0,0,1-2.869-1.59V20.625a1.875,1.875,0,0,1,2.869-1.59l15,9.375a1.875,1.875,0,0,1,0,3.18Z" transform="translate(-22.5 -18.749)" fill="#242b3a" />
	</svg>
);

const ZoomIn = ({ className = '', fontSize = '0.46em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} style={{ height: fontSize, width: fontSize }} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="119.827px" height="122.88px" viewBox="0 0 119.827 122.88" enableBackground="new 0 0 119.827 122.88" xmlSpace="preserve">
		<g>
			<path d="M78.693,87.06c-0.221-0.22-0.406-0.46-0.561-0.715c-8.213,6.447-18.564,10.292-29.814,10.292 c-13.343,0-25.423-5.408-34.167-14.152C5.408,73.74,0,61.661,0,48.318s5.408-25.422,14.152-34.166C22.896,5.408,34.976,0,48.319,0 C61.662,0,73.74,5.408,82.484,14.152s14.152,20.823,14.152,34.166c0,12.808-4.984,24.451-13.117,33.099 c0.148,0.108,0.291,0.229,0.424,0.363l34.787,34.737c1.457,1.449,1.463,3.807,0.014,5.265c-1.449,1.457-3.807,1.464-5.264,0.015 L78.693,87.06L78.693,87.06z M29.458,52.052c-2.062,0-3.733-1.671-3.733-3.733c0-2.062,1.672-3.733,3.733-3.733h15.126V29.459 c0-2.062,1.671-3.733,3.733-3.733c2.062,0,3.733,1.672,3.733,3.733v15.126h15.126c2.063,0,3.732,1.672,3.732,3.733 c0,2.062-1.67,3.733-3.732,3.733H52.051v15.126c0,2.062-1.671,3.733-3.733,3.733c-2.062,0-3.733-1.672-3.733-3.733V52.052H29.458 L29.458,52.052z M77.082,19.555c-7.361-7.361-17.53-11.914-28.763-11.914c-11.233,0-21.403,4.553-28.764,11.914 S7.641,37.085,7.641,48.318s4.553,21.403,11.914,28.764c7.361,7.361,17.531,11.914,28.764,11.914 c11.233,0,21.402-4.553,28.763-11.914c7.361-7.36,11.914-17.53,11.914-28.764S84.443,26.916,77.082,19.555L77.082,19.555z" />
		</g>
	</svg>);
const ZoomOut = ({ className = '', fontSize = '0.46em' }: IconSvg) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} style={{ height: fontSize, width: fontSize }} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="119.828px" height="122.88px" viewBox="0 0 119.828 122.88" enableBackground="new 0 0 119.828 122.88" xmlSpace="preserve">
		<g>
			<path d="M29.459,52.052c-2.062,0-3.734-1.671-3.734-3.733c0-2.062,1.672-3.733,3.734-3.733h37.719c2.063,0,3.732,1.672,3.732,3.733 c0,2.062-1.67,3.733-3.732,3.733H29.459L29.459,52.052z M48.318,0C61.66,0,73.74,5.408,82.484,14.152s14.152,20.824,14.152,34.166 c0,12.808-4.984,24.451-13.117,33.098c0.148,0.109,0.291,0.23,0.424,0.364l34.787,34.737c1.457,1.449,1.465,3.807,0.014,5.265 c-1.449,1.458-3.807,1.464-5.264,0.015L78.693,87.06c-0.221-0.22-0.408-0.46-0.561-0.715c-8.213,6.447-18.565,10.292-29.814,10.292 c-13.342,0-25.422-5.408-34.167-14.152C5.408,73.74,0,61.661,0,48.318c0-13.342,5.408-25.422,14.152-34.166 C22.896,5.408,34.976,0,48.318,0L48.318,0z M77.082,19.555C69.721,12.193,59.551,7.641,48.318,7.641 c-11.233,0-21.403,4.553-28.764,11.914c-7.361,7.36-11.914,17.53-11.914,28.764s4.553,21.403,11.914,28.764 c7.361,7.361,17.531,11.914,28.764,11.914c11.233,0,21.402-4.553,28.764-11.914c7.361-7.36,11.914-17.53,11.914-28.764 S84.443,26.915,77.082,19.555L77.082,19.555z" />
		</g>
	</svg>);
export {
	ArrowRight,
	AngleDown,
	AngleUp,
	Save,
	ArrowSortingUp,
	ArrowSortingDown,
	Cancel,
	Reset,
	AnnouncementIco,
	Message,
	MessageBox,
	List,
	Group,
	GetAscIcon,
	GetDescIcon,
	GetDefaultIcon,
	CaretRight,
	Folder,
	CaretDown,
	HamburgerMenu,
	PlusCircle,
	AngleLeft,
	AngleRight,
	UsersAlt,
	Users,
	UserAdd,
	User,
	Trash,
	Star,
	ShoppingCart,
	Share,
	Share1,
	SettingsSliders,
	Settings,
	Search,
	Refresh,
	Picture,
	PhoneCall,
	Pencil,
	MenuBurger,
	Megaphone,
	Marker,
	Lock,
	ListCheck,
	Key,
	CompaniesDirectory,
	Info,
	Info2,
	Home,
	Heart,
	Globe,
	EyeCrossed,
	Eye,
	Exit,
	Edit,
	Download,
	Document,
	CrossCircle,
	Cross,
	CreditCard,
	Clock,
	Checkbox,
	Check,
	CheckCircle,
	ChartHistogram,
	Calendar,
	Bulb,
	Briefcase,
	Bell,
	ArrowSmallLeft,
	AngleSmallDown,
	Email,
	Man,
	Woman,
	Pet,
	BannerIcon,
	ManageRulesSetsIcon,
	Question,
	Question2,
	Child,
	Gift,
	Fileimage,
	SuggestionIcon,
	Category,
	Compress,
	Expand,
	Notification,
	UserIcon,
	DownIcon,
	EditIcon,
	PlayIcon,
	PlayIcon2,
	TreeViewIcon,
	ProfileIcon,
	CrossCircled,
	BackwardIcon,
	AngleLeftIcon,
	AngleRightIcon,
	ForwordIcon,
	Alerts,
	Dashboard,
	Reports,
	EducationEngagement,
	RecyclingWasteManagement,
	EquipmentMaintenance,
	CustomerService,
	MyAccount,
	Management,
	Logout,
	DropdownArrowDown,
	Camera,
	Planning,
	AddContent,
	Faq,
	PublishCourse,
	Quiz,
	UploadImage,
	Filter,
	Filter2,
	Composter,
	Recycle,
	World,
	Waste,
	Location,
	Map,
	Equalizer,
	Printer,
	Layout,
	Sorting,
	PDF,
	VideoLession,
	Certificate,
	Prerequisites,
	Plus,
	Minus,
	Cross2,
	ImportDoc,
	Grade,
	Architecture,
	Manager,
	Mail,
	Lender,
	Worker,
	NewDocument,
	Attachment,
	File,
	PdfFileIcon,
	XlsFileIcon,
	CsvFileIcon,
	RequireEnteries,
	User2,
	Dollars,
	Agenda,
	Repair,
	FullScreenIn,
	FullScreenOut,
	FileUpload,
	Menuicon,
	ReportsTracking,
	EquipmentManagementIcon,
	MaterialManagementIcon,
	VolumeManagementIcon,
	FrequencyManagementIcon,
	DiversionAdminIcon,
	AssignedContractorIcon,
	DraggableIcon,
	InfoIcon,
	Archive,
	PlayIcon3,
	ZoomIn,
	ZoomOut
};
