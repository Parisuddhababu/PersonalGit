import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler, CImage } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import { useHistory } from "react-router-dom";

import logo_mobile from 'src/assets/images/logo_mobile.jpeg'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  let history = useHistory();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const signin = useSelector((state) => state.signin);

  const onRedirect = () =>{
    history.push("/dashboard");
  }

  return (
    <CSidebar
      position="fixed"
      selfHiding="md"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onHide={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {signin?.logo?.site_logo?.path ?
          <a href='#'>
            <CImage className="sidebar-brand-full" src={`${signin.logo.site_logo.path}`} height={50} onClick={() =>onRedirect()} />
            <CImage className="sidebar-brand-narrow" src={`${signin.logo.site_logo.path}`} height={50} onClick={() =>onRedirect()}/>
          </a>
          :
          <a href='#'>
            <CImage style={{cursor:'pointer'}} className="sidebar-brand-full" src={logo_mobile} height={50} onClick={() =>onRedirect()}/>
            <CImage className="sidebar-brand-narrow" src={logo_mobile} height={50} onClick={() =>onRedirect()} />
          </a>
        }
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-md-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
