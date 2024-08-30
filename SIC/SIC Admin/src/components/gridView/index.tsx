import React, { useCallback, useEffect, useState } from 'react';
import { CheckBoxTreeProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { DEFAULT_GRID_VIEW_COLUMNS } from '@config/constant';
import StatusButton from '@components/common/StatusButton';

const GridView = ({ nodes, checkedChild, onChangeCheckedChildHandler, columns = DEFAULT_GRID_VIEW_COLUMNS }: CheckBoxTreeProps) => {
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
			setParentNodes((item) => item.filter((i) => i !== value));
			nodes.forEach((item) => {
				value === item.id &&
					item.children.forEach((j) => {
						setChildNodes((item) => item.filter((i) => i !== j.value));
					});
			});
		} else {
			setParentNodes((item) => [...item, value]);
			nodes.forEach((item) => {
				value === item.id && item.children.forEach((i) => setChildNodes((j) => [...j, i.value]));
			});
		}
	};

	/**
	 * Method is used to set the parent
	 */
	useEffect(() => {
		nodes.forEach((item) => {
			if (
				item.children
					.map((i) => {
						return i.value;
					})
					.every((i) => childNodes.includes(i))
			) {
				setParentNodes((j) => [...j, item.id]);
			} else {
				setParentNodes((j) => j.filter((k) => k != item.id));
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
										<input className={cn(FormClasses['form-control'])} id={item.id} type='checkbox' name={item.id} onChange={(e) => onChangeHandler(e.target.id)} checked={parentNodes.includes(item.id)} />
										<span>All</span>
									</label>
								</div>
							</div>
						</div>
						<ul className='mb-0'>
							{item.children.map((i) => (
								<li key={i.value} className='px-4 py-3 border-b font-medium flex justify-between items-start'>
									{i.label}
									<StatusButton data={i.value} isChangeStatusModal={onChangeChildHandler} status={`${childNodes.includes(i.value)}`} checked={childNodes.includes(i.value)} />
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
