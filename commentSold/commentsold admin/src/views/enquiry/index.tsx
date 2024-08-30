
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { PhoneCall } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@config/constant';
import { FilterEnquiryProps, PaginationParamsList } from '@type/influencer';
import React, { useCallback, useState } from 'react';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import filterServiceProps from '@components/filter/filter';
import ContactUsFilter from './filterContactList';
import { GET_CONTACTS_LIST } from '@framework/graphql/queries/contactUs';


const Enquiry = () => {
    const { localFilterData } = useSaveFilterData();
    const [enquiryFilterData, setEnquiryFilterData] = useState<PaginationParamsList>(
        localFilterData('enquiry') ?? {
            limit: DEFAULT_LIMIT,
            page: DEFAULT_PAGE,
            sortBy: sortBy,
            sortOrder: sortOrder,
            search: ''
        }
    );
    const COL_ARR = [
        { name: 'First Name', sortable: true, fieldName: 'first_name', type: 'text' },
        { name: 'Last Name', sortable: true, fieldName: 'last_name', type: 'text' },
        { name: 'Email', sortable: true, fieldName: 'email', type: 'number' },
        { name: 'Phone Code', sortable: true, fieldName: 'country_code_id', type: 'number' },
        { name: 'Mobile Number', sortable: true, fieldName: 'phone_number', type: 'text' },
        { name: 'Message', sortable: false, fieldName: 'message', type: 'text' }
    ] as IColumnsProps[];


    /**
     *
     * @param values Method used for set filter data
     */
    const onSearchContactList = useCallback((values: FilterEnquiryProps) => {
        const updatedEnquriyFilterData = {
            ...enquiryFilterData,
            search: values.search,
        };
        setEnquiryFilterData(updatedEnquriyFilterData);
        filterServiceProps.saveState('enquiry', JSON.stringify(updatedEnquriyFilterData));

    }, [enquiryFilterData])

    return (
        <div>
            <ContactUsFilter onSearchContactList={onSearchContactList} filterData={enquiryFilterData} />
            <div className='card-table'>
                <div className='flex-wrap gap-2 card-header'>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
                            <PhoneCall />
                        </span>
                        {('Enquiry List')}
                    </div>
                </div>
                <div className='flex justify-between mb-3'>
                </div>
                <div className='card-body'>
                    <BVDataTable
                        defaultActions={[]}
                        columns={COL_ARR}
                        queryName={GET_CONTACTS_LIST}
                        sessionFilterName='enquiry'
                        actionWisePermissions={{}}
                        updatedFilterData={enquiryFilterData}
                        idKey={'uuid'}
                        actionData={{}}
                    />
                </div>
            </div>
        </div>

    )
}
export default Enquiry;



