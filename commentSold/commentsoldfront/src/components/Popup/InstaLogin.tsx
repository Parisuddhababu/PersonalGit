'use client'
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InstaLoginProps, InstagramLoginForm } from "@/types/components";
import FormValidationError from "../FormValidationError/FormValidationError";
import Modal from 'react-modal';
import "@/styles/pages/product-catalog-management.scss";
import { FIELDS, LOCAL_STORAGE_KEY, PLACE_HOLDERS } from "@/constant/common";
import useValidation from "@/framework/hooks/validations";

const InstaLogin = ({
    open,
    onClose,
    onSubmit: _onSubmit
}: InstaLoginProps) => {
    const [passwordSecurity, setPasswordSecurity] = useState(true)
    //TODO: Remove eslint disable rule when insta popup permanently remove.
    const [loginWith, setLoginWith] = useState('id') // eslint-disable-line no-unused-vars
    const defaultValues = {
        username: '',
        password: '',
    }
    const defaultValues2 = {
        streaming_key: '',
        streaming_url: '',
    }
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<InstagramLoginForm>({ defaultValues });
    const {
        register: register2,
        handleSubmit : handleSubmit2,
        formState: { errors : error2 },
        reset : reset2,
    } = useForm<InstagramLoginForm>({ defaultValues : defaultValues2 });
    const {instaWithPasswordValidations, instaWithKeyValidations} = useValidation()

    //submit handler for add edit
    const onSubmit: SubmitHandler<InstagramLoginForm> = async (data) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.instaGramDetails, JSON.stringify(data))
        _onSubmit()
        reset()
        reset2()
    };

    return (
        <Modal isOpen={open} contentLabel="Example Modal">
            <button onClick={onClose} className='modal-close'><i className='icon-close'></i></button>
            <div className='modal-body scrollbar-sm'>

                <p className='spacing-10 h3'>  Login with instagram</p>
                <div className='divider spacing-30'></div>
                {/* Do not remove below code untill instagram works stable */}
                <div className="nav scrollbar-sm">
                            <ul className="list-unstyled">
                                <li className={loginWith === 'id' ? 'acitve' : ''} onClick={() => setLoginWith('id')}>Login in Password</li>
                                <li className={loginWith === 'key' ? 'acitve' : ''} onClick={() => setLoginWith('key')}>Login with Streaming Key</li>
                            </ul>
                </div>
                {loginWith === 'id' && <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='add-product-row'>
                        <div className="form-group">
                            <label htmlFor="Product Name">Instagram id*</label>
                            <input
                                {...register("username", instaWithPasswordValidations.username)}
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter instagram id here"
                                className="form-control" />
                            <FormValidationError errors={errors} name="username" />
                        </div>
                        <div className="form-group password-form-group">
                            <label htmlFor="Password">{FIELDS.password}</label>
                            <div className="form-group-password">
                                <input
                                    {...register("password", instaWithPasswordValidations.password)}
                                    type={passwordSecurity ? "password" : "text"}
                                    name="password"
                                    id="password"
                                    placeholder={PLACE_HOLDERS.password}
                                    className="form-control" />
                                <FormValidationError errors={errors} name="password" />
                                <span className={passwordSecurity ? "icon-eye-off password-icon" : "icon-eye password-icon"}
                                    onClick={() => setPasswordSecurity(!passwordSecurity)} ></span>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className='btn btn-primary'>Submit</button>
                </form>}
                {loginWith === 'key' && <form onSubmit={handleSubmit2(onSubmit)}>
                    <div className='add-product-row'>
                        <div className="form-group">
                            <label htmlFor="streaming_key">Streaming Key*</label>
                            <input
                                {...register2("streaming_key", instaWithKeyValidations.streaming_key)}
                                type="text"
                                name="streaming_key"
                                id="streaming_key"
                                placeholder="Enter Streaming Key here"
                                className="form-control" />
                            <FormValidationError errors={error2} name="streaming_key" />
                        </div>
                        <div className="form-group password-form-group">
                            <label htmlFor="streaming_url">Streaming Url*</label>
                            <div className="form-group-password">
                                <input
                                    {...register2("streaming_url", instaWithKeyValidations.streaming_url)}
                                    type= "text"
                                    name="streaming_url"
                                    id="streaming_url"
                                    placeholder="Enter Streaming Url here"
                                    className="form-control" />
                                <FormValidationError errors={error2} name="streaming_url" />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className='btn btn-primary'>Submit</button>
                </form>}
            </div>
        </Modal>
    );
};
export default InstaLogin;

