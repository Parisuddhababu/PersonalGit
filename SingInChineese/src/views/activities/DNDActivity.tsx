import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag, Pencil } from '@components/icons';
import { ActivityDataArr, DndActivityRowData, DndActivitySortableTableItem } from 'src/types/activities';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Link } from 'react-router-dom';
import DeleteButton from '@components/common/DeleteButton';
import StatusButton from '@components/common/StatusButton';
import CheckBox from '@components/checkbox/CheckBox';
import CommonButton from '@components/common/CommonButton';
import RoleBaseGuard from '@components/roleGuard/roleGuard';
import { permissionsArray } from '@config/permissions';

const SortableActivityItem = ({ item, deleteActivityDataModal, onChangeStatus, copyRecord, count, onSelect, selectedActivities }: DndActivitySortableTableItem) => {
	const { id, activityTypeName, isActive, order, title } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleActivity = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleActivity}>
			<td className='w-10 text-center'>
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
			<td className='w-10 cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-12 text-center'>
				{order}
			</th>
			<td className='font-medium'>{title}</td>
			<td>{activityTypeName}</td>
			<td className='w-10 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.ACTIVITY_MANAGEMENT.EditAccess]}>
						<Link className='btn btn-default mx-1' to={`activity/${item.activityTypeId}/${item.uuid}`} title='Edit Record'>
							<Pencil />
						</Link>
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.ACTIVITY_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteActivityDataModal} />
					</RoleBaseGuard>
					<CommonButton data={item.uuid} dataHandler={copyRecord} isCopy={true} title='Copy Record' />
					<RoleBaseGuard permissions={[permissionsArray.ACTIVITY_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDActivity = ({ dndItemRow, editRecord, deleteActivityDataModal, copyRecord, setOrderChanged, setNewOrder, onChangeStatus, onSelect, selectedActivities }: DndActivityRowData) => {
	const dataActivity = dndItemRow;
	const [itemsActivity, setItemsActivity] = useState(dndItemRow);

	useEffect(() => {
		setItemsActivity(dataActivity);
	}, [dataActivity]);

	useEffect(() => {
		setNewOrder(itemsActivity);
	}, [itemsActivity]);

	const onDragEndActivity = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsActivity((items: ActivityDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndActivity} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsActivity} strategy={verticalListSortingStrategy}>
				{itemsActivity?.map((item) => (
					<SortableActivityItem selectedActivities={selectedActivities} copyRecord={copyRecord} key={item.id} item={item} index={item.order} editRecord={editRecord} deleteActivityDataModal={deleteActivityDataModal} onChangeStatus={onChangeStatus} count={itemsActivity.length} onSelect={onSelect} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDActivity);
