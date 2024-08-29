import React, { useState, useEffect } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCloseButton
} from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux';
import { API } from '../../services/Api';
import * as Constant from "../../shared/constant/constant"
import {
  cilUser,
  cilAccountLogout
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar10 from './../../assets/images/avatars/10.png'
import { useHistory } from "react-router-dom";

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const signin = useSelector((state) => state.signin);
  const user_details = localStorage.getItem('user_details') ? JSON.parse(localStorage.getItem('user_details')) : '';
  const fullname = user_details ? user_details.first_name + ' ' + user_details.last_name : '';
  const [visible, setVisible] = useState(false)

  const logout = () => {
    localStorage.removeItem('is_main_website')
    localStorage.removeItem('permission')
    localStorage.removeItem('current-path')
    localStorage.removeItem('website_id')
    localStorage.removeItem('token')
    localStorage.removeItem('user_details')
    history.push("/login");
  }

  const onProfile = () => {
    history.push("/profile");
    closeMenu();
  }
  useEffect(() => {
    getProfileData()
  }, []);

  const getProfileData = async () => {
    API.getActiveDataList(Constant.PROFILE_SHOW, profileListRes, {}, true);
  }

  // profileListRes Response Data Method
  const profileListRes = {
    cancel: (c) => {
    },
    success: (response) => {
      if (response.meta.status_code === 200) {
        dispatch({ type: 'signin', signin: response.data })
      }
    },
    error: (error) => {
      // setIsLoading(false)
    },
    complete: () => {
    },
  }

  const showModal = (e) => {
    e.preventDefault();
    closeMenu();
    setVisible(true);
  }

  const closeMenu = () => {
    document.getElementById('headerMenu').classList.remove('show');
  }

  return (
    <div>
      <CDropdown variant="nav-item" className='name-with-icon'>
        <b>{fullname}</b>
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          {signin?.profile_image?.path ?
            <CAvatar src={`${signin.profile_image.path}`} size="md" />
            : <CAvatar src={avatar10} size="md" />
          }
        </CDropdownToggle>
        <CDropdownMenu placement="bottom-end" id='headerMenu'>
          {/* <CDropdownHeaderef className="bg-light fw-semibold py-2">Settings</CDropdownHeader> */}
          <CDropdownItem onClick={onProfile} href="/#/profile">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={(e) => showModal(e)} href="#">
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      <CModal visible={visible}>
        <CModalHeader className="bg-primary" onClose={() => setVisible(false)}>
          <CModalTitle>Confirmation</CModalTitle>
          <CCloseButton onClick={() => setVisible(false)}></CCloseButton>
        </CModalHeader>
        <CModalBody>Are you sure want to logout?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => { setVisible(false) }}>No</CButton>
          <CButton color="primary" onClick={logout}>Yes</CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default AppHeaderDropdown
