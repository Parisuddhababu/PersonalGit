import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { DndItem, DndListItem, DndSortableListItem } from 'src/types/lesson';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import DeleteButton from '@components/common/DeleteButton';

const SortableItem = ({ item, removeItem, count }: DndSortableListItem) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<li ref={setNodeRef} style={style} className='bg-gray-100 flex rounded border mt-1 p-2 items-start'>
			{count > 1 && (
				<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing'>
					<Drag className='opacity-50' />
				</span>
			)}
			<p className='w-full'>
				{item.english}
				<br />
				<small className='text-gray-400'>{item.chinese}</small>
			</p>
			<DeleteButton data={item.id} isDeleteStatusModal={removeItem} />
		</li>
	);
};

const DndList = ({ dndItemList, removeItem }: DndItem) => {
	const data = dndItemList;
	const [items, setItems] = useState(data);

	useEffect(() => {
		setItems(data);
	}, [data]);

	const onDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setItems((items: DndListItem[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);
	return (
		<ul className='mt-4'>
			<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
				<SortableContext items={items} strategy={verticalListSortingStrategy}>
					{items.map((item) => (
						<SortableItem key={item.id} item={item} removeItem={removeItem} count={items.length} />
					))}
				</SortableContext>
			</DndContext>
		</ul>
	);
};
export default React.memo(DndList);
