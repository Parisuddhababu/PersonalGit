import React, { useCallback } from 'react';
import Button from '@components/button/button';
import { Lock,  } from '@components/icons/icons';
import { DeleteComponentsProps } from 'src/types/common';

const ChangePassword = ({ data, setObj, setIsDelete, className }: DeleteComponentsProps) => {

	const  onChangePassword = useCallback(() => {
		setObj(data);
		setIsDelete(true);
	}, []);

	return (
		<Button className={`bg-transparent cursor-pointer btn-default ${className}`} onClick={onChangePassword} label={''} title='Change Password'>
			<Lock className='fill-error' />
		</Button>
	);
};
export default ChangePassword;