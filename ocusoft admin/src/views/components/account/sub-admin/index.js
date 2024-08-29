import React, { useEffect, useState } from "react";

import { CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilList, cilUserPlus } from "@coreui/icons";

import SubAdminList from "./list";
import AddEditSubAdmin from "./actions";
import { useToast } from "src/shared/toaster/Toaster";

const SubAdmin = ({ hcpId }) => {
    const { showError } = useToast();
    const actionSectionProps = { hcpId, changeSection };
    const listingSectionProps = { hcpId, changeSection, updateTotalRecords };

    const listingSection = () => SubAdminList;
    const addEditSection = () => AddEditSubAdmin;

    const [showAddBtn, setShowAddBtn] = useState(true);

    const addEditSubAdminBtnJSX = (
        <CButton
            type="button"
            color="success"
            disabled={!showAddBtn}
            onClick={() => {
                if (showAddBtn) changeSection("add");
                else showError("More than 5 records cannot be added.");
            }}
        >
            <CIcon icon={cilUserPlus} size="sm" />&nbsp;
            Add Sub Admin
        </CButton>
    );

    const listSubAdminBtnJSX = (
        <CButton color="primary" onClick={() => { changeSection("list"); }} type="button">
            <CIcon icon={cilList} size="sm" color="bg-primary" />&nbsp;
            List Sub Admin
        </CButton>
    );

    const [currentSection, setCurrentSection] = useState("list");
    const [TopBtnJSX, setTopBtnJSX] = useState(addEditSubAdminBtnJSX);
    const [RenderedSection, setRenderedSection] = useState(listingSection);
    const [renderedProps, setRenderedProps] = useState(listingSectionProps);

    useEffect(() => {
        const _jsx = currentSection === "list" ? addEditSubAdminBtnJSX : listSubAdminBtnJSX;
        setTopBtnJSX(_jsx);
    }, [currentSection, showAddBtn]);

    function updateTotalRecords(recordLength) {
        setShowAddBtn(recordLength < 5);
    }

    const getNewSection = (newSection, additionalProps = {}) => {
        let sectionJSX = null, props = null;
        switch (newSection) {
            case "add":
                sectionJSX = addEditSection;
                props = actionSectionProps;
                break;
            case "list":
                sectionJSX = listingSection;
                props = listingSectionProps;
                break;
            case "edit":
                sectionJSX = addEditSection;
                props = { ...actionSectionProps, ...additionalProps };
                break;
            default:
                break;
        }

        setCurrentSection(newSection);
        return { sectionJSX, props };
    }

    function changeSection(newSection, additionalProps = {}) {
        const { sectionJSX, props } = getNewSection(newSection, additionalProps);
        setRenderedProps({ ...props });
        setRenderedSection(sectionJSX);
    }

    return (
        <>
            <div className="clearfix">
                <div className="float-end d-flex">{TopBtnJSX}</div>
            </div>

            <hr />

            <RenderedSection {...renderedProps} />
        </>
    );
};

export default SubAdmin;
