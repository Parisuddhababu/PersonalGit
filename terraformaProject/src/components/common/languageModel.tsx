import React from 'react';

import i18n from 'src/i18n';
import { LanguageModelProps } from 'src/types/common';

const Language = ({ onClick }: LanguageModelProps) => {
	const handler = (value: string) => {
		i18n.changeLanguage(value);
		onClick();
	};
	return (
		<div className={'lang absolute flex flex-col   border border-[#c8ced3]   bg-white min-w-[160px] rounded  font-normal  '}>
			<a onClick={() => handler('en')} className=' text-primary border-b border-[#c8ced3] hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] focus:bg-primary text-[0.875rem]'>
				{/* <User className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' /> */}
				EN
			</a>
			<a onClick={() => handler('es')} className='  text-primary hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] text-[0.875rem]   '>
				{/* <Lock className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' /> */}
				ES
			</a>
		</div>
	);
};
export default Language;
