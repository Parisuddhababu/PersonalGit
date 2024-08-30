import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/button/button';
import { Archive } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { EditComponentProps } from 'src/types/common';


const ArchiveBtn = ({ data, route }: EditComponentProps) => {
	const navigate = useNavigate();

	const editRedirection = useCallback(() => {
		navigate(`/${ROUTES.app}/${route}/edit/${data?.uuid}`);
	}, []);

	return (
		<Button className='bg-transparent btn-default btn-icon' onClick={editRedirection} label={''} title='Archive'>
			<Archive />
		</Button>
	);
};
export default ArchiveBtn;
