# SingInChinese Admin panel

## 1. Introduction

This document outlines the structure, requirements, necessary technologies, and setup.

## 2. Use Case & Feature

-   This application is used for the admin panel with Role & Permissions & Different Different modules.

## 3. Technologies

-   React 18.2.0
-   Tailwind
-   Rest API

## 4. Libraries Used

_Note: Mentioned only the major packages._

| Name           | Use Case                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| formik         | Handling the form it's field, validation, error messages. https://www.npmjs.com/package/formik                     |
| husky          | Husky is used for the pre-commit and pre-push any action perform in git. https://www.npmjs.com/package/husky       |
| classnames     | classnames is used for the conditionally joining the classNames together. https://www.npmjs.com/package/classnames |
| axios          | Axios is a simple promise based HTTP client for the browser and node.js.. https://www.npmjs.com/package/axios      |
| jodit-react-ts | This package is used for the Editor text box related. https://www.npmjs.com/package/jodit-react-ts                 |
| moment         | Used for the Data and Time Conversion. https://www.npmjs.com/package/moment                                        |
| react-toastify | Display the Toaster message like, success, error, warning. https://www.npmjs.com/package/react-toastify            |
| yup            | Form Validation. https://www.npmjs.com/package/yup                                                                 |
| tailwindcss    | Used for a designing a components. https://www.npmjs.com/package/tailwindcss                                       |

## 5. Project Setup

To run this project locally, follow these steps:

-   `Node Version : (>=18.16.1)`

-   `NPM Version : (>=9.6.7)`

1. Clone the repository using the link: https://BrainvireInfo@dev.azure.com/BrainvireInfo/Sing%20In%20Chinese/\_git/Sing%20In%20Chinese

2. Navigate to the project folder:

    `cd Sing%20In%20Chinese`

3. Create a `.env` file:

    `Add Below Credentials and api end points in .env file`

    - REACT_APP_API_GATEWAY_URL=XXXXXXXXXXXXXX
    - REACT_APP_GOOGLE_API_KEY=XXXXXXXXXXXXXX
    - REACT_APP_PROPERTY_ID=XXXXXXXXXXXXXX
    - REACT_APP_CLIENT_ID=XXXXXXXXXXXXXX
    - REACT_APP_GOOGLE_TRANSLATE=XXXXXXXXXXXXXX
    - REACT_APP_GOOGLE_ANALYTICS=XXXXXXXXXXXXXX
    - REACT_APP_ANALYTICS_SCOPE=XXXXXXXXXXXXXX

4. Install the dependencies:

    `npm install`

5. Start the development server:

    `npm start`

    - Visit http://localhost:3010 to view the project.

6. Build for production:

    `npm run build`

    Build will generate a build folder

## 6. Project Structure

-   _Overall structure:_
    <br>
    https://prnt.sc/-6XNKaT4hWrl
    <br><br>

-   _Subfolder structure:_
    <br>

| Folder             | Structure                    | Description                                                                                                                                        |
| ------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| src/...            | https://prnt.sc/NxCvzyCaJkoj | - This folder contains all the necessary files and folders such as common components, assets,fonts,hooks,configurations,pages etc.                 |
| src/assets/...     | https://prnt.sc/nXfYnpUtQVdV | - This folder contains fonts and images, Icons that are used throughout the application.                                                           |
| src/components/... | https://prnt.sc/EdxVSn1UWYxc | - This folder structure contains all the common components and the configurator components that are designed for code re usability and efficiency. |
| src/config/...     | https://prnt.sc/wEvqSSo0OFQj | - This folder contains a constant variable, permissions, regular common expression                                                                 |
| src/framework/...  | https://prnt.sc/IDQfeRoRk5un | - This Folder contains rest and services for API                                                                                                   |
| src/layout/...     | https://prnt.sc/3H4KMNxh3bcT | - This folder contains a default and public layout                                                                                                 |
| src/styles/...     | https://prnt.sc/8Kah4KuifckP | - This folder contains a scss and other css related files                                                                                          |
| src/types/...      | https://prnt.sc/z8lEMEcAxh-j | - This folder contains a Interface and Types                                                                                                       |
| src/utils/...      | https://prnt.sc/l6gpDkrRpS_E | - This Folder includes a common re-usable custom functions                                                                                         |
| sre/views/....     | https://prnt.sc/jN1mCiQVqIsk | - This Folder contains a Each common CRUD Operation components                                                                                     |

<br><br>

## 7. Component Management:

-   _Common Components_ :-

    -   To separate functionality and make code more understandable, reusable, and manageable, we construct components for each functionality,

-   _Component Creation_ :-
    -   First you need to create a new folder inside a views folder and need to make a component inside that component folder and always you need to take care about the component is re-usable.

### 9. Refer below component for the CRUD Operation

-   `src/views/subAdmin` refer this component to create listing, add, edit, update, delete
