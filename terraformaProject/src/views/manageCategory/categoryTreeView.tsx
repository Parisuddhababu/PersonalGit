/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { AngleUp, DropdownArrowDown, Edit } from '@components/icons/icons';
import { FETCH_SUB_CATEGORY } from '@framework/graphql/queries/category';
import { CategoryTreeDataArr, TreeNode } from 'src/types/category';
import { t } from 'i18next';

import { useQuery } from '@apollo/client';
import UpdatedHeader from '@components/header/updatedHeader';
import { useSelector } from 'react-redux';
import { UserRoles } from 'src/types/common';

const CategoryTreeView: React.FC = () => {
	const navigate = useNavigate();
	const { data, refetch } = useQuery(FETCH_SUB_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
	const [categoryDrpData, setCategoryDrpData] = useState<TreeNode[]>([]);
	const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
	const { category } = useSelector(((state: { rolesManagement: { category: UserRoles } }) => state.rolesManagement));

	const getUniqueData = (arr: TreeNode[]): TreeNode[] => {
		return arr.filter((item, index, self) => {
			return index === self.findIndex((tData) => (
				tData.key === item.key
			));
		});
	};

	useEffect(() => {
		refetch();
	}, [])

	useEffect(() => {
		const parentData = [] as TreeNode[];

		const findChildren = (node: TreeNode, categories: CategoryTreeDataArr[]) => {
			const childCategories = categories.filter((data: CategoryTreeDataArr) => data.category.uuid === node.key);

			childCategories.forEach((category: CategoryTreeDataArr) => {
				const childNode: TreeNode = {
					label: category.name,
					key: category.uuid,
					children: [],
				};
				node.children!.push(childNode);
				findChildren(childNode, categories);
			});
		};

		if (data?.getSubCategories) {
			const categories = data?.getSubCategories?.data?.subCategories;
			categories.forEach((data: CategoryTreeDataArr) => {
				const rootNode: TreeNode = {
					label: data.category.name,
					key: data.category.uuid,
					children: [],
				};
				parentData.push(rootNode);
				findChildren(rootNode, categories);
			});
			const uniqueData = getUniqueData(parentData);
			setCategoryDrpData(uniqueData);
		}
	}, [data]);

	const handleParentDataEdit = useCallback((parentKey: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.category}/edit/${parentKey}`);
	}, []);

	const handleChildDataEdit = useCallback((childKey: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.subCategory}/edit/${childKey}`);
	}, []);

	const navigateHandler = useCallback(() => {
		navigate(-1);
	}, [])

	const onToggle = (parentKey: string) => {
		// Create a copy of the openMenus object
		const updatedOpenMenus = { ...openMenus };

		// Toggle the state for the clicked parent
		updatedOpenMenus[parentKey] = !updatedOpenMenus[parentKey];

		// Update the state
		setOpenMenus(updatedOpenMenus);
	};
	const headerActionConst = () => {
		return (
			<Button onClick={navigateHandler} label={t('Go To Category List')} className='ml-5 btn-primary btn-normal btn-medium md:ml-0' type='button' />
		)
	}
	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} />
			<div>
				<div className='flex flex-wrap items-start justify-between gap-5 mb-5 sm:gap-3 '>
					<h1>Tree View</h1>
				</div>

				{categoryDrpData.map((parentData: any) => (
					<div className='flex-col py-3 pl-8 pr-3 mb-3 border border-border-primary rounded-xl md:py-5 md:pl-10 md:pr-5 multi-category-view md:mb-5' key={parentData.key}>
						<div className='flex items-center justify-between'>
							<div className="flex space-x-3.5 items-center" onClick={() => onToggle(parentData.key)}>
								<span className='min-w-[30px] min-h-[30px] border border-border-primary rounded-full relative'>
									{openMenus[parentData.key] ? (
										<AngleUp className='absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 ' fontSize='12' />
									) : (
										<DropdownArrowDown className='absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 ' fontSize='12' />
									)}
								</span>
								<span>{parentData.label}</span>
							</div>
							{category?.update && <span onClick={() => handleParentDataEdit(parentData.key)}>
								<Edit className='mt-1 cursor-pointer text-primary' />
							</span>}
						</div>
						{openMenus[parentData.key] && parentData?.children?.map((childData: { key: string; label: string; }) => (
							<div className=' pt-5 pl-6 pr-5 lg:pt-[30px] xl:pt-10 ml-4 flex-col' key={childData.key}>
								<div className='flex space-x-3.5 items-center relative after:content-[""] after:w-6 after:h-[1px]  after:px-[1px] after:absolute after:top-[15px] after:-left-[24px] after:z-1 after:border-b-[1px] after:border-dotted after:border-border-primary'>
									<span>{childData.label}</span>
									{category?.update && <span onClick={() => handleChildDataEdit(childData.key)}>
										<Edit className='mt-1 cursor-pointer text-primary' />
									</span>}
								</div>
							</div>
						))}
					</div>
				))}
			</div></>
	);
};

export default CategoryTreeView;
