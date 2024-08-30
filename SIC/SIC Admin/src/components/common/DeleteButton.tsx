import Button from '@components/button/Button';
import { Trash } from '@components/icons';
import React, { useCallback } from 'react';

// Define a generic type that represents the data you want to delete
type DeleteBtnProps<T> = {
	data: T;
	isDeleteStatusModal: (data: T) => void;
	btnDanger?: boolean;
	disable?: boolean;
};

function DeleteButton<T>({ data, isDeleteStatusModal, btnDanger = false, disable = false }: DeleteBtnProps<T>) {
	const handleClick = useCallback(() => {
		isDeleteStatusModal(data);
	}, [data, isDeleteStatusModal]);

	return (
		<Button className={btnDanger ? 'btn-danger mx-1' : 'btn-default mx-1'} onClick={handleClick} title='Delete Record' disabled={!!disable}>
			<Trash />
		</Button>
	);
}

export default DeleteButton;
