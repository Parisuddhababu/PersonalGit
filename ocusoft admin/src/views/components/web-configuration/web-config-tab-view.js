import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { API } from '../../../services/Api';
import * as Constant from "../../../shared/constant/constant"
import AddEditFooter from "./footer"

const WebConfigTab = () => {
    const [activeIndex1, setActiveIndex1] = useState(2);
    const [, setFilterSequenceData] = useState([])

    useEffect(() => {
        getFilterSequenceData()
    }, [])

    const getFilterSequenceData = () => {
        API.getDrpData(onFilterSequenceList, '', true, Constant.FILTER_SEQUENCE_TYPE);
    }

    const onFilterSequenceList = {
        cancel: (c) => {
        },
        success: (response) => {
            // setIsLoading(false)
            if (response.meta.status_code === 200) {
                setFilterSequenceData(response.data)

            }
        },
        error: (error) => {
            // setIsLoading(false)

        },
        complete: () => {
        },
    }

    return (
        <div className="card">

            <TabView activeIndex={activeIndex1} onTabChange={(e) => setActiveIndex1(e.index)}>
                <TabPanel header="Header">
                    {/* <CategoryAddEdit getCategoryId={getCategoryId} /> */}
                </TabPanel>
                <TabPanel header="Header Top Menu">
                    {/* <FilterAddEdit filterSequenceData={filterSequenceData} category_id={category_id} /> */}
                </TabPanel>
                <TabPanel header="Footer">
                    <AddEditFooter />
                </TabPanel> 
                <TabPanel header="Contact Us">
                    {/* <FilterAddEdit filterSequenceData={filterSequenceData} category_id={category_id} /> */}
                </TabPanel> 
                <TabPanel header="Terms">
                    {/* <FilterAddEdit filterSequenceData={filterSequenceData} category_id={category_id} /> */}
                </TabPanel>
                <TabPanel header="Privacy">
                    {/* <FilterAddEdit filterSequenceData={filterSequenceData} category_id={category_id} /> */}
                </TabPanel>
                <TabPanel header="Setting">
                    {/* <FilterAddEdit filterSequenceData={filterSequenceData} category_id={category_id} /> */}
                </TabPanel>
            </TabView>
        </div>
    )
}

export default WebConfigTab