import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { DndSeasonalTopicRowData, DndSeasonalTopicSortableTableItem, SeasonalTopicDataArr } from 'src/types/seasonalTopics';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { getDateFromUTCstamp } from '@utils/helpers';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import CommonButton from '@components/common/CommonButton';

const SortableItem = ({ item, showDetails, editRecord, deleteLevelDataModal, onChangeStatus, addEditKaraokeSeasonal, count }: DndSeasonalTopicSortableTableItem) => {
	const { name, isActive, id, order, image, startDate, endDate } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleSeasonalTopic = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleSeasonalTopic} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='cursor-default text-center'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-20 text-center'>
				{order}
			</th>
			<td className='font-medium'>{name}</td>
			<td className='w-40 text-center'>
				<p>{getDateFromUTCstamp(startDate)}</p>
			</td>
			<td className='w-40 text-center'>
				<p>{getDateFromUTCstamp(endDate)}</p>
			</td>
			<td className='w-40 text-center'>
				<img className='border rounded w-32 min-w-[80px] h-20 min-h-[80px]' src={image} alt='pet' />
			</td>
			<td className='w-32 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td onClick={(e) => e.stopPropagation()}>
				<div className='flex items-center'>
					<CommonButton data={item} dataHandler={addEditKaraokeSeasonal} isKaraoke={true} title='Karaoke' />
					<EditButton data={item} editRecord={editRecord} />
					<DeleteButton data={item} isDeleteStatusModal={deleteLevelDataModal} />
					<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
				</div>
			</td>
		</tr>
	);
};

const DNDSeasonalTopic = ({ dndItemRow, showDetails, editRecord, deleteLevelDataModal, setOrderChanged, setNewOrder, onChangeStatus, addEditKaraokeSeasonal }: DndSeasonalTopicRowData) => {
	const dataSeasonalTopic = dndItemRow;
	const [itemsSeasonalTopic, setItemsSeasonalTopic] = useState(dndItemRow);

	useEffect(() => {
		setItemsSeasonalTopic(dataSeasonalTopic);
	}, [dataSeasonalTopic]);

	useEffect(() => {
		setNewOrder(itemsSeasonalTopic);
	}, [itemsSeasonalTopic]);

	const onDragEndSeasonalTopic = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsSeasonalTopic((items: SeasonalTopicDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndSeasonalTopic} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsSeasonalTopic} strategy={verticalListSortingStrategy}>
				{itemsSeasonalTopic?.map((item, index) => (
					<SortableItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteLevelDataModal={deleteLevelDataModal} onChangeStatus={onChangeStatus} addEditKaraokeSeasonal={addEditKaraokeSeasonal} count={itemsSeasonalTopic.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDSeasonalTopic);
