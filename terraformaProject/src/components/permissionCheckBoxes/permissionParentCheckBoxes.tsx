import React from 'react';
import { PermissionCheckBoxesProps } from 'src/types/component';

const PermissionParentCheckBoxes = ({ parent, parentPermissionUpdate, parentIndex }: PermissionCheckBoxesProps) => {
	return (
		<React.Fragment>
			<div className='flex gap-3 py-1 main'>
				<label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
					<input type="checkbox" value={parent.is_read} checked={parent.is_read === 1 ? true : false} onChange={() => parentPermissionUpdate(parentIndex, 'is_read')} />								
				</label>
				<label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
					<input type="checkbox" value={parent.is_write} checked={parent.is_write  === 1 ? true : false} onChange={() => parentPermissionUpdate(parentIndex, 'is_write')} />
				</label>
				<label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
					<input type="checkbox" value={parent.is_update} checked={parent.is_update === 1 ? true : false} onChange={() => parentPermissionUpdate(parentIndex, 'is_update')} />
				</label>
				<label className='w-20 text-left whitespace-nowrap min-w-[65px]'>
					<input type="checkbox" value={parent.is_remove} checked={parent.is_remove  === 1 ? true : false} onChange={() => parentPermissionUpdate(parentIndex, 'is_remove')} />
				</label>
			</div>
		</React.Fragment>
	);
};

export default React.memo(PermissionParentCheckBoxes);
