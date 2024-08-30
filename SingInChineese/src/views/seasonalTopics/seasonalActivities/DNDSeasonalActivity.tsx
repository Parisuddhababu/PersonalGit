import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag, Pencil } from '@components/icons';
import { DndSeasonalActivityRowData, DndSeasonalActivitySortableTableItem, SeasonalActivityDataArr } from 'src/types/seasonalTopics';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Link } from 'react-router-dom';
import CheckBox from '@components/checkbox/CheckBox';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import CommonButton from '@components/common/CommonButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableSeasonalActivityItem = ({ item, deleteActivityDataModal, onChangeStatus, copyRecord, count, onSelect, selectedActivities }: DndSeasonalActivitySortableTableItem) => {
	const { id, activityTypeName, isActive, order, title } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleSeasonal = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleSeasonal}>
			<td className='w-12 text-center'>
				<CheckBox
					option={[
						{
							value: '',
							checked: selectedActivities.some((item1) => item.uuid === item1),
							name: '',
							onChange() {
								onSelect(item.uuid);
							},
						},
					]}
				/>
			</td>
			<td className='w-12 cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-14 text-center'>
				{order}
			</th>
			<td className='font-medium'>{title}</td>
			<td>{activityTypeName}</td>
			<td className='w-12 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_ACTIVITY_MANAGEMENT.EditAccess]}>
						<Link className='btn btn-default mx-1' to={`seasonalActivity/${item.activityTypeId}/${item.uuid}`} title='Edit Record'>
							<Pencil />
						</Link>
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_ACTIVITY_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteActivityDataModal} />
					</RoleBaseGuard>
					<CommonButton data={item.uuid} dataHandler={copyRecord} isCopy={true} title='Copy Record' />
					<RoleBaseGuard permissions={[permissionsArray.SEASONAL_ACTIVITY_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDSeasonalActivity = ({ dndItemRow, editRecord, deleteActivityDataModal, setOrderChanged, setNewOrder, onChangeStatus, onSelect, selectedActivities, copyRecord }: DndSeasonalActivityRowData) => {
	const dataSeasonalActivity = dndItemRow;
	const [itemsSeasonalActivity, setItemsSeasonalActivity] = useState(dndItemRow);

	useEffect(() => {
		setItemsSeasonalActivity(dataSeasonalActivity);
	}, [dataSeasonalActivity]);

	useEffect(() => {
		setNewOrder(itemsSeasonalActivity);
	}, [itemsSeasonalActivity]);

	const onDragEndSeasonalActivity = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsSeasonalActivity((items: SeasonalActivityDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndSeasonalActivity} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsSeasonalActivity} strategy={verticalListSortingStrategy}>
				{itemsSeasonalActivity?.map((item, index) => (
					<SortableSeasonalActivityItem copyRecord={copyRecord} key={item.id} item={item} index={index} editRecord={editRecord} deleteActivityDataModal={deleteActivityDataModal} onChangeStatus={onChangeStatus} count={itemsSeasonalActivity.length} onSelect={onSelect} selectedActivities={selectedActivities} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDSeasonalActivity);
