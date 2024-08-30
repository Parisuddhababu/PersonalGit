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
function OldYoutubeForm () {
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
                    <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} />
                    {formik.touched.name && formik.errors.name ? <div className='error' >{formik.errors.name}</div> : null}
                </div>
                <div className='form-control'>
                    <label>E-mail</label>
                    <input type="email" name="email" id="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} />
                    {formik.touched.email && formik.errors.email ? <div className='error' >{formik.errors.email}</div> : null}
                </div>
                <div className='form-control'>
                    <label>Channel</label>
                    <input type="text" name="channel" id="channel" onChange={formik.handleChange} value={formik.values.channel} onBlur={formik.handleBlur} />
                    {formik.touched.channel && formik.errors.channel ? <div className='error'>{formik.errors.channel}</div> : null}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default OldYoutubeForm