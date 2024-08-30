import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DndRowData, DndSortableTableItem, OnboardingDataArr } from 'src/types/onboarding';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableItem = ({ item, showDetails, editRecord, deleteTopicData, count, onChangeStatus }: DndSortableTableItem) => {
	const { title, image, isActive } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

	const styleDndTable = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleDndTable} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-20 text-center'>
				{item.order}
			</th>
			<td>
				<p>{title}</p>
			</td>
			<td className='w-40'>
				{image.includes('.mp4') || image.includes('.mov') ? (
					<video controlsList='nodownload noremoteplayback' disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className='border rounded w-32 min-w-[80px] h-16 min-h-[60px]' src={image} controls>
						<track kind='captions' />
					</video>
				) : (
					<img className='border rounded w-32 min-w-[80px] h-16 min-h-[60px]' src={image} alt='preview' />
				)}
			</td>
			<td className='w-32 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td className='cursor-default' onClick={(e) => e.stopPropagation()}>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.ONBOARDING_MANAGEMENT.EditAccess]}>
						<EditButton data={item} editRecord={editRecord} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.ONBOARDING_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteTopicData} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.ONBOARDING_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DndTable = ({ dndItemRow, showDetails, editRecord, deleteTopicData, setDisableData, setOrderChanged, setNewOrder, onChangeStatus }: DndRowData) => {
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
		setItems((items: OnboardingDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteTopicData={deleteTopicData} setDisableData={setDisableData} count={items.length} onChangeStatus={onChangeStatus} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DndTable);
