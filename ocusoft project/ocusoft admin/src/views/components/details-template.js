import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { uuid, displayDateTimeFormat } from "src/shared/handler/common-handler";
import { CModal, CModalHeader, CCloseButton, CModalBody, CBadge } from "@coreui/react";

function defaultBodyTemplate(key, defaultValue) {
    return rowData => <p>{rowData?.[key] ?? defaultValue ?? ''}</p>;
}

const DetailsTemplate = ({ collectionMode, collectionDetailsData, visible, closeCollectionDetailsDialog, headingText }) => {
    const dynamicColumnConfig = {
        view: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "viewedCollections", header: "Total Viewed Collections", body: defaultBodyTemplate("viewedCollections", 0) }
        ],
        product: [
            { field: "image", header: "Image", body: imageBodyTemplate },
            { field: "sku", header: "SKU", body: defaultBodyTemplate("sku") },
            { field: "title", header: "Title", body: defaultBodyTemplate("title") },
            { field: "metal", header: "Metal Name", body: defaultBodyTemplate("metal") },
            { field: "categoryType", header: "Category Type", body: defaultBodyTemplate("categoryType") },
            { field: "category", header: "Category", body: defaultBodyTemplate("category") },
            { field: "subCategory", header: "Sub Category", body: defaultBodyTemplate("subCategory") },
            { field: "date", header: "Order Date", body: dateBodyTemplate },
        ],
        viewedProducts: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "viewedProducts", header: "Total Viewed Products", body: defaultBodyTemplate("viewedProducts", 0) }
        ],
        viewedCategoryTypes: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name", "Guest User") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "viewedCategoryTypes", header: "Total Viewed Category Types", body: defaultBodyTemplate("viewedCategoryTypes", 0) }
        ],
        viewedCategories: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name", "Guest User") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "viewedCategories", header: "Total Viewed Categories", body: defaultBodyTemplate("viewedCategories") }
        ],
        inquiryDetails: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "query", header: "Query", body: defaultBodyTemplate("query") },
            { field: "date", header: "Inquiry Date", body: dateBodyTemplate },
        ],
        bookDemoDetails: [
            { field: "name", header: "Name", body: defaultBodyTemplate("name") },
            { field: "email", header: "Email", body: defaultBodyTemplate("email") },
            { field: "phone", header: "Mobile No.", body: defaultBodyTemplate("phone") },
            { field: "message", header: "Message", body: defaultBodyTemplate("message") },
            { field: "date", header: "Demo Date", body: defaultBodyTemplate("date") },
        ]
    }

    const [data, setData] = useState([]);
    const [heading, setHeading] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        if (collectionDetailsData?.length) {
            setHeading(headingText ?? "Details Template");
            setData([...collectionDetailsData]);
            setTotalRecords(collectionDetailsData.length);
        }
    }, [collectionDetailsData]);

    function dateBodyTemplate(rowData) {
        return (
            <>
                <span className="p-column-title">Date</span>
                <p>{displayDateTimeFormat(rowData.date) ?? ''}</p>
            </>
        );
    }

    function imageBodyTemplate(rowData) {
        return (
            <>
                {rowData?.image ? <img className="form-control" src={rowData?.image} alt="Product Image" /> : <></>}
            </>
        );
    }

    const getCollectionColumns = () => {
        return dynamicColumnConfig?.[collectionMode]?.map(columnConfig => <Column key={uuid()} {...columnConfig} />);
    }

    return (
        <CModal scrollable visible={visible} size="xl">
            <CModalHeader>
                <h2>{heading}<CBadge color="danger">{totalRecords}</CBadge></h2>
                <CCloseButton onClick={closeCollectionDetailsDialog}></CCloseButton>
            </CModalHeader>

            <CModalBody>
                <div className="datatable-responsive-demo custom-react-table">
                    <div className="card">
                        <DataTable
                            value={data}
                            showGridlines
                            responsiveLayout="scroll"
                            className="p-datatable-responsive-demo"
                        >
                            {getCollectionColumns()}
                        </DataTable>
                    </div>
                </div>
            </CModalBody>
        </CModal>
    )
}

export default DetailsTemplate;
