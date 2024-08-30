import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup';

const initialValues = {
    name: '',
    email: '',
    channel: ''
}
const onSubmit = (values: any) => {
    console.log('form Data', values);
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email formate').required('Email is required'),
    channel: Yup.string().required('Channel is required'),

});
function UseOfFormikComponent() {
    return (
        <div>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                <Form >
                    <div className='form-control'>
                        <label>Name</label>
                        <Field type="text" id="name" name="name" />
                        <ErrorMessage name="name" />
                    </div>
                    <div className='form-control'>
                        <label>E-mail</label>
                        <Field type="email" name="email" id="email" />
                        <ErrorMessage name="email" />
                    </div>
                    <div className='form-control'>
                        <label>Channel</label>
                        <Field type="text" name="channel" id="channel" />
                        <ErrorMessage name="channel" />
                    </div>
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default UseOfFormikComponent