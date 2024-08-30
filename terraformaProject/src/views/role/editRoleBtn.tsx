import Button from '@components/button/button';
import { Edit } from '@components/icons/icons';
import React, { useCallback } from 'react';
import { RoleEditComponentsProps } from 'src/types/common';

const EditRoleBtn = ({ data,setRoleObj, setIsRoleModelShow, setRoleVal,setIsRoleEditable }: RoleEditComponentsProps) => {
	
    const editData = useCallback(() => {
        setRoleObj(data);
		setIsRoleModelShow(true);
		setRoleVal(data.name);
		setIsRoleEditable(true);
	}, [data]);

   
	return (
		<Button className='bg-transparent btn-default' onClick={editData} label={''}  title='Edit'>
            <Edit />
		</Button>
	);
};
export default EditRoleBtn;