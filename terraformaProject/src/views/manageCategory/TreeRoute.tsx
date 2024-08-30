import React, { useCallback } from 'react';
import Button from '@components/button/button';
import {  TreeViewIcon } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import {  TreeRouteComponentProps } from 'src/types/common';

const TreePageBtn = ({  route }: TreeRouteComponentProps) => {
	const navigate = useNavigate();

	const editRedirection = useCallback(() => {
		navigate(`/${ROUTES.app}/${route}/treeView`);
	}, [ROUTES]);

	return (
		<Button className='btn-primary btn-normal' onClick={editRedirection} label={'Category Tree View'}  title='Category Tree View' >
			<TreeViewIcon className='mr-2'/>
		</Button>
	);
};
export default TreePageBtn;