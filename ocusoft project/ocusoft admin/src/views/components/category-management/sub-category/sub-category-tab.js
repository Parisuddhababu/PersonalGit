import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState } from 'react';
import SubCategoryAddEdit from './add-edit-sub-categoy'

const SubSubcategoryTypeTab = () => {
    const [, setCategoryId] = useState('')

    const getCategoryId = (id) => {
        setCategoryId(id)
    }

    return (
        <div className="card">
            <SubCategoryAddEdit getCategoryId={getCategoryId} />
        </div>
    )
}

export default SubSubcategoryTypeTab