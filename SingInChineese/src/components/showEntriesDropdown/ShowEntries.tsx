import React from 'react';
import { SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { ShowEntriesOption } from 'src/types/component';
const ShowEntries = ({ onChange, value }: ShowEntriesOption) => {
	return (
		<div>
			<span>Shows</span>
			<select className='border rounded px-1 text-lg py-1 mx-3 mt-3 md:mt-0' onChange={(e) => onChange(e.target.value)} value={value}>
				{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
					return <option key={item}>{item}</option>;
				})}
			</select>
			<span>Entries</span>
		</div>
	);
};

export default React.memo(ShowEntries);
