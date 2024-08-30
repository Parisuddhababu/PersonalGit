import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "@components/input/TextInput";
import Button from "@components/button/Button";
import { t } from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@config/constant";
import { toast } from "react-toastify";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from "@framework/graphql/mutations/category";
import { useMutation, useQuery } from "@apollo/client";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import "primereact/resources/primereact.min.css";
import {
  CategoryTreeDataArr,
  TreeNode,
  TreeNodeProps,
} from "src/types/category";
import {
  FETCH_CATEGORIES,
  GET_SINGLE_CATEGORY_DATA_BY_ID,
} from "@framework/graphql/queries/category";
const AddEditCategory = () => {
  const { data } = useQuery(FETCH_CATEGORIES);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const { data: categoryByIdData, refetch } = useQuery(
    GET_SINGLE_CATEGORY_DATA_BY_ID
  );
  const navigate = useNavigate();
  const params = useParams();
  /*for tree select*/
  const [categoryDropDownData, setCategoryDropDownData] = useState<
    TreeNodeProps[]
  >([]);
  const handleDropDownData = (e: TreeSelectChangeEvent) => {
    formik.setFieldValue("parentCategory", e.value);
  };
  useEffect(() => {
    const parentData = [] as TreeNode[];

    const findChildren = (
      node: TreeNode,
      categories: CategoryTreeDataArr[]
    ) => {
      const childCategories = categories.filter(
        (category: CategoryTreeDataArr) => category.parent_category === node.key
      );

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
      const rootCategories = categories.filter(
        (category: CategoryTreeDataArr) => category.parent_category === 0
      );

      rootCategories.forEach((category: CategoryTreeDataArr) => {
        const rootNode: TreeNode = {
          label: category.category_name,
          key: category.id,
          children: [],
        };
        parentData.push(rootNode);
        findChildren(rootNode, categories);
      });
      setCategoryDropDownData(
        parentData.filter(
          (i) =>
            !i.label.includes(
              categoryByIdData?.getSingleCategory?.data?.category_name
            )
        )
      );
      console.log(parentData, "asdfgh");
    }
  }, [categoryByIdData?.getSingleCategory?.data?.category_name, data]);

  /*add edit form cancel handler*/
  const cancelHandler = () => {
    navigate(`/${ROUTES.app}/${ROUTES.category}`);
  };
  const [status, setStatus] = useState("");
  const [createCategory] = useMutation(CREATE_CATEGORY);
  /*initial values*/
  const initialValues = {
    categoryName: "",
    description: "",
    parentCategory: "",
    status: 1,
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("categoryName is required"),
    description: Yup.string().required("description required"),
    parentCategory: Yup.string().required("parent category required"),
  });

  const statusChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (+event.target.value === 1) {
      setStatus("Active");
    }
    if (+event.target.value === 0) {
      setStatus("InActive");
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
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
            toast.error(t("Failed to create new category"));
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
          .then((res: any) => {
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
            toast.error(t("Failed to create new category"));
          });
      }
    },
  });

  useEffect(() => {
    if (params.id) {
      refetch({ getSingleCategoryId: parseInt(params.id) }).catch((e) =>
        toast.error(e)
      );
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
    <div className='w-full m-5 overflow-x-scroll'>
      <form
        onSubmit={formik.handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='w-full bg-white shadow-lg rounded-lg p-8 mb-5 grid lg:grid-cols-2 sm:grid-cols-1 gap-6'>
          <div className='mb-4'>
            <TextInput
              placeholder={t("categoryName")}
              name='categoryName'
              onChange={formik.handleChange}
              label={"categoryName"}
              value={formik.values.categoryName}
              error={formik.errors.categoryName}
            />
          </div>
          <div className='mb-4'>
            <TextInput
              placeholder={t("description")}
              name='description'
              onChange={formik.handleChange}
              label={"description"}
              value={formik.values.description}
              error={formik.errors.description}
            />
          </div>
          <div className='mb-40 flex flex-col'>
            <label htmlFor='parentCategory' className='font-semibold'>
              Parent Category
            </label>

            <div
              className={`border border-gray-300 py-2 px-3 rounded w-full  custom-select-tree custom-tree-select `}
            >
              <TreeSelect
                value={formik.values.parentCategory}
                options={categoryDropDownData}
                onChange={handleDropDownData}
                selectionMode='single'
                className='w-full text-bold z-50'
              />
            </div>
          </div>

          <div>
            <label className='font-bold text-gray-900 px-1 py-4  mb-1'>
              Status
            </label>
            <div className='font-serif px-4  '>
              <input
                type='radio'
                id='active'
                value={1}
                defaultChecked
                name='Status'
                onChange={statusChangeHandler}
              />
              <label htmlFor='all' className='font-serif px-4 py-4 mx-1 '>
                Active
              </label>
            </div>
            <div className=' font-serif px-4  '>
              <input
                type='radio'
                id='InActive'
                value={0}
                name='Status'
                onChange={statusChangeHandler}
              />

              <label htmlFor='android' className='font-serif px-4 py-4 mx-1 '>
                InActive
              </label>
            </div>
          </div>

          <div className='p-2 m-2'>
            <Button
              type='submit'
              className='btn btn-primary m-1'
              label={params.id ? "Update" : "Save"}
            />

            <Button
              label={"Cancel"}
              onClick={cancelHandler}
              className='btn btn-warning m-1'
            />
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddEditCategory;
