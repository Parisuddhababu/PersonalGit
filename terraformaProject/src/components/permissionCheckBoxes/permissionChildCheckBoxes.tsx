import React from 'react';
import { PermissionCheckBoxesProps } from 'src/types/component';

const PermissionChildCheckBoxes = ({ child, childPermissionUpdate, parentIndex, childIndex }: PermissionCheckBoxesProps) => {
	return (
		<React.Fragment>
			<div className='flex gap-3 py-1 main'>
                <label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
                    <input type="checkbox" value={child.is_read} checked={child.is_read === 1 ? true : false} onChange={() => childPermissionUpdate(parentIndex, childIndex, 'is_read')} />												
                </label>
                <label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
                    <input type="checkbox" value={child.is_write} checked={child.is_write  === 1 ? true : false} onChange={() => childPermissionUpdate(parentIndex, childIndex, 'is_write')} />													
                </label>
                <label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
                    <input type="checkbox" value={child.is_update} checked={child.is_update === 1 ? true : false} onChange={() => childPermissionUpdate(parentIndex, childIndex, 'is_update')} />													
                </label>
                <label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
                    <input type="checkbox" value={child.is_remove} checked={child.is_remove  === 1 ? true : false} onChange={() => childPermissionUpdate(parentIndex, childIndex, 'is_remove')} />													
                </label>
			</div>
		</React.Fragment>
	);
};

export default React.memo(PermissionChildCheckBoxes);
