// eslint-disable-next-line
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import {
  CCloseButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { API } from "../../../services/Api";
import * as Constant from "../../../shared/constant/constant";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loader from "../common/loader/loader";

const FooterDefault = (props) => {

  const [masterForm, setMasterForm] = useState({
    menu1Obj: [{ title: "", url: "" }],
    menu2Obj: [{ title: "", url: "" }],
    menu3Obj: [{ title: "", url: "" }],
    menu4Obj: [{ title: "", url: "" }],
    menu1Checked: 0,
    menu2Checked: 0,
    menu3Checked: 0,
    menu4Checked: 0,
    menu1Title: "",
    menu2Title: "",
    menu3Title: "",
    menu4Title: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    getFooterDefaultDataByAccountId();
  }, []);

  const getFooterDefaultDataByAccountId = () => {
    setIsLoading(true);
    API.getMasterDataById(getMasterRes, "", true, '',Constant.GET_DEFAULT_FOOTER);
  }

  // getMasterRes Response Data Method
  const getMasterRes = {
    cancel: (c) => {},
    success: (response) => {
      if (response.meta.status_code === 200) {
        setIsLoading(false);
        let resVal = response.data?.original?.data[0];
        let obj = {
          menu1Obj: [{ title: "", url: "" }],
          menu2Obj: [{ title: "", url: "" }],
          menu3Obj: [{ title: "", url: "" }],
          menu4Obj: [{ title: "", url: "" }],
          menu1Checked: 0,
          menu2Checked: 0,
          menu3Checked: 0,
          menu4Checked: 0,
          menu1Title: "",
          menu2Title: "",
          menu3Title: "",
          menu4Title: "",
        };
        if (resVal?.footer_menus.length > 0) {
          resVal?.footer_menus?.map((item, index) => {
            if (item?.is_default === 1) {
              obj[`menu${index + 1}Title`] = item?.menu_header_title;
              if (item?.menu_links.length > 0) {
                let temp_arr = [];
                item?.menu_links?.map((menuItem, i) => {
                  temp_arr.push({ title: menuItem.title, url: menuItem.link });
                });
                obj[`menu${index + 1}Obj`] = temp_arr;
                obj[`menu${index + 1}Checked`] = 1;
              }
            }
          });
        }
        setMasterForm(obj);
      }
    },
    error: (error) => {
      setIsLoading(false);
    },
    complete: () => {},
  };
  
  const titleBodyTemplate = (rowData, indexData, name) => {
    return (
      <>
        <InputText disabled
          className="form-control"
          value={masterForm?.[name]?.[indexData.rowIndex]?.title}
          name={name}
          placeholder="title"
        />
      </>
    );
  };

  const urlBodyTemplate = (rowData, indexData, name) => {
    return (
      <InputText
        disabled
        className="form-control"
        value={masterForm?.[name]?.[indexData.rowIndex]?.url}
        name={name}
        placeholder="url"
      />
    );
  };

  const header1 = (
    <div className="table-header">
      <form name="filterFrm">
        <div className="row">
          <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
            <Checkbox
              checked={masterForm.menu1Checked === 1 ? true : false}
              name="menu1Checked"
              className="me-3"
              disabled
            ></Checkbox>
            <span className="p-float-label custom-p-float-label">
              <InputText
                className="form-control"
                value={masterForm.menu1Title}
                name="menu1Title"
                disabled
              />
              <label>Title </label>
            </span>
          </div>
        </div>
      </form>
    </div>
  );

  const header2 = (
    <div className="table-header">
      <form name="filterFrm">
        <div className="row">
          <div className="col-lg-12 col-xl-6 pb-3 d-flex align-items-center custom-checkbox">
            <Checkbox
              disabled
              checked={masterForm.menu2Checked === 1 ? true : false}
              name="menu2Checked"
              className="me-3"
            ></Checkbox>
            <span className="p-float-label custom-p-float-label">
              <InputText
                className="form-control"
                value={masterForm.menu2Title}
                name="menu2Title"
                disabled
              />
              <label>Title </label>
            </span>
          </div>
        </div>
      </form>
    </div>
  );

  const onClose = () => {
    props?.onClose();
  }

  return (
    <>
      {isLoading && <Loader />}
      <CModal visible={props?.visible} size="xl" className="modal-extra-large">
        <CModalHeader className="bg-primary" onClose={() => onClose()}>
          <CModalTitle>Footer Default Confirmation</CModalTitle>
          <CCloseButton onClick={() => onClose()}></CCloseButton>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-xl-6">
              <fieldset className="fieldset">
                <legend className="legend">Menu 1</legend>
                <div className="data-table-responsive">
                  <DataTable
                    value={masterForm.menu1Obj}
                    className="p-datatable-responsive-demo"
                    header={header1}
                  >
                    <Column
                      field="title"
                      header="Menu Title"
                      body={(rowData, indexData) =>
                        titleBodyTemplate(rowData, indexData, "menu1Obj")
                      }
                    ></Column>
                    <Column
                      field="url"
                      header="Url"
                      body={(rowData, indexData) =>
                        urlBodyTemplate(rowData, indexData, "menu1Obj")
                      }
                    ></Column>
                  </DataTable>
                </div>
              </fieldset>
            </div>
            <div className="col-xl-6">
              <fieldset className="fieldset">
                <legend className="legend">Menu 2</legend>

                <div className="data-table-responsive">
                  <DataTable
                    value={masterForm.menu2Obj}
                    className="p-datatable-responsive-demo"
                    header={header2}
                  >
                    <Column
                      field="title"
                      header="Menu Title"
                      body={(rowData, indexData) =>
                        titleBodyTemplate(rowData, indexData, "menu2Obj")
                      }
                    ></Column>
                    <Column
                      field="url"
                      header="Url"
                      body={(rowData, indexData) =>
                        urlBodyTemplate(rowData, indexData, "menu2Obj")
                      }
                    ></Column>
                  </DataTable>
                </div>
              </fieldset>
            </div>
            {/* <div className="col-xl-6">
              <fieldset className="fieldset">
                <legend className="legend">Menu 3</legend>

                <div className="data-table-responsive">
                  <DataTable
                    value={masterForm.menu3Obj}
                    className="p-datatable-responsive-demo"
                    header={header3}
                  >
                    <Column
                      field="title"
                      header="Menu Title"
                      body={(rowData, indexData) =>
                        titleBodyTemplate(rowData, indexData, "menu3Obj")
                      }
                    ></Column>
                    <Column
                      field="url"
                      header="Url"
                      body={(rowData, indexData) =>
                        urlBodyTemplate(rowData, indexData, "menu3Obj")
                      }
                    ></Column>
                  </DataTable>
                </div>
              </fieldset>
            </div>
            <div className="col-xl-6">
              <fieldset className="fieldset">
                <legend className="legend">Menu 4</legend>

                <div className="data-table-responsive">
                  <DataTable
                    value={masterForm.menu4Obj}
                    className="p-datatable-responsive-demo"
                    header={header4}
                  >
                    <Column
                      field="title"
                      header="Menu Title"
                      body={(rowData, indexData) =>
                        titleBodyTemplate(rowData, indexData, "menu4Obj")
                      }
                    ></Column>
                    <Column
                      field="url"
                      header="Url"
                      body={(rowData, indexData) =>
                        urlBodyTemplate(rowData, indexData, "menu4Obj")
                      }
                    ></Column>
                  </DataTable>
                </div>
              </fieldset>
            </div> */}
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default FooterDefault;
