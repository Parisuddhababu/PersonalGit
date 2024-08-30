import React from "react";
import { useMutation } from "@apollo/client";
import TextInput from "@components/input/TextInput";
import { LoginResponse } from "@framework/graphql/graphql";
import { LOGIN_USER } from "@framework/graphql/mutations/user";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ROUTES } from "@config/constant";
import { LoginInput } from "src/types/views";
import Button from "@components/button/Button";

const Login = () => {
  const { t } = useTranslation();
  const [login] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const initialValues: LoginInput = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("Invalid email") as string)
      .required(t("Please enter email") as string),
    password: Yup.string().required(t("Please enter password") as string),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      login({
        variables: values,
      })
        .then((res) => {
          const data = res.data as LoginResponse;
          localStorage.setItem("authToken", data.loginUser.data.token);
          navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
        })
        .catch(() => {
          toast.error(t("Failed to login"));
        });
    },
  });

  return (
    <React.Fragment>
      <div className='bg-white py-6 sm:py-8 lg:py-12'>
        <div className='max-w-screen-2xl px-4 md:px-8 mx-auto '>
          <div className='w-full flex items-center justify-center mt-20'>
            <form
              className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
              onSubmit={formik.handleSubmit}
            >
              <h2 className='text-gray-800 text-2xl lg:text-3xl font-bold mb-4 md:mb-6'>
                {t("Login")}
              </h2>
              <h4 className='text-gray-600 mb-4'>
                {t("Sign In to your account")}
              </h4>
              <div className='mb-4'>
                <TextInput
                  placeholder={t("Email")}
                  name='email'
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.errors.email}
                />
              </div>
              <div className='mb-6'>
                <TextInput
                  placeholder='*****'
                  name='password'
                  type='password'
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.errors.password}
                />
              </div>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center mr-2'>
                  <input
                    id='default-checkbox'
                    type='checkbox'
                    value=''
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                                 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                                  focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label
                    htmlFor='default-checkbox'
                    className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                  >
                    {t("Remember me")}
                  </label>
                </div>
                <Link to={`/${ROUTES.forgotPassword}`}>
                  <p
                    className='inline-block align-baseline font-bold text-sm 
                                text-blue-500 hover:text-blue-800'
                  >
                    {t(" Forgot Password")}?
                  </p>
                </Link>
              </div>
              <Button type='submit' label={t("Sign In")} />
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Login;
