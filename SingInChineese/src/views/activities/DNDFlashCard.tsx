import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DNDFlashCardOrderSort, DndFlashCardOrderSortableTableItem, flashCardActivityList } from 'src/types/activities/flashCard';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import { FlashcardData } from '@config/constant';

const SortableFlashcardActivityItem = ({ item, editRecord, deleteRecord, editDisable }: DndFlashCardOrderSortableTableItem) => {
	const { id } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<>
			<tr key={item.id} ref={setNodeRef} style={style}>
				<td rowSpan={2} className='cursor-default w-16'>
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing '>
						<Drag className='opacity-50' />
					</span>
				</td>
				<td className='w-20'>
					<b>Traditional</b>
				</td>
				<td className='w-40'>{item.traditionalTitleChinese}</td>
				<td className='w-48'>{item.traditionalTitleEnglish}</td>
				<td className='w-48'>
					<audio src={item.traditionalAudioUrl} controls>
						<track kind='captions' />
					</audio>
				</td>
				<td>
					<audio src={item.traditionalGameAudioUrl} controls>
						<track kind='captions' />
					</audio>
				</td>

				<td rowSpan={2} className='w-20 text-center'>
					{item.isTextToSpeech ? FlashcardData.yes : FlashcardData.no}
				</td>
				<td rowSpan={2} className='w-20 text-center'>
					{item.categoryId ? FlashcardData.yes : FlashcardData.no}
				</td>
				<td rowSpan={2} className='w-20 text-center'>
					{item.isFlashCardText ? FlashcardData.text : FlashcardData.image}
				</td>
				<td rowSpan={2} className='w-40'>
					<div className='flex gap-3'>
						<EditButton data={item} editRecord={editRecord} buttonSuccess={true} disable={editDisable?.id == item.id} />
						<DeleteButton data={item.id} isDeleteStatusModal={deleteRecord} btnDanger={true} disable={editDisable?.id == item.id} />
					</div>
				</td>
			</tr>
			<tr key={`${item.id}-traditional`} ref={setNodeRef} style={style}>
				<td className='w-20'>
					<b>Simplified</b>
				</td>
				<td className='w-40'>{item.simplifiedTitleChinese}</td>
				<td className='w-48'>{item.simplifiedTitleEnglish}</td>
				<td className='w-48'>
					<audio src={item.simplifiedAudioUrl} controls>
						<track kind='captions' />
					</audio>
				</td>
				<td>
					<audio src={item.simplifiedGameAudioUrl} controls>
						<track kind='captions' />
					</audio>
				</td>
			</tr>
		</>
	);
};

const DNDFlashOrder = ({ dndItemRow, editRecord, deleteRecord, setNewOrder, editDisable }: DNDFlashCardOrderSort) => {
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
		setItems((items: flashCardActivityList[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableFlashcardActivityItem key={item.id} item={item} index={index} editRecord={editRecord} deleteRecord={deleteRecord} editDisable={editDisable} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDFlashOrder);
