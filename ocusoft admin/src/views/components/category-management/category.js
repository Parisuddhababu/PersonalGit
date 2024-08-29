// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React from 'react';
import CategoryList from './common/category-listing'


const Category = (props) => {

    return (
        <>
          <CategoryList type={1} headerName="Category Management" name="Category"/>  
        </>
    )
}

export default Category
