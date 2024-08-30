import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { TopicDataArr, DndTopicRowData, DndTopicSortableTableItem } from 'src/types/topic';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import CommonButton from '@components/common/CommonButton';

const SortableItem = ({ item, showDetails, editRecord, deleteLevelDataModal, onChangeStatus, addEditKaraoke, count }: DndTopicSortableTableItem) => {
	const { name, isActive, id, order } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleDndTopic = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleDndTopic} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-20 text-center'>
				{order}
			</th>
			<td className='font-medium'>{name}</td>
			<td className='w-32 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td onClick={(e) => e.stopPropagation()}>
				<div className='flex items-center'>
					<CommonButton data={item} dataHandler={addEditKaraoke} isKaraoke={true} title='Karaoke' />
					<EditButton data={item} editRecord={editRecord} />
					<DeleteButton data={item} isDeleteStatusModal={deleteLevelDataModal} />
					<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
				</div>
			</td>
		</tr>
	);
};

const DNDTopic = ({ dndItemRow, showDetails, editRecord, deleteLevelDataModal, setOrderChanged, setNewOrder, onChangeStatus, addEditKaraoke }: DndTopicRowData) => {
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
		setItems((items: TopicDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteLevelDataModal={deleteLevelDataModal} onChangeStatus={onChangeStatus} addEditKaraoke={addEditKaraoke} count={items.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDTopic);
