import React from "react";
import { RoleEditProps, RoleInput } from "src/types/role";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "@components/input/TextInput";
import {
  CREATE_ROLE_DATA,
  UPDATE_ROLE_DATA,
} from "@framework/graphql/mutations/role";
import { useMutation } from "@apollo/client";
import { RoleCreateRes, UpdateRoleDataType } from "@framework/graphql/graphql";
import { toast } from "react-toastify";

const AddEditRole = ({
  isRoleModelShow,
  onSubmitRole,
  onClose,
  roleVal,
  isRoleEditable,
  roleObj,
}: RoleEditProps) => {
  const [updateRoleData] = useMutation(UPDATE_ROLE_DATA);
  const [createRoleData] = useMutation(CREATE_ROLE_DATA);

  //initial values
  const initialValues: RoleInput = {
    role: roleVal || "",
  };
  //validation
  const validationSchema = Yup.object({
    role: Yup.string().required("Please enter role" as string),
  });
  //submit form
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isRoleEditable) {
        UpdateRoleDataVal(values);
      } else {
        createRole(values);
      }
    },
  });
  //to create role
  const createRole = (values: RoleInput) => {
    createRoleData({
      variables: {
        roleName: values.role,
        key: values.role,
      },
    })
      .then((res) => {
        const data = res.data as RoleCreateRes;

        if (data.createRole.meta.statusCode === 200) {
          toast.success(data.createRole.meta.message);
        } else {
          toast.error(data.createRole.meta.message);
        }
        onSubmitRole();
      })
      .catch(() => {
        toast.error("Failed to create role");
      });
  };
  //update role
  const UpdateRoleDataVal = (values: RoleInput) => {
    updateRoleData({
      variables: {
        updateRoleId: roleObj?.id,
        roleName: values.role,
        key: values.role,
      },
    })
      .then((res) => {
        const data = res.data as UpdateRoleDataType;
        if (data.updateRole.meta.statusCode === 200) {
          toast.success(data.updateRole.meta.message);
        } else {
          toast.error(data.updateRole.meta.message);
        }
        onSubmitRole();
      })
      .catch(() => {
        toast.error("Failed to update the role");
      });
  };

  return (
    <div
      id='defaultModal'
      tabIndex={-1}
      data-modal-show={true}
      aria-hidden='false'
      className={
        "fixed top-0 left- right-0 z-50  w-full h-auto p-4 overflow-x-hidden overflow-y-auto md:inset-0  backdrop-blur-sm"
      }
    >
      <div className='flex justify-center'>
        {/* <!-- Modal content --> */}
        <div className='relative bg-white rounded-lg '>
          {/* <!-- Modal header --> */}
          <div className='flex items-start justify-between p-4 border-b rounded-t bg-red-500'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {isRoleEditable ? "Update Role" : "Add New Role"}
            </h3>
            <button onClick={onClose}>X</button>
          </div>
          {/* <!-- Modal body --> */}
          <form
            className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}
          >
            <div className='mb-4'>
              <TextInput
                placeholder={"Role Name"}
                name='role'
                onChange={formik.handleChange}
                value={formik.values.role}
                error={formik.errors.role}
              />
            </div>
            <button
              type='submit'
              className='text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 m-1'
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-md text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 btn-sm'
            >
              No
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditRole;
