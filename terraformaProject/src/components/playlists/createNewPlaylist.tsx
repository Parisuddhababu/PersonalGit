import Button from '@components/button/button'
import { Cross, UploadImage } from '@components/icons/icons'
import TextInput from '@components/textInput/TextInput'
import React, { createRef, useCallback, useRef, useState } from 'react'
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import { whiteSpaceRemover } from '@utils/helpers';
import { createPlaylist } from '@framework/graphql/graphql';
import { CREATE_NEW_PLAYLIST } from '@framework/graphql/mutations/course';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import 'cropperjs/dist/cropper.css';
import { API_MEDIA_END_POINT, DATA_URL_TO_FILE, MAX_FILE_SIZE, uploadImage } from '@config/constant';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

type PlayListCallbackType = (data: boolean, getRefetchData: { refetch: boolean }) => void;

interface Props {
    playList: boolean;
    playListCallBack: PlayListCallbackType;
}

function CreateNewPlaylist({ playList, playListCallBack }: Readonly<Props>) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [cropper, setCropper] = useState(false);
    const [image, setImage] = useState('');
    const cropperRef = createRef<ReactCropperElement>();
    const [createNewPlaylist, playListLoading] = useMutation(CREATE_NEW_PLAYLIST);
    const [imageLoader,setImageLoader] = useState(false);
    const initialValues = {
        playlistName: '',
        playListImageUploadFileName: '',
    }

    const formik = useFormik({
        initialValues,
        onSubmit: () => {
            //
        },
    });

    const addNewPlayList = useCallback(() => {
        if (formik.values.playlistName.length > 1 && formik.values.playlistName.length < 31 && formik.values.playListImageUploadFileName) {
            createNewPlaylist({
                variables: {
                    playlistData: {
                        name: formik.values.playlistName,
                        image: formik.values.playListImageUploadFileName,
                    }
                },
            }).then((res) => {
                const data = res.data.createPlaylist as createPlaylist;
                toast.success(data?.message);
                formik.resetForm();
                playListCallBack(false, { refetch: true });
            })
                .catch((err) => {
                    toast.error(err?.networkError?.result?.errors?.[0]?.message);
                });
        }
        if (formik.values.playlistName.length < 2) {
            formik.setFieldError('playlistName', 'Playlist Name must be at least 2 characters')
        }
        if (formik.values.playlistName.length > 100) {
            formik.setFieldError('playlistName', 'Playlist Name must be at most 100 characters')
        }
        if (formik.values.playlistName.length === 0) {
            formik.setFieldError('playlistName', 'Please Enter Playlist Name')
        }
        if (!formik.values.playListImageUploadFileName) {
            formik.setFieldError('playListImageUploadFileName', 'Please upload playlist image.')
        }
    }, [formik]);

    const onCancel = () => {
        playListCallBack(false, { refetch: false });
        formik.resetForm();
    };

    const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
    }, []);

    const onDeleteImage = useCallback(async (): Promise<void> => {
        const data = { fileName: formik.values.playListImageUploadFileName };
        // Attempt to Delete the Image
        axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
            .then(() => {
                formik.setFieldValue('playListImageUploadFileName', '')
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message)
            });
    }, [formik]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePlaylistProfileImage = useCallback((e: any) => {
        e.preventDefault();
        playListCallBack(false, { refetch: false });
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        if (files && files?.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size > MAX_FILE_SIZE) {
                    toast.error('Image size must be less than 5MB');
                    playListCallBack(true, { refetch: false });
                } else {
                    const reader = new FileReader();
                    reader.onload = () => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setImage(reader.result as any);
                        setCropper(true);
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                toast.error('Please select a valid image file');
                playListCallBack(true, { refetch: false });
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // This clears the input field
        }
    }, []);

    const getCropData = async (): Promise<void> => {
        if (typeof cropperRef.current?.cropper !== 'undefined') {
            await setImageLoader(true);
            let fileName: string | null = null;
            const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'PlaylistProfilePreview.png');
            const formData = new FormData();
            formData.append('image', file);
            fileName = await uploadImage(formData,'courseImage');
            if (fileName) {
                formik.setFieldValue('playListImageUploadFileName', fileName)
                playListCallBack(true, { refetch: false });
            }
            setCropper(false);
            await setImageLoader(false);
        }
    }

    const dialogActionConst = () => {
        return (
            <div className='flex justify-end gap-3 md:gap-5'>
                <Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)} title='Cancel' />
                <Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" disabled={imageLoader} onClick={() => getCropData()} title='Save'/>
            </div>
        )
    }

    return (
        <>
            {playList && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${playList ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${playList ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full mx-5 max-w-[700px]'>
                            <div className='relative bg-white rounded-xl'>
                                <div className='flex flex-wrap items-center justify-between gap-4 p-5 border-b bg-accents-2 rounded-t-xl'>
                                    <p className='text-lg font-bold md:text-xl text-baseColor'>{'Add New Playlist'}</p>
                                    <Button onClick={onCancel} label={t('')} title={`${t('Close')}`}>
                                        <span className='text-xl-22'><Cross className='text-error' /></span>
                                    </Button>
                                </div>
                                <div className='w-full'>
                                    <div className='p-5 bg-white max-h-[calc(100vh-260px)] overflow-auto'>
                                        <TextInput placeholder={t('Add Name')} name='playlistName' onChange={formik.handleChange} label={t('Playlist Name')} value={formik.values.playlistName} id='playlistName' required={true} error={formik.errors.playlistName} onBlur={OnBlurBanner} />
                                    </div>

                                    <div className="w-full flex flex-col h-[176px] lg:w-[calc(50%-10px)] xl:min-w-[480px] xl:w-[calc(33.3%-14px)] mx-auto">
                                        <label
                                            htmlFor='Playlist Profile Image'
                                            className='relative flex items-center justify-center h-full p-5 overflow-hidden bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100'
                                        >
                                            <div className='flex flex-col items-center justify-center h-full overflow-hidden rounded-xl'>
                                                {!formik.values.playListImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
                                                {formik.values.playListImageUploadFileName && <img src={process.env.REACT_APP_IMAGE_BASE_URL + '/' + formik.values.playListImageUploadFileName} alt='Playlist Profile Image' className='object-fill w-full h-full' />}
                                                {!formik.values.playListImageUploadFileName && <p className='text-xl text-light-grey'>{t('Upload Image')}</p>}
                                            </div>
                                            {formik.values.playListImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImage()} title={`${t('Close')}`} >
                                                <Cross className='fill-white' fontSize='12' />
                                            </Button>}
                                            <input
                                                id='Playlist Profile Image'
                                                type="file"
                                                accept=".png, .jpeg"
                                                ref={fileInputRef}
                                                onChange={handlePlaylistProfileImage}
                                                className="hidden"
                                                key={uuidv4()}
                                            />
                                        </label>
                                        {formik?.errors?.playListImageUploadFileName ? <span className='-mt-1 md:text-xs-15 error'>{formik?.errors?.playListImageUploadFileName}</span> : ''}
                                    </div>

                                    <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                                        <Button className='btn-primary btn-normal w-full md:w-[90px]' label={t('Add')} onClick={addNewPlayList} type='button' disabled={playListLoading.loading} title={`${t('Add')}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Dialog className="custom-dialog" header="Crop Image" visible={cropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setCropper(false)} footer={() => dialogActionConst()}>
                {
                    image &&
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: '100%' }}
                        zoomTo={0.5}
                        aspectRatio={1}
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                        cropBoxResizable={false}
                    />
                }
            </Dialog>
        </>
    )
}

export default CreateNewPlaylist
