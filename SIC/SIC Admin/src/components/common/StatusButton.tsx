import React, { useCallback } from 'react';
import Switch from '@components/checkbox/Switch';

// Define a generic type that represents the data you want to change status
type StatusBtnProps<T> = {
	data: T;
	isChangeStatusModal: (data: T) => void;
	status: string;
	checked: boolean;
	disable?: boolean;
};

function StatusButton<T>({ data, isChangeStatusModal, status, checked, disable = false }: StatusBtnProps<T>) {
	const handleChange = useCallback(() => {
		isChangeStatusModal(data);
	}, [data, isChangeStatusModal]);

	return <Switch onChange={handleChange} status={status} checked={checked} disabled={!!disable} />;
}

export default StatusButton;
