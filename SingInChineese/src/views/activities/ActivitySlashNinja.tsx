import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { AddEditActivitiesData } from 'src/types/activities';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import { activityPaths, endPoint, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { stringNoSpecialChar } from '@config/validations';
import { moveData } from '@utils/helpers';
import DndSlashNinja from './DndSlashNinja';
import { SlashNinjaActivityList, SlashNinjaActivitySubmitData, SlashNinjaMatchingActivityDataArr, SlashNinjaTileData, SlashNinjaTileDataArr } from 'src/types/activities/slashNinja';
import CheckBox from '@components/checkbox/CheckBox';

const ActivitySlashNinja = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
    const params = useParams();
    const [loadingSlashNinja, setLoadingSlashNinja] = useState<boolean>(false);
    const [provideSkipSlashNinja, setProvideSkipSlashNinja] = useState<boolean>(false);
    const [checkedSlashNinja, setCheckedSlashNinja] = useState<string>(fileTypeEnum.image);
    const [tileDataSlashNinja, setTileDataSlashNinja] = useState<SlashNinjaTileDataArr>();
    const [selectedItemsTraditionalSlashNinja, setSelectedItemsTraditionalSlashNinja] = useState<Array<string>>([]);
    const [selectedItemsSimplifiedSlashNinja, setSelectedItemsSimplifiedSlashNinja] = useState<Array<string>>([]);
    const [dndList, setDndList] = useState<SlashNinjaActivityList[]>([]);
    const [newOrder, setNewOrder] = useState<SlashNinjaActivityList[]>();

    const radioOptionsSlashNinja = [
        { name: 'Image To Image', key: fileTypeEnum.image, disabled: !!params.activityId },
        { name: 'Image To Text', key: fileTypeEnum.text, disabled: !!params.activityId },
    ];

    useEffect(() => {
        if (newOrder) {
            setDndList(newOrder);
        }
    }, [newOrder])

    /**
     *@returns Method used for setValue from activity data and get the details of activity by uuid
     */
    useEffect(() => {
        setLoadingSlashNinja(true);
        APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
            .then((response) => {
                if (response.status === ResponseCode.success) {
                    const data = response.data.data.data.allActivityArr;
                    setTileDataSlashNinja(data);
                }
                setLoadingSlashNinja(false);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
                setLoadingSlashNinja(false);
            });
    }, []);

    useEffect(() => {
        if (params.activityId) {
            APIService.getData(`${url}/${activityPaths.slashNinjaGame}/${params.activityId}`)
                .then((response) => {
                    if (response.status === ResponseCode.success) {
                        const { activityData, title, isSkippable, toggle } = response.data.data;
                        toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
                        formik.setFieldValue(FieldNames.title, title);
                        setProvideSkipSlashNinja(isSkippable);
                        setCheckedSlashNinja(activityData[0].isImage ? fileTypeEnum.image : fileTypeEnum.text);
                        formik.setFieldValue(FieldNames.isSkippable, isSkippable);
                        activityData?.forEach((tile: SlashNinjaMatchingActivityDataArr) => {
                            changeSelectionActivitySlashNinja(tile.activityDataId, FieldNames.traditional, tile.traditionalImage);
                        });
                    }
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message);
                });
        }
    }, []);

    const initialValues: SlashNinjaActivitySubmitData = {
        [FieldNames.levelId]: params.levelId as string,
        [FieldNames.topicId]: params.topicId as string,
        [FieldNames.lessonId]: params.lessonId as string,
        [FieldNames.activityTypeId]: activityUuid,
        [FieldNames.title]: '',
        [FieldNames.activityData]: [],
        [FieldNames.isSkippable]: false,
        [FieldNames.isImage]: false,
        isMoving: isMoving,
    };

    /**
     *
     * @returns Method used for get validation for add/edit activity
     */
    const getObjSlashNinja = () => {
        const objSlashNinja: ObjectShape = {
            [FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
        };
        return Yup.object<ObjectShape>(objSlashNinja);
    };
    const validationSchema = getObjSlashNinja();

    const activityDataObjSlashNinja: SlashNinjaMatchingActivityDataArr[] = [];
    if (checkedSlashNinja === fileTypeEnum.text) {
        dndList?.filter((item, index: number) => {
            tileDataSlashNinja?.filter((tile) => {
                if (tile?.activityDataId === item.id) {
                    activityDataObjSlashNinja.push({
                        activityDataId: tile.activityDataId,
                        simplifiedImage: tile.simplifiedGameImageUrl,
                        simplifiedAudio: tile.simplifiedGameAudioUrl,
                        simplifiedText: tile.simplifiedTitleChinese,
                        traditionalImage: tile.traditionalGameImageUrl,
                        traditionalAudio: tile.traditionalGameAudioUrl,
                        traditionalText: tile.traditionalTitleChinese,
                        isImage: false,
                        order: index + 1
                    });
                }
            });
        });
    } else {
        dndList?.filter((item, index) => {
            tileDataSlashNinja?.filter((tile) => {
                if (tile?.activityDataId === item.id) {
                    activityDataObjSlashNinja.push({
                        activityDataId: tile.activityDataId,
                        simplifiedImage: tile.simplifiedGameImageUrl,
                        simplifiedAudio: tile.simplifiedGameAudioUrl,
                        traditionalImage: tile.traditionalGameImageUrl,
                        traditionalAudio: tile.traditionalGameAudioUrl,
                        isImage: true,
                        order: index + 1
                    });
                }
            });
        });
    }
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const submitDataSlashNinja: SlashNinjaActivitySubmitData = {
                isMoving: isMoving,
                levelId: moveData(isMoving, levelId as string, values.levelId as string),
                topicId: moveData(isMoving, topicId as string, values.topicId),
                lessonId: moveData(isMoving, lessonId as string, values.lessonId),
                activityTypeId: values.activityTypeId,
                title: values.title,
                activityData: activityDataObjSlashNinja,
                isSkippable: provideSkipSlashNinja,
            };
            if(activityDataObjSlashNinja.length < 3){
                toast.error(Errors.CARDS_GREATER_THAN_OR_EQUAL_TO)
                return
            }
            if (checkedSlashNinja === fileTypeEnum.image && activityDataObjSlashNinja.length > 10) {
				toast.error(`${Errors.CARDS_LESS_THAN_OR_EQUAL_TO} 10.`);
				return;
			}
			if (checkedSlashNinja === fileTypeEnum.text && activityDataObjSlashNinja.length > 6) {
				toast.error(`${Errors.CARDS_LESS_THAN_OR_EQUAL_TO} 6.`);
				return;
			}
            if (params.activityId) {
                setLoadingSlashNinja(true);
                APIService.putData(`${url}/${activityPaths.slashNinjaGame}/${params.activityId}`, submitDataSlashNinja)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingSlashNinja(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingSlashNinja(false);
                    });
            } else {
                setLoadingSlashNinja(true);
                APIService.postData(`${url}/${activityPaths.slashNinjaGame}`, submitDataSlashNinja, isMoving)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingSlashNinja(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingSlashNinja(false);
                    });
            }
        },
    });

    /**
     *
     * @returns Method used to Perform Selection.
     */
    const changeSelectionActivitySlashNinja = (activityDataId: string, chinese: string, imageUrl: string) => {
        if (chinese === FieldNames.traditional) {
            if (!selectedItemsTraditionalSlashNinja.includes(activityDataId)) {
                setSelectedItemsTraditionalSlashNinja((prevItem) => [...prevItem, activityDataId]);
                setDndList(prevList => [...prevList, { id: activityDataId, image: imageUrl }]);
            } else {
                setDndList(dndList?.filter((item) => item.id !== activityDataId));
                setSelectedItemsTraditionalSlashNinja(selectedItemsTraditionalSlashNinja?.filter((item: string) => item !== activityDataId));
            }

        }
        if (chinese === FieldNames.simplified) {
            if (!selectedItemsSimplifiedSlashNinja.includes(activityDataId)) {
                setSelectedItemsSimplifiedSlashNinja((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsSimplifiedSlashNinja(selectedItemsSimplifiedSlashNinja?.filter((item: string) => item !== activityDataId));
            }
        }
    }

    return (
        <form className='w-full' onSubmit={formik.handleSubmit}>
            {loadingSlashNinja && <Loader />}
            <div className='mb-4'>
                <TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
            </div>
            <div className='mb-4'>
                <RadioButton
                    id='matchingType'
                    label={'Matching Type'}
                    name='isImageToImage'
                    onChange={useCallback(
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckedSlashNinja(e.target.value);
                            formik.handleChange(e);
                        },
                        [checkedSlashNinja]
                    )}
                    checked={checkedSlashNinja}
                    radioOptions={radioOptionsSlashNinja}
                    required
                />
            </div>
            <div className='flex gap-3 mb-4'>
                <div className='rounded border w-full'>
                    <h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
                    <div className='p-3'>
                        {tileDataSlashNinja?.length ? (
                            <ul className={'grid grid-cols-3 md:grid-cols-8 gap-3 media-list '}>
                                {tileDataSlashNinja?.map((tile: SlashNinjaTileData) => {
                                    return !tile?.isFlashCardText && tile.traditionalGameImageUrl ? (
                                        <li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative  ${selectedItemsTraditionalSlashNinja?.includes(tile.activityDataId) ? 'border-primary border-2 active ' : ''} `} >
                                            <button type='button' className='w-full h-full cursor-pointer' onClick={() => changeSelectionActivitySlashNinja(tile.activityDataId, FieldNames.traditional, tile.traditionalGameImageUrl)}> <img src={tile.traditionalGameImageUrl} alt='Img preview' className='h-full w-full object-cover rounded' width='139' height='160' /></button>
                                        </li>
                                    ) : (
                                        ''
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className='text-center font-medium py-5 text-gray-400'>No Flashcard Available.</div>
                        )}
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Traditional Image</th>
                    </tr>
                </thead>
                <tbody>
                    {dndList && <DndSlashNinja dndItemRow={dndList} setNewOrder={setNewOrder} />}
                    {!dndList.length && (
                        <tr>
                            <td colSpan={7} className='text-center font-medium py-5 text-gray-400'>
                                No Data Added
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className='flex justify-end gap-2 items-center'>
                <CheckBox
					option={[
						{
							id: 'provideSkipSlashNinja',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipSlashNinja,
							onChange: () => {
								setProvideSkipSlashNinja((prev) => !prev);
							},
						},
					]}
				/>
                <Button className='btn-primary btn-large w-28 justify-center' type='submit'>
                    {params.activityId ? 'Update' : 'Save'}
                </Button>
                <Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </form >
    );
};

export default ActivitySlashNinja;

