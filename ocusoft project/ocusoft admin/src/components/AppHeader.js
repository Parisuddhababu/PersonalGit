import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";


const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector(state => state.sidebarShow);
  const unfoldable = useSelector(state => state.sidebarUnfoldable);

  return (
    <CHeader position="sticky" className="mb-3">
      <CContainer fluid className="p-0">
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          {!unfoldable && (<CIcon icon={cilMenu} size="lg" />)}
        </CHeaderToggler>

        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <CHeaderDivider />

      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
