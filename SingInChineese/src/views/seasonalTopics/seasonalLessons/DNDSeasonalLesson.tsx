import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag, Pencil } from '@components/icons';
import { DndSeasonalLessonRowData, DndSeasonalLessonSortableTableItem, SeasonalLessonsDataArr } from 'src/types/seasonalTopics';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import { Link } from 'react-router-dom';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableSeasonalLessonItem = ({ item, showDetails, deleteLessonDataModal, onChangeStatus, count }: DndSeasonalLessonSortableTableItem) => {
	const { id } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={style} className='cursor-pointer' onClick={() => showDetails(item)}>
			<td onClick={(e) => e.stopPropagation()} className='cursor-default text-center'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-20 text-center'>
				{item?.order}
			</th>
			<td className='font-medium'>{item?.name}</td>
			<td className='w-20 text-center'>{item?.isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td className='cursor-default' onClick={(e) => e.stopPropagation()}>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_LESSON_MANAGEMENT.EditAccess]}>
						<Link className='btn btn-default mx-1' to={`seasonalLesson/${item.uuid}`} title='Edit Record'>
							<Pencil />
						</Link>
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_LESSON_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteLessonDataModal} />
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_LESSON_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${item?.isActive}`} checked={item?.isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDLesson = ({ dndItemRow, showDetails, editRecord, deleteLessonDataModal, setOrderChanged, setNewOrder, onChangeStatus }: DndSeasonalLessonRowData) => {
	const data = dndItemRow;
	const [itemsDNDSeasonalLesson, setItemsDNDSeasonalLesson] = useState(dndItemRow);

	useEffect(() => {
		setItemsDNDSeasonalLesson(data);
	}, [data]);

	useEffect(() => {
		setNewOrder(itemsDNDSeasonalLesson);
	}, [itemsDNDSeasonalLesson]);

	const onDragEndSeasonalLesson = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsDNDSeasonalLesson((items: SeasonalLessonsDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndSeasonalLesson} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsDNDSeasonalLesson} strategy={verticalListSortingStrategy}>
				{itemsDNDSeasonalLesson?.map((item, index) => (
					<SortableSeasonalLessonItem key={item.id} item={item} showDetails={showDetails} index={index} editRecord={editRecord} deleteLessonDataModal={deleteLessonDataModal} onChangeStatus={onChangeStatus} count={itemsDNDSeasonalLesson.length} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDLesson);
