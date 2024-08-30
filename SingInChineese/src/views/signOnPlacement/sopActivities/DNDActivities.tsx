import React, { useCallback, useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Drag, Pencil } from '@components/icons';
import { DndQuestionRowData, DndQuestionSortableTableItem, QuestionDataArr } from 'src/types/question';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Link } from 'react-router-dom';
import CheckBox from '@components/checkbox/CheckBox';
import StatusButton from '@components/common/StatusButton';
import DeleteButton from '@components/common/DeleteButton';
import CommonButton from '@components/common/CommonButton';
import { permissionsArray } from '@config/permissions';
import RoleBaseGuard from '@components/roleGuard/roleGuard';

const SortableSopActivityItem = ({ item, deleteQuestionDataModal, onChangeStatus, count, onSelect, selectedActivities, copyRecord }: DndQuestionSortableTableItem) => {
	const { id, activityTypeName, isActive, order, title } = item;
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const styleSop = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<tr ref={setNodeRef} style={styleSop}>
			<td className='w-14 text-center'>
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
			<td className='w-14 cursor-default'>
				{count > 1 && (
					<span {...listeners} {...attributes} className='py-1.5 px-3 border rounded cursor-grab active:cursor-grabbing'>
						<Drag className='opacity-50' />
					</span>
				)}
			</td>
			<th scope='row' className='w-16 text-center'>
				{order}
			</th>
			<td className='font-medium'>{title}</td>
			<td>{activityTypeName}</td>
			<td className='w-14 text-center'>{isActive ? <span className='badge badge-success w-20 rounded-md'>Active</span> : <span className='badge badge-danger w-20 rounded-md'>Inactive</span>}</td>
			<td>
				<div className='flex justify-center items-center'>
					<RoleBaseGuard permissions={[permissionsArray.SOP_ACTIVITY_MANAGEMENT.EditAccess]}>
						<Link className='btn btn-default mx-1' to={`signOnPlacementActivity/${item.activityTypeId}/${item.uuid}`} title='Edit Record'>
							<Pencil />
						</Link>
					</RoleBaseGuard>
					<RoleBaseGuard permissions={[permissionsArray.SOP_ACTIVITY_MANAGEMENT.DeleteAccess]}>
						<DeleteButton data={item} isDeleteStatusModal={deleteQuestionDataModal} />
					</RoleBaseGuard>
					<CommonButton data={item.uuid} dataHandler={copyRecord} isCopy={true} title='Copy Record' />
					<RoleBaseGuard permissions={[permissionsArray.SOP_ACTIVITY_MANAGEMENT.ChangeStatusAccess]}>
						<StatusButton data={item} isChangeStatusModal={onChangeStatus} status={`${isActive}`} checked={isActive} />
					</RoleBaseGuard>
				</div>
			</td>
		</tr>
	);
};

const DNDSopActivity = ({ dndItemRow, editRecord, deleteQuestionDataModal, setOrderChanged, setNewOrder, onChangeStatus, onSelect, selectedActivities, copyRecord }: DndQuestionRowData) => {
	const dataSopActivity = dndItemRow;
	const [itemsSopActivity, setItemsSopActivity] = useState(dndItemRow);

	useEffect(() => {
		setItemsSopActivity(dataSopActivity);
	}, [dataSopActivity]);

	useEffect(() => {
		setNewOrder(itemsSopActivity);
	}, [itemsSopActivity]);

	const onDragEndSopActivity = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id === over?.id) {
			return;
		}
		setOrderChanged(true);
		setItemsSopActivity((items: QuestionDataArr[]) => {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}, []);

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={onDragEndSopActivity} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
			<SortableContext items={itemsSopActivity} strategy={verticalListSortingStrategy}>
				{itemsSopActivity?.map((item, index) => (
					<SortableSopActivityItem copyRecord={copyRecord} key={item.id} item={item} index={index} editRecord={editRecord} deleteQuestionDataModal={deleteQuestionDataModal} onChangeStatus={onChangeStatus} count={itemsSopActivity.length} onSelect={onSelect} selectedActivities={selectedActivities} />
				))}
			</SortableContext>
		</DndContext>
	);
};

export default React.memo(DNDSopActivity);
