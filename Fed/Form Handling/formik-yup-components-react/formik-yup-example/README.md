# Formik with Yup Example

This project demonstrates how to use Formik with Yup for form validation in a React application.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Form Validation with Yup](#form-validation-with-yup)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js and npm (Node Package Manager)

  - Node version: v16.16.0
  - NPM version: 9.6.7

### Installation

1. Clone the repository:

2. Navigate to the project directory:
   `cd formik-yup-example`
3. Install dependencies:
   `npm install`

### Usage

`npm start`

## Form Validation with Yup

1. Install Yup: `npm install yup`

2. Import Yup in your component: `import * as Yup from 'yup';`

3. Define your validation schema:

```
const validationSchema = Yup.object().shape({
  // Define your validation rules here
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  // Add more fields as needed
});

```

4. Integrate Yup with Formik:

```
import { Formik } from 'formik';

// ...

<Formik
  initialValues={{ name: '', email: '' }}
  validationSchema={validationSchema}
  onSubmit={(values) => {
    // Handle form submission
    console.log(values);
  }}
>
  {/* Your form components go here */}
</Formik>

```

### Snapshot

![Formik Yup Example](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Form%20Handling/formik-yup-components-react/Application%20Snapshot/formik-yup-example.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)
