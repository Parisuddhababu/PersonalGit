import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_CATEGORIES } from '@framework/graphql/queries/category';
import { useNavigate } from 'react-router-dom';
import { CategoryTreeDataArr, TreeNode } from 'src/types/category';
import { ROUTES } from '@config/constant';
import { CheckCircle, Edit, TreeViewIcon } from '@components/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { Tree, TreeNodeTemplateOptions } from 'primereact/tree';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';

const AddTreeView = () => {
	const [expandedNodes, setExpandedNodes] = useState<number[]>([]);
	const { data } = useQuery(FETCH_CATEGORIES);
	const { t } = useTranslation();

	const [categoryDropDownData, setCategoryDropDownData] = useState<TreeNode[]>([]);

	useEffect(() => {
		const parentData: TreeNode[] = [];
		const findChildren = (node: TreeNode, categoriesData: CategoryTreeDataArr[]) => {
			const childCategories = categoriesData.filter((category: CategoryTreeDataArr) => category.parent_category === node.key);

			childCategories.forEach((category: CategoryTreeDataArr) => {
				const childNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				node.children!.push(childNode);
				findChildren(childNode, categoriesData);
			});
		};

		if (data?.fetchCategory) {
			const categoriesData: CategoryTreeDataArr[] = data.fetchCategory.data.Categorydata;
			const rootCategories = categoriesData.filter((category: CategoryTreeDataArr) => category.parent_category === 0);

			rootCategories.forEach((category: CategoryTreeDataArr) => {
				const rootNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				parentData.push(rootNode);
				findChildren(rootNode, categoriesData);
			});

			setCategoryDropDownData(parentData);
		}
	}, [data]);

	const toggleNode = (nodeId: number) => {
		if (expandedNodes.includes(nodeId)) {
			setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
		} else {
			setExpandedNodes([...expandedNodes, nodeId]);
		}
	};

	const navigate = useNavigate();

	const handleNodeClick = (nodeId: number) => {
		navigate(`/app/category/edit/${nodeId}`);
	};

	const handleSaveClick = () => {
		toast.success(t('Changes saved successfully'));
	};

	const renderTreeNode = (node: TreeNode, options: TreeNodeTemplateOptions) => {
		const isExpanded = expandedNodes.includes(Number(node.key));

		return (
			<div>
				<div className='flex '>
					<div className='w-full p-5  mt-2  bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700' key={node.key}>
						<div onClick={() => toggleNode(Number(node.key))} className='flex space-x-2 justify-between '>
							<div className='flex space-x-2'>
								<span>{node.label}</span>
							</div>
							<span onClick={() => handleNodeClick(Number(node.key))}>
								<Edit className='mt-1 ml-64  text-red-800 cursor-pointer' />
							</span>
						</div>
						{isExpanded && node.children!.length > 0 && (
							<div className='flex ml-[5px]'>
								<div className=' border-0 border-gray-300 border-b-2 border-l-2 h-[40px] w-[30px] right-0 '></div>
								<div>{node.children!.map((childNode) => renderTreeNode(childNode, options))}</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='w-1/2 p-5 mx-6 my-4 overflow-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
			<div className='flex justify-end mb-2'>
				<Button className='btn-primary btn-normal' onClick={handleSaveClick} type='button' label={t('Save')}>
					<div className='mr-1'>
						<CheckCircle />
					</div>
				</Button>

				<Button onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}/List`)} className='btn-primary btn-normal mx-2' type='button' label={t('Goto Category List')}>
					<TreeViewIcon className='mr-1' />
				</Button>
			</div>
			<div className='mt-2'>
				<div className='card'>
					<Tree value={categoryDropDownData} dragdropScope='demo' onDragDrop={(event) => setCategoryDropDownData(event.value as TreeNode[])} nodeTemplate={(node: any, options: TreeNodeTemplateOptions) => renderTreeNode(node, options)} />
				</div>
			</div>
		</div>
	);
};

export default AddTreeView;
