import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import AddIntegratedScript from './add-integrated-script'
import AddPaymentIntegration from './add-payment-integration'
import AddSMSIntegration from './add-sms-integration'
import { API } from '../../../../services/Api';

const ProductTab = () => {
    const [activeIndex1, setActiveIndex1] = useState(0);
    const [accountData, setAccountData] = useState([]);

    useEffect(() => {
        getAccountData();
    }, []);

    const getAccountData = () => {
        API.getAccountDataByLoginId(accountRes, "", true)
    }

    const accountRes = {
        cancel: (c) => {
        },
        success: (response) => {
            if (response.meta.status_code === 200) {
                let resVal = response.data
                setAccountData(resVal)
            }
        },
        error: err => {
            console.log(err);
        },
        complete: () => { },
    }

    return (
        <div className="card">

            <TabView activeIndex={activeIndex1} onTabChange={(e) => setActiveIndex1(e.index)}>
                {/* <TabPanel header="Product Configuration">
                    <AddProductConfigration accountData={accountData} />
                </TabPanel> */}

                <TabPanel header="Integrated Script">
                    <AddIntegratedScript accountData={accountData} />
                </TabPanel>

                <TabPanel header="Integrated Payment">
                    <AddPaymentIntegration accountData={accountData} />
                </TabPanel>

                <TabPanel header="Mail Integration">
                    <AddSMSIntegration accountData={accountData} />
                </TabPanel>
            </TabView>
        </div>
    )
}

export default ProductTab;
