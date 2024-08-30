import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { BrandUserRequestProps, FilterBrandUserProps } from '@type/brandUserRequest';
import { useFormik } from 'formik';
import React, { ReactElement, useCallback, useEffect } from 'react';
import filterServiceProps from '@components/filter/filter';

const SearchBrandRequests = ({ onSearchBrandUser, filterData }: BrandUserRequestProps): ReactElement => {
    const initialValues: FilterBrandUserProps = {
        search: '',
    };

    /**
* Method that sets filterdata in local storage
*/
    useEffect(() => {
        const savedBrandRequestFilterDataJSON = filterServiceProps.getState('brandUserRequest', JSON.stringify(filterData));

        // Parse the JSON data retrieved from local storage
        const savedBrandRequestFilterData = JSON.parse(savedBrandRequestFilterDataJSON);

        // Set the formik field values using setValues
        formik.setValues(savedBrandRequestFilterData || initialValues);
    }, [filterData]);

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            onSearchBrandUser(values);
        },
    });

    /**
     * method that reset filter data
     */
    const brandRequestReset = useCallback(() => {
        formik.resetForm();
        onSearchBrandUser(initialValues);
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
                                <Button className='btn-warning ' onClick={brandRequestReset} label={('Reset')}>
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
export default SearchBrandRequests;



