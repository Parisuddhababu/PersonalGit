import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { CatalogueProps, FilterInfluencerProps } from '@type/influencer';
import { useFormik } from 'formik';
import React, { ReactElement, useCallback, useEffect } from 'react';
import filterServiceProps from '@components/filter/filter';

const CatalogueFilter = ({ onSearchCatalogue, filterData }: CatalogueProps): ReactElement => {
    const initialValues: FilterInfluencerProps = {
        search: '',
    };

    /**
* Method that sets filterdata in local storage
*/
    useEffect(() => {
        const savedCatelogueFilterDataJSON = filterServiceProps.getState('catelogue', JSON.stringify(filterData));

        // Parse the JSON data retrieved from local storage
        const savedCatelogueFilterData = JSON.parse(savedCatelogueFilterDataJSON);

        // Set the formik field values using setValues
        formik.setValues(savedCatelogueFilterData || initialValues);
    }, [filterData]);

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            onSearchCatalogue(values);
        },
    });

    /**
     * method that reset filter data
     */
    const onCatelogueReset = useCallback(() => {
        formik.resetForm();
        onSearchCatalogue(initialValues);
    }, []);

    return (
        <div className='card'>
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-grid-filter'>
                        <TextInput id={'search'} placeholder={('Search')} name='search' onChange={formik.handleChange} value={formik.values.search} />
                        <div>
                            <div className='flex items-start justify-end col-span-3 btn-group '>
                                <Button className='btn-primary ' type='submit' label={('Search')}>
                                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                                        <Search />
                                    </span>
                                </Button>
                                <Button className='btn-warning ' onClick={onCatelogueReset} label={('Reset')}>
                                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                                        <Refresh />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default CatalogueFilter;



