import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { DndLevelRowData, DndLevelSortableTableItem, LevelDataArr } from 'src/types/levels';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableLevelItem = ({ item, showDetails, editRecord, deleteLevelDataModal, onChangeStatus, count }: DndLevelSortableTableItem) => {
	const { levelName, order, isActive, id } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleLevel = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleLevel} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='text-center cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className=' w-12 text-center'>
				{order}
			</th>
			<td className='font-medium'>{levelName}</td>
			<td className='w-32 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td className='cursor-default' onClick={(e) => e.stopPropagation()}>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.LEVEL_MANAGEMENT.EditAccess]}>
						<EditButton data={item} editRecord={editRecord} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.LEVEL_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteLevelDataModal} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.LEVEL_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDLevel = ({ dndItemRow, showDetails, editRecord, deleteLevelDataModal, setOrderChanged, setNewOrder, onChangeStatus }: DndLevelRowData) => {
	const dataLevel = dndItemRow;
	const [itemsLevel, setItemsLevel] = useState(dndItemRow);

	useEffect(() => {
		setItemsLevel(dataLevel);
	}, [dataLevel]);

	useEffect(() => {
		setNewOrder(itemsLevel);
	}, [itemsLevel]);

	const onDragEndLevel = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsLevel((items: LevelDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndLevel} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsLevel} strategy={verticalListSortingStrategy}>
				{itemsLevel?.map((item, index) => (
					<SortableLevelItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteLevelDataModal={deleteLevelDataModal} onChangeStatus={onChangeStatus} count={itemsLevel.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDLevel);
