// eslint-disable-next-line
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { CImage } from '@coreui/react'
import * as Constant from "../shared/constant/constant"
import { Toast } from 'primereact/toast';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import useCompressor from './compressor/useCompressor';
let fileType = null;

const ImageCropModal = (props) => {
    const toast = useRef(null);
    const imgRef = useRef(null);
    const fileUploadRef = useRef(null);

    const { 1: init } = useCompressor();

    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [completedCrop, setCompletedCrop] = useState(null);
    const [blobObj, setBlobObj] = useState({ blob: '', obj: {}, isUrl: false })
    const [coverImage, setCoverImage] = useState({ url: '', noPicture: false, obj: {} })
    const [crop, setCrop] = useState({
        unit: '%',
        width: 100,
    })
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        setVisible(props.visible)
        // This is patch work. Need to work on this in the future.
        if (props?.name === "header-img") {
            setCrop({ ...crop, aspect: props.logoWidth / props.logoHeight, height: 100 });
        } else {
            setCrop({ ...crop, aspect: props.logoWidth / props.logoHeight, });
        }
    }, [props])

    useEffect(() => {
        if (!completedCrop || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        canvas.name = fileName;
        canvas.filename = fileName;

        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );
        canvas.toBlob(
            (blob) => {
                let obj = blob
                obj.url = URL.createObjectURL(blob)
                obj.name = fileName
                obj.filename = fileName
                setBlobObj({ blob: obj.url, obj: obj, isUrl: true })
            },
            // 'image/jpg',
            1
        );
    }, [completedCrop]);

    const onLoad = useCallback((img) => {
        setLoading(false);
        imgRef.current = img;
    }, []);

    const onCompleteCrop = (c) => {
        if (!c) {
            return;
        }
        setCompletedCrop(c)
    }

    const resetFileCache = () => {
        fileUploadRef.current.value = '';
    }

    const onHandleUpload = (event) => {
        const targetImg = event.target.files[0];
        setFileName(targetImg.name)
        fileType = targetImg.type;
        if (targetImg) {
            setLoading(true);
            const imgSize = Constant.IMAGE_SIZE;
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
            if (fileTypes.includes(targetImg.type) === false) {
                toast.current.show({ severity: 'error', detail: "Allow only png, jpg and jpeg", life: 3000 });
                // Hide loader when load image in modal
                setLoading(false);
                resetFileCache();
            } else if ((targetImg.size / 1000) / 1024 < imgSize) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCoverImage({ url: e.target.result, noPicture: true, obj: targetImg, filename: targetImg.name })
                };

                reader.readAsDataURL(targetImg);
            } else {
                toast.current.show({ severity: 'error', detail: "Max upload size " + imgSize + " MB", life: 3000 });
                // Hide loader when load image in modal
                setLoading(false);
                resetFileCache();
            }
        }
    }

    const onHide = () => {
        props.onCloseModal();
    }

    const setCropImageData = () => {
        if (completedCrop) {
            init(blobObj.obj, {
                options: {
                    strict: true,
                    checkOrientation: true,
                    quality: 0.7,
                    convertTypes: blobObj.obj.type,
                    mimeType: fileType === 'image/png' ? fileType : blobObj.obj.type,
                    convertSize: 50000,
                    success(result) {
                        props.cropImageData({ url: blobObj.blob, noPicture: true, obj: result })
                    },
                    error(err) {
                        props.cropImageData({ url: blobObj.blob, noPicture: true, obj: blobObj.obj })
                    }
                }
            });

        } else {
            props.cropImageData(coverImage);
        }
    }

    const renderFooter = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileUploadRef}
                    onChange={(e) => onHandleUpload(e)}
                />
                <Button label="Browse" icon='pi pi-upload' className='p-button-success mr-2' onClick={() => fileUploadRef.current.click()} />
                {coverImage.url && <Button label="Save Image" icon="pi pi-plus" onClick={() => setCropImageData()} className="mr-2 p-button-primary" />}
            </div>
        );
    }

    return (
        <Dialog header={`Crop Image (Max upload size : ${Constant.IMAGE_SIZE}MB)`} className="text-align-center image-crop-modal" visible={visible} style={{ width: '60vw' }} footer={renderFooter()} onHide={() => onHide()}>
            <Toast ref={toast} />
            <div className="form-control upload-image-wrap multi-upload-image-wrap">
                {loading && <h4 className="text-center">Loading...</h4>}
                {coverImage.url &&
                    <div className="row">
                        <div className="col-md-7">
                            {coverImage.obj && <ReactCrop
                                src={coverImage.url}
                                crop={crop}
                                onImageLoaded={onLoad}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => onCompleteCrop(c)}
                            />}
                        </div>
                        <div className="col-md-3">
                            <div className="profile mb-3">
                                <div className="profile-wrapper">
                                    {blobObj.obj ?
                                        <CImage src={blobObj.blob} alt="File" className="profile-img canvas" />
                                        :
                                        <CImage src={coverImage.url} alt="File" className="profile-img" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Dialog>
    )
}

export default ImageCropModal
