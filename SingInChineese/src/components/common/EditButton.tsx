import Button from '@components/button/Button';
import { Pencil } from '@components/icons';
import React, { useCallback } from 'react';

// Define a generic type that represents the data you want to edit
type EditBtnProps<T> = {
	data: T;
	editRecord: (data: T) => void;
	buttonSuccess?: boolean;
	disable?: boolean;
};

function EditButton<T>({ data, editRecord, buttonSuccess = false, disable = false }: Readonly<EditBtnProps<T>>) {
	const handleClick = useCallback(() => {
		editRecord(data);
	}, [data, editRecord]);

	return (
		<Button className={buttonSuccess ? 'btn-success mx-1' : 'btn-default mx-1'} onClick={handleClick} title='Edit Record' disabled={!!disable}>
			<Pencil />
		</Button>
	);
}

export default EditButton;
