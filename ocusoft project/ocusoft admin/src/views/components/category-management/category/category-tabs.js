import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState } from 'react';
import CategoryAddEdit from '../common/category-add-edit'
import { useLocation } from 'react-router-dom';
import AddEditCategory from './add-edit-category';
import { isEmpty } from 'src/shared/handler/common-handler';

const CategoryTab = () => {
    const [, setCategoryId] = useState('')
    const search = useLocation().search;
    const type = new URLSearchParams(search).get('type');
    const id = new URLSearchParams(search).get('id');

    const getCategoryId = id => {
        setCategoryId(id);
    }

    return (
        <>
            {
                (type !== '3' && !isEmpty(id)) && (
                    <div className="card">
                        {type === '1' ? <AddEditCategory /> : <CategoryAddEdit getCategoryId={getCategoryId} />}
                    </div>
                )
            }
            {
                (type === '1' && isEmpty(id))
                    ? (
                        <AddEditCategory />
                    ) : ( type === '3' || (type !== '3' && (id === undefined || id === null || id === '')) ) && (
                        <CategoryAddEdit getCategoryId={getCategoryId} />
                    )
            }
        </>

    )
}

export default CategoryTab