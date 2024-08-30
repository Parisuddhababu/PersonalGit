import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DNDReadingParagraphOrderSort, DndReadingParagraphSortableTableItem, QARecords } from 'src/types/activities/readingComprehension';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';

const SortableQAActivityItem = ({ item, editRecord, deleteRecord, editDisable }: DndReadingParagraphSortableTableItem) => {
	const { id } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr key={item.id} ref={setNodeRef} style={style}>
			<td className='cursor-default w-16'>
				<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing '>
					<Drag className='opacity-50' />
				</span>
			</td>
			<td>
				<audio src={item.traditionalPhrases[0].audio} controls>
					<track kind='captions' />
				</audio>
			</td>
			<td>
				<audio src={item.simplifiedPhrases[0].audio} controls>
					<track kind='captions' />
				</audio>
			</td>

			<td className='w-16'>
				<div className='flex gap-3'>
					<EditButton data={item} editRecord={editRecord} buttonSuccess={true} disable={editDisable?.id === item.id} />
					<DeleteButton data={item} isDeleteStatusModal={deleteRecord} btnDanger={true} disable={editDisable?.id === item.id} />
				</div>
			</td>
		</tr>
	);
};

const DNDReadingComprehensive = ({ dndItemRow, editRecord, deleteRecord, setNewOrder, editDisable }: DNDReadingParagraphOrderSort) => {
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
		setItems((items: QARecords[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableQAActivityItem key={item.id} item={item} index={index} editRecord={editRecord} deleteRecord={deleteRecord} editDisable={editDisable} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDReadingComprehensive);
