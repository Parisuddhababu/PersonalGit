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

const AddTreeView = () => {
	const [expandedNodes, setExpandedNodes] = useState<number[]>([]);
	const { data } = useQuery(FETCH_CATEGORIES);
	const { t } = useTranslation();
	const [categoryDropDownData, setCategoryDropDownData] = useState<TreeNode[]>([]);
	useEffect(() => {
		const parentData = [] as TreeNode[];
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
			const categoriesData = data.fetchCategory.data.Categorydata;
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
	const renderTreeNode = (node: TreeNode) => {
		const isExpanded = expandedNodes.includes(node.key);

		return (
			<div>
				<div className='flex'>
					<div className='w-full p-5 mt-2 overflow-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700' key={node.key}>
						<div onClick={() => toggleNode(node.key)} className='flex space-x-2 justify-between '>
							<div className='flex space-x-2'>
								<span>{node.label}</span>
							</div>
							<span onClick={() => handleNodeClick(node.key)}>
								<Edit className='mt-1 text-red-800' />
							</span>
						</div>
						{isExpanded && node.children!.length > 0 && (
							<div className='flex ml-[5px]'>
								<div className=' border-0 border-gray-300 border-b-2 border-l-2 h-[40px] w-[30px] right-0 '></div>
								<div>{node.children!.map(renderTreeNode)}</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	};
	return (
		<div className='w-1/2 p-5 overflow-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
			<div className='flex justify-end'>
				<Button className='btn-primary btn-normal' onClick={() => toast.error(t('Please fill the details'))} type='button' label={t('Save')}>
					<div className='mr-1'>
						<CheckCircle />
					</div>
				</Button>

				<Button onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}`)} className='btn-primary btn-normal mx-2' type='button' label={t('Goto Category List')}>
					<TreeViewIcon className='mr-1' />
				</Button>
			</div>
			<div>{categoryDropDownData.map(renderTreeNode)}</div>
		</div>
	);
};

export default AddTreeView;
