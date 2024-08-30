import React from 'react';
import { TotalRecordProps } from 'src/types/component';

const TotalRecords = ({ length }: TotalRecordProps) => {
	return <span className='text-slate-400'>Total {length} Records</span>;
};

export default TotalRecords;
