import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/input/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { toast } from 'react-toastify';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@framework/graphql/mutations/category';
import { useMutation, useQuery } from '@apollo/client';
import { TreeSelect, TreeSelectChangeEvent } from 'primereact/treeselect';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { CategoryTreeDataArr, TreeNode, TreeNodeProps } from 'src/types/category';
import { FETCH_CATEGORIES, GET_SINGLE_CATEGORY_DATA_BY_ID } from '@framework/graphql/queries/category';
import { CheckCircle, Cross } from '@components/icons';
import { t } from 'i18next';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';
const AddEditCategory = () => {
	const { data } = useQuery(FETCH_CATEGORIES);
	const [updateCategory] = useMutation(UPDATE_CATEGORY);
	const { data: categoryByIdData, refetch } = useQuery(GET_SINGLE_CATEGORY_DATA_BY_ID);
	const navigate = useNavigate();
	const params = useParams();
	const [status, setStatus] = useState(1);
	const [createCategory] = useMutation(CREATE_CATEGORY);
	/*initial values*/
	const initialValues = {
		categoryName: '',
		description: '',
		parentCategory: '',
		status: '',
	};
	/*for tree select*/
	const [categoryDropDownData, setCategoryDropDownData] = useState<TreeNodeProps[]>([]);
	const handleDropDownData = (e: TreeSelectChangeEvent) => {
		formik.setFieldValue('parentCategory', e.value);
	};
	useEffect(() => {
		const parentData = [] as TreeNode[];

		const findChildren = (node: TreeNode, categories: CategoryTreeDataArr[]) => {
			const childCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === node.key);

			childCategories.forEach((category: CategoryTreeDataArr) => {
				const childNode: TreeNode = {
					label: category.category_name,
					key: category.id,

					children: [],
				};
				node.children!.push(childNode);
				findChildren(childNode, categories);
			});
		};
		if (data?.fetchCategory) {
			const categories = data.fetchCategory.data.Categorydata;
			const rootCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === 0);

			rootCategories.forEach((category: CategoryTreeDataArr) => {
				const rootNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				parentData.push(rootNode);
				findChildren(rootNode, categories);
			});
			setCategoryDropDownData(parentData.filter((i) => !i.label.includes(categoryByIdData?.getSingleCategory?.data?.category_name)));
		}
	}, [categoryByIdData?.getSingleCategory?.data?.category_name, data]);

	/*add edit form cancel handler*/
	const cancelHandler = () => {
		navigate(`/${ROUTES.app}/${ROUTES.category}/List`);
	};

	const statusChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (+event.target.value === 1) {
			setStatus(1);
		}
		if (+event.target.value === 0) {
			setStatus(0);
		}
	};
	const { categoryValidation } = useValidation();

	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(categoryValidation),
		onSubmit: async (values) => {
			//update category
			if (params.id) {
				updateCategory({
					variables: {
						updateCategoryId: +params.id,
						categoryName: values.categoryName,
						parentCategory: +values.parentCategory,
						description: values.description,
						status: +status,
						createdBy: 6,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.updateCategory.meta.statusCode === 200) {
							toast.success(data.updateCategory.meta.message);
							formik.resetForm();
							cancelHandler();
						} else {
							toast.error(data.updateCategory.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to create new category'));
					});
			} else {
				/*creating announcement*/
				createCategory({
					variables: {
						categoryName: values?.categoryName,
						parentCategory: +values?.parentCategory,
						description: values?.description,
						status: +status,
						createdBy: 6,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.createCategory.meta.statusCode === 201) {
							toast.success(data?.createCategory?.meta.message);
							formik.resetForm();
							cancelHandler();
						} else {
							toast.error(data?.createCategory?.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to create new category'));
					});
			}
		},
	});

	useEffect(() => {
		if (params.id) {
			refetch({ getSingleCategoryId: parseInt(params.id) }).catch((e) => toast.error(e));
		}
	}, [params.id, refetch]);

	useEffect(() => {
		if (categoryByIdData && params?.id) {
			const data = categoryByIdData?.getSingleCategory?.data;
			formik
				.setValues({
					categoryName: data?.category_name,
					parentCategory: data?.parent_category,
					description: data?.description,
					status: data?.status,
				})
				.catch((e) => toast.error(e));
		}
	}, [categoryByIdData, params?.id]);

	return (
		<div>
			<div className='w-full'>
				<form onSubmit={formik.handleSubmit} className='border border-[#c8ced3] mx-4 my-2 lg:mx-6 lg:my-4'>
					<div className='bg-white shadow-md rounded px-8 pt-6 p-2 '>
						<div className='flex justify-end'>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</div>
						<div className='mb-4'>
							<TextInput placeholder={t('Category Name')!} name='categoryName' onChange={formik.handleChange} label={t('Category Name')} value={formik.values.categoryName} error={formik.errors.categoryName} required />
						</div>
						<div className='mb-4 flex flex-col'>
							<label htmlFor='parentCategory' className='block text-gray-700 text-sm font-normal mb-2'>
								{t('Parent Category')}
							</label>
							<TreeSelect value={formik.values.parentCategory} options={categoryDropDownData} onChange={handleDropDownData} selectionMode='single' className='w-full text-gray-700 font-light' />
						</div>
						<div>
							<label className='px-1 py-1 text-[#23282C] '>{t('Category Description')}</label>
							<textarea className='w-full border border-slate-300 p-2 text-gray-700 mt-2' placeholder={t('Category Description')!} name='description' onChange={formik.handleChange} value={formik.values.description} rows={6} cols={60}></textarea>
						</div>
						<div className='mt-2 mb-2'>
							<label className=' text-[#23282C] px-1 py-4 '>
								{t('Status')} <span className='text-red-500'>*</span>
							</label>
							<div className='flex mt-2'>
								<div>
									<input type='radio' id='active' value={1} defaultChecked name='Status' onChange={statusChangeHandler} className='accent-red-600' />
									<label htmlFor='all' className=' font-normal px-1 py-4 mx-1 '>
										Active
									</label>
								</div>
								<div>
									<input type='radio' id='InActive' value={0} name='Status' onChange={statusChangeHandler} className='accent-red-600' />

									<label htmlFor='android' className=' font-normal px-1 py-4 mx-1'>
										InActive
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className='flex items-start justify-start col-span-3 btn-group px-5 py-2 bg-[#F0F3F5] border-t border-[#c8ced3] '>
						<Button className='btn-primary btn-normal' type='submit' label={params.id ? t('Update') : t('Save')}>
							<div className='mr-1'>
								<CheckCircle />
							</div>
						</Button>
						<Button className='btn-warning btn-normal' label={t('Cancel')} onClick={cancelHandler}>
							<div className='mr-1'>
								<Cross className='text-white' />
							</div>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default AddEditCategory;
