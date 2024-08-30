import React, { useCallback, useEffect, useState } from 'react';
import { CheckBoxTreeProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { DEFAULT_GRID_VIEW_COLUMNS } from '@config/constant';
import StatusButton from '@components/common/StatusButton';

const GridView = ({ nodes, checkedChild, onChangeCheckedChildHandler, columns = DEFAULT_GRID_VIEW_COLUMNS, disable }: CheckBoxTreeProps) => {
	const [parentNodes, setParentNodes] = useState<string[]>([]);
	const [childNodes, setChildNodes] = useState<string[]>(checkedChild);

	/**
	 * Method is used to fetch the childList from Api
	 */
	useEffect(() => {
		setChildNodes(checkedChild);
	}, [checkedChild]);

	/**
	 *
	 * @param value Method it is used to check and uncheck Parent element
	 */
	const onChangeHandler = (value: string) => {
		if (parentNodes.includes(value)) {
			setParentNodes((currentParentNodes) => currentParentNodes.filter((currentParentValue) => currentParentValue !== value));

			// Gather all child nodes of the parent node to be removed
			const childNodesToRemove = nodes.find((parentNodeData) => parentNodeData.id === value)?.children.map((child) => child.value) || [];

			setChildNodes((currentChildNodes) => currentChildNodes.filter((currentChildValue) => !childNodesToRemove.includes(currentChildValue)));
		} else {
			setParentNodes((currentParentNodes) => [...currentParentNodes, value]);

			// Gather all child nodes of the parent node to be added
			const childNodesToAdd = nodes.find((parentNodeData) => parentNodeData.id === value)?.children.map((child) => child.value) || [];

			setChildNodes((currentChildNodes) => [
				...Array.from(new Set([...currentChildNodes, ...childNodesToAdd])), // Convert Set back to Array
			]);
		}
	};

	/**
	 * Method is used to set the parent
	 */
	useEffect(() => {
		nodes.forEach((parentNodeData) => {
			if (
				parentNodeData.children
					.map((childData) => {
						return childData.value;
					})
					.every((childValue) => childNodes.includes(childValue))
			) {
				setParentNodes((currentParentNodes) => [...currentParentNodes, parentNodeData.id]);
			} else {
				setParentNodes((currentParentNodes) => currentParentNodes.filter((currentParentId) => currentParentId != parentNodeData.id));
			}
		});
	}, [childNodes]);

	/**
	 *
	 * @param value it is used to check child element
	 */
	const onChangeChildHandler = useCallback(
		(value: string) => {
			if (childNodes.includes(value)) {
				setChildNodes((item) => item.filter((i) => i !== value));
			} else {
				setChildNodes((item) => [...item, value]);
			}
		},
		[childNodes]
	);

	/**
	 * method is used to send the child to other component
	 */
	useEffect(() => {
		onChangeCheckedChildHandler(childNodes);
	}, [onChangeChildHandler]);

	return (
		<ul className={`grid gap-4 mt-4 grid-cols-1 lg:grid-cols-${columns}`}>
			{nodes.map((item) => {
				return (
					<li key={item.value} className='border rounded shadow-sm'>
						<div className='flex items-center py-2 px-3 bg-gray-100 font-medium'>
							{item.label}
							<div className={`ml-auto ${cn(FormClasses['form-group'])}`}>
								<div className={cn(FormClasses['checkbox-group'])}>
									<label htmlFor={item.id} className={`${cn(FormClasses['checkbox-item'])} items-center`}>
										<input className={cn(FormClasses['form-control'])} id={item.id} type='checkbox' name={item.id} onChange={(e) => onChangeHandler(e.target.id)} checked={parentNodes.includes(item.id)} disabled={disable} />
										<span>All</span>
									</label>
								</div>
							</div>
						</div>
						<ul className='mb-0'>
							{item.children.map((i) => (
								<li key={i.value} className='px-4 py-3 border-b font-medium flex justify-between items-start'>
									{i.label}
									<StatusButton data={i.value} isChangeStatusModal={onChangeChildHandler} status={`${childNodes.includes(i.value)}`} checked={childNodes.includes(i.value)} disable={disable} />
								</li>
							))}
						</ul>
					</li>
				);
			})}
		</ul>
	);
};
export default React.memo(GridView);
