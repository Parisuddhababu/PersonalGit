import Button from '@components/button/Button';
import { Copy, Globe, Key, Megaphone, UserAdd, UserMinus } from '@components/icons';
import React, { useCallback } from 'react';

// Define a generic type that represents the data you want to change password
type BtnProps<T> = {
	data: T;
	dataHandler: (data: T) => void;
	isPasswordChange?: boolean;
	isKaraoke?: boolean;
	isTranslate?: boolean;
	isCopy?: boolean;
	isDescription?: boolean;
	isAssignTeacher?: boolean;
	isUnAssignTeacher?: boolean;
	title: string;
	disable?: boolean;
};

function CommonButton<T>({ data, dataHandler, isPasswordChange = false, isTranslate = false, isKaraoke = false, isCopy = false, isDescription = false, isAssignTeacher = false, isUnAssignTeacher = false, title, disable = false }: Readonly<BtnProps<T>>) {
	const handleClick = useCallback(() => {
		dataHandler(data);
	}, [data, dataHandler]);

	return (
		<Button className='btn-default mx-1' onClick={handleClick} title={title} disabled={!!disable}>
			{isPasswordChange && <Key />}
			{isTranslate && <Globe />}
			{isKaraoke && <Megaphone />}
			{isCopy && <Copy />}
			{isDescription && 'View'}
			{isAssignTeacher && <UserAdd />}
			{isUnAssignTeacher && <UserMinus />}
		</Button>
	);
}

export default CommonButton;
