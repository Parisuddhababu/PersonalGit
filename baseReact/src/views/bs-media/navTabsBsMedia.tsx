import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsMediaNavTabsProps } from '@type/bsMedia';

const NavtabsBsMedia = ({ data, onClick, activeTab }: BsMediaNavTabsProps) => {
	const { t } = useTranslation();
	const handleClick = () => {
		onClick(data?.id);
	};
	return (
		<li id={data.id} onClick={handleClick} className={` ${activeTab === data?.id ? 'nav-tab-active -mb-1px' : ''} cursor-pointer `} key={data?.id}>
			<a className='h-full w-full flex px-4 py-2 text-primary items-center hover:border  rounded-t  border-b border-b-white  '>
				<span id='2' className='inline-block w-4 h-4 mr-1 svg-icon'>
					{data?.icon}
				</span>
				{t(data?.name)}
			</a>
		</li>
	);
};

export default NavtabsBsMedia;
