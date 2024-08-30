import React, { useCallback } from 'react';

import Button from '@components/button/button';
import { Trash } from '@components/icons/icons';
import { DeleteComponentsProps } from 'src/types/common';

const DeleteBtn = ({ data, setObj, setIsDelete, className ,customClick }: DeleteComponentsProps) => {

	const deleteData = useCallback(() => {
		setObj(data);
		!customClick && setIsDelete(true);
		customClick && customClick(data);
	}, []);

	return (
		<Button className={`bg-transparent cursor-pointer btn-default btn-icon ${className}`} onClick={deleteData} label={''} title='Delete'>
			<Trash className='fill-error' />
		</Button>
	);
};
export default DeleteBtn;
