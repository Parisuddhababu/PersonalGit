// eslint-disable-next-line
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useState, useEffect } from 'react';
import {
    CModal,
    CModalHeader,
    CModalBody,
    CCloseButton
} from '@coreui/react'

const ImageModal = (props) => {
    const [visible, setVisible] = useState(false)
    const [imgPopupData, setimgPopupData] = useState({})
   
    useEffect(() => {
        setVisible(props.visible)
        setimgPopupData(props.imgObj)
    }, [props])

    const onCancel = () => {
        props.onCloseImageModal(false, false)
    }

    return (
        <>
            <CModal visible={visible} className="custom-image-modal">
                <CModalHeader>
                    <CCloseButton onClick={onCancel}></CCloseButton>
                </CModalHeader>

                <CModalBody>
                   <img src={imgPopupData?.path}/>
                </CModalBody>
            </CModal>
        </>
    )
}

export default ImageModal
