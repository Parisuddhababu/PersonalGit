import React from 'react';
import { CustomSelectProps } from 'src/types/select';

const CustomSelect = ({ options, value, onChange }: CustomSelectProps) => {
	return (
		<select className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onChange(e.target.value)} value={value}>
			{options.map((item: number, index: number) => {
				return <option key={index}>{item}</option>;
			})}
		</select>
	);
};

export default CustomSelect;
