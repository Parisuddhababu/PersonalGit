import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState } from 'react';
import CategoryTypeAddEdit from './add-edit-category-type'

const CategoryTypeTab = () => {
    const [, setCategoryId] = useState('')

    const getCategoryId = (id) => {
        setCategoryId(id)
    }

    return (
        <div className="card">
            <CategoryTypeAddEdit getCategoryId={getCategoryId} />
        </div>
    )
}

export default CategoryTypeTab