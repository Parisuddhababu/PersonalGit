import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { DndSubscriptionRowData, DndSubscriptionSortableTableItem, SubscriptionArr } from 'src/types/subscription';
import { CSS } from '@dnd-kit/utilities';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';

const SortableItem = ({ item, showDetails, editRecord, deleteSubscription, onChangeStatus, count }: DndSubscriptionSortableTableItem) => {
	const { isActive, order, planName, planDescription, planPrice, allowedChildCount, freeTrialDuration } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

	const styleSubscription = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleSubscription} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-10 text-center'>
				{order}
			</th>
			<td className='font-medium'>{planName}</td>
			<td>{planDescription}</td>
			<td className='w-20'>
				<strong className='mr-1'>$</strong>
				{planPrice}
			</td>
			<td className='w-20 text-center'>{allowedChildCount}</td>
			<td className='w-40 text-center'>{freeTrialDuration}</td>
			<td className='w-10 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td onClick={(e) => e.stopPropagation()} className='w-36'>
				<div className='flex items-center'>
					<EditButton data={item} editRecord={editRecord} />
					<DeleteButton data={item} isDeleteStatusModal={deleteSubscription} />
					<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
				</div>
			</td>
		</tr>
	);
};

const DNDSubscription = ({ dndItemRow, showDetails, editRecord, deleteSubscription, setOrderChanged, setNewOrder, onChangeStatus, setDisabled }: DndSubscriptionRowData) => {
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
		setItems((items: SubscriptionArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteSubscription={deleteSubscription} onChangeStatus={onChangeStatus} setDisabled={setDisabled} count={items.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDSubscription);
