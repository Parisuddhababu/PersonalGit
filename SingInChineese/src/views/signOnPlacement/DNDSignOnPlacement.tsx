import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { DndSOPRowData, DndSOPSortableTableItem } from 'src/types/lesson';
import { LevelArr } from 'src/types/exam';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableSopLevelItem = ({ item, showDetails, editRecord, deleteExamData, onChangeStatus, count }: DndSOPSortableTableItem) => {
	const { levelName, isActive, order } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={style} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='text-center cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-20 text-center'>
				{order}
			</th>
			<td className='font-medium'>{levelName}</td>
			<td className='w-10 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td className='cursor-default' onClick={(e) => e.stopPropagation()}>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.SOP_LEVEL_MANAGEMENT.EditAccess]}>
						<EditButton data={item} editRecord={editRecord} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SOP_LEVEL_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteExamData} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SOP_LEVEL_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDSignOnPlacement = ({ dndItemRow, showDetails, editRecord, deleteExamData, setOrderChanged, setNewOrder, onChangeStatus }: DndSOPRowData) => {
	const data = dndItemRow;
	const [items, setItems] = useState(dndItemRow);

	useEffect(() => {
		setItems(data);
	}, [data]);

	useEffect(() => {
		setNewOrder(items);
	}, [items]);

	const onDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItems((items: LevelArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableSopLevelItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteExamData={deleteExamData} onChangeStatus={onChangeStatus} count={items.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDSignOnPlacement);
