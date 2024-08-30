import React from 'react';

import Button from '@components/button/button';
import { Edit } from '@components/icons/icons';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditBtnPopup = ({ data, onClick, className , setData }: any) => {

	const editRedirection = () => {
		onClick(data?.uuid); 
		setData && setData(data);
	};

	return (
		<Button className={`bg-transparent btn-default ${className}`} onClick={editRedirection} label={''} title='Edit'>
			<Edit />
		</Button>
	);
};
export default EditBtnPopup;
