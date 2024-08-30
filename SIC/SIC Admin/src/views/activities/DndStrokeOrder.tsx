import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag } from '@components/icons';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { DNDStrokeOrderSort, DndStrokeOrderSortableTableItem } from 'src/types/activities';
import Iframe from '@components/sourceCodePreview/Iframe';
import EditButton from '@components/common/EditButton';
import DeleteButton from '@components/common/DeleteButton';
import Button from '@components/button/Button';
import { strokeOrderSubmitList } from 'src/types/activities/strokeOrder';

const SortableItem = ({ item, editRecord, deleteStrokeOrder, editDisable }: DndStrokeOrderSortableTableItem) => {
	const { id } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
	const [preview, setPreview] = useState<boolean>(false);

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	const showPreviewHandler = useCallback(() => {
		setPreview(true);
	}, [preview]);

	const closePreviewHandler = useCallback(() => {
		setPreview(false);
	}, [preview]);

	return (
		<tr ref={setNodeRef} style={style}>
			<td className='cursor-default w-16'>
				<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded mr-3 cursor-grab active:cursor-grabbing '>
					<Drag className='opacity-50' />
				</span>
			</td>
			<td>
				<b>T : </b> {item.leftTraditionalTitleEnglish}
				<br />
				<b>S : </b> {item.leftSimplifiedTitleEnglish}
			</td>
			<td>
				<b>T : </b> {item.leftTraditionalTitlePinyin}
				<br />
				<b>S : </b> {item.leftSimplifiedTitlePinyin}
			</td>
			<td>
				<b>T : </b> {item.leftTraditionalTitleChinese}
				<br />
				<b>S : </b> {item.leftSimplifiedTitleChinese}
			</td>
			<td className='w-40 text-center'>
				<Button className='btn-primary' onClick={showPreviewHandler}>
					Preview
				</Button>
				{preview && <Iframe content={item.htmlSourceCode} onClose={closePreviewHandler} />}
			</td>
			<td className='w-40'>
				<img src={item?.simplifiedFileUrl} className='border rounded w-28 min-w-[80px] mx-auto' />
			</td>
			<td className='w-16'>
				<div className='flex gap-3'>
					<EditButton data={item.id} editRecord={editRecord} buttonSuccess={true} disable={editDisable} />
					<DeleteButton data={item.id} isDeleteStatusModal={deleteStrokeOrder} btnDanger={true} disable={editDisable} />
				</div>
			</td>
		</tr>
	);
};

const DNDStrokeOrder = ({ dndItemRow, editRecord, deleteStrokeOrder, setNewOrder, editDisable }: DNDStrokeOrderSort) => {
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
		setItems((items: strokeOrderSubmitList[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{items?.map((item, index) => (
					<SortableItem key={item.id} item={item} index={index} editRecord={editRecord} deleteStrokeOrder={deleteStrokeOrder} editDisable={editDisable} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDStrokeOrder);
