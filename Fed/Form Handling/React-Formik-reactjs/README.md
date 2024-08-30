# **[React Formik](#)**

- ## What is Formik?

  - Formik is a small library that helps you deal with forms in react

- ## Why is it used?
  - Managing form data
  - Form submission
  - Form validation and displaying error messages

Formik helps you deal with forms in a scalable, performant and easy way.

- ## Create a from using Html and css

  - Managing the form state
  - Handling form submission
  - Validation and Error Messages

- ## Install Formik
  ```
  npm i formik
  ```
- ## Import formik Hook
  ```
  import { useFormik } from 'formik'
  ```
- ## Call the formik Hook Function

  - It’s take object as a parameters
  - And it’s return the object

  ```
  const formik = useFormik({})
  ```

- ## Managing form state
  - Pass the initial value in your useFromik hooks
    ```
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            channel: ''
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
        },
    });
    ```
- ## Track the input value using the onChange event and value

  ```
  <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} />
  ```

- ## Handling Form Submission
  - Add the onSubmit event on the form
    ```
    <form onSubmit={formik.handleSubmit}>
    ```
  - Add another onSubmit property in useFormik hook
    ```
    onSubmit: values => {
        console.log('form Data', values);
    }
    ```
- ## Form validation

  - Add the another property ‘validate’ function in useFormik hook

    ```
    validate: (values: any) => {
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
    ```

- ## Displaying error message

  - Under the each input element add Div tag which show the error message
    ```
    <div className='form-control'>
        <label>Name</label>
        <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} />
        {formik.errors.name ? <div className='error' >{formik.errors.name}</div> : null}
    </div>
    ```

- ## Visited Fields
  - Add the onBlur event in each input element
    ```
    <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} />
    ```
  - Console the touched property of the formik
    ```
    console.log('visited fields', formik.touched);
    ```
- ## Improving validation UX
  ```
  {formik.touched.name && formik.errors.name ? <div className='error' >{formik.errors.name}</div> : null}
  ```
- ## [Schema Validation with Yup]()

  - ### Install Yup
    ```
    npm install yup
    ```
  - ### Import Yup in file
    ```
    import * as Yup from 'yup';
    ```
  - ## Create a validation Schema for Yup validation

    ```
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email formate').required('Email is required'),
        channel: Yup.string().required('Channel is required')
    });
    ```

  - ## Change the useFormik Hook and add the Yup validation schema in hook
    ```
    function YoutubeForm() {
        const formik = useFormik({
            initialValues,
            onSubmit,
            validationSchema
            // validate
        });
    }
    ```

- ## Reducing Boilerplate

  - ### getFieldProps() methos is use for reduce the common line of code

  - ### `Without` getFieldProps() method
    ```
    <input type="text" id="name" name="name" onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} />
    ```
  - ### `With` getFieldProps() Method
    ```
    <input {...formik.getFieldProps('email')} type="email" name="email" id="email" />
    ```

- ## **[Formik Components](#)**
- Formik component proved the following components

  - ### `Formik component`
  - ### `Form component`
  - ### `Field component`
  - ### `ErrorMessage component`

- ## [Formik component](#)

  - Import the formik component in your components
    ```
    import { Formik } from 'formik'
    ```
  - Remove the call useFormik hook
  - Reap the entire form with Formik component
    ```
    <Formik>
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
    </Formik>
    ```
  - Pass the different props in Formik component
    ```
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
    .
    .
    .
    .
    .
    </Formik>
    ```

- ## [Form component](#)
  - Import Form from Formik
    ```
    import { Formik, Form } from 'formik'
    ```
  - Replace the form elements with Form Component
    ```
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
    <Form onSubmit={formik.handleSubmit}>
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
                </Form>
            </Formik>
    ```
  - Remove the onSubmit from the Form component
    ```
    <Form></From>
    ```
- ## [Field component](#)
  - Import the Field component from Formik
    ```
    import { Formik, Form, Field } from 'formik'
    ```
  - Replace the all input elements with Field component
    ```
    <Field {...formik.getFieldProps('name')} type="text" id="name" name="name" />
    ```
  - Remove all the getFieldProps() method from the Field components
    ```
    <Field  type="text" id="name" name="name" />
    ```
- ## [Error Component](#)

  - Import the ErrorMessage component from Formik
    ```
    import { Formik, Form, Field, ErrorMessage } from 'formik'
    ```
  - Replace the Block of code rendering the error message with ErrorMessage component

    ```
    {formik.touched.name && formik.errors.name ? <div className='error'>{formik.errors.name}</div> : null}

        Replace to

    <ErrorMessage/>
    ```

  - Pass in name props Which is equal to the name attribute on Field component
    ```
    <ErrorMessage name="name" />
    ```

### Snapshot

![React Formik Example](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Form%20Handling/React-Formik-reactjs/Application%20Snapshot/React-Formik-reactjs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
