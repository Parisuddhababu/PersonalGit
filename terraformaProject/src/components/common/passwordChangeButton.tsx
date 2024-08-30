import React, { useCallback } from 'react';

import Button from '@components/button/button';
import { Key } from '@components/icons/icons';
import {  PasswordComponentsProps } from 'src/types/common';

const PasswordBtn = ({ data, setObj, setIsChangePassword }: PasswordComponentsProps) => {
	const deleteData = useCallback(() => {
		setObj(data);
		setIsChangePassword(true);
	}, []);
	return (
		<Button className='btn-default' onClick={deleteData} label={''} title=''>
			<Key />
		</Button>
	);
};
export default PasswordBtn;
