import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { Eye } from '@components/icons/icons';
import { ViewComponentProps } from 'src/types/common';

const ViewBtn = ({ data, route }: ViewComponentProps) => {
	const navigate = useNavigate();
	const viewRedirection = useCallback(() => {
		navigate(`/${ROUTES.app}/${route}/view/${data.uuid}`);
	}, []);
	return (
		<Button className='mx-1 bg-transparent btn-default btn-icon' onClick={viewRedirection} label={''} title='View'>
			<Eye className='text-success' />
		</Button>
	);
};
export default ViewBtn;
