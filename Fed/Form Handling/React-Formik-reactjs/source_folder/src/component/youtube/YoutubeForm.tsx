import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';

const initialValues = {
    name: '',
    email: '',
    channel: ''
}
const onSubmit = (values: any) => {
    console.log('form Data', values);
}
const validate = (values: any) => {
    let errors = {
        name: '',
        email: '',
        channel: ''
    }
    if (!values.name) {
        errors.name = 'required';
    }
    if (!values.email) {
        errors.email = 'required';
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(values.email)) {
        errors.email = 'invalid email format';
    }
    if (!values.channel) {
        errors.channel = 'required';
    }

    return errors
}
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email formate').required('Email is required'),
    channel: Yup.string().required('Channel is required'),

});
function YoutubeForm() {
    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
        // validate
    });
    console.log('visited fields', formik.touched);
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className='form-control'>
                    <label>Name</label>
                    <input {...formik.getFieldProps('name')} type="text" id="name" name="name" />
                    {formik.touched.name && formik.errors.name ? <div className='error' >{formik.errors.name}</div> : null}
                </div>
                <div className='form-control'>
                    <label>E-mail</label>
                    <input {...formik.getFieldProps('email')} type="email" name="email" id="email" />
                    {formik.touched.email && formik.errors.email ? <div className='error' >{formik.errors.email}</div> : null}
                </div>
                <div className='form-control'>
                    <label>Channel</label>
                    <input {...formik.getFieldProps('channel')} type="text" name="channel" id="channel" />
                    {formik.touched.channel && formik.errors.channel ? <div className='error'>{formik.errors.channel}</div> : null}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default YoutubeForm