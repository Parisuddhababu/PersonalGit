import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { toast } from 'react-toastify';
import { FieldNames, ResponseCode } from 'src/interfaces/enum';
import { Loader } from '@components/index';
import { activityPaths, endPoint, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { stringNoSpecialChar } from '@config/validations';
import { moveData } from '@utils/helpers';
import DndSlashNinja from '@views/activities/DndSlashNinja';
import { SlashNinjaActivityList, SlashNinjaActivitySubmitData, SlashNinjaMatchingActivityDataArr, SlashNinjaTileDataArr } from 'src/types/activities/slashNinja';
import CheckBox from '@components/checkbox/CheckBox';

const SeasonalActivitySlashNinja = ({ onSubmit, onClose, url, activityUuid, toggleSeasonalActivity, isMoving, topicId, lessonId }: AddEditSeasonalActivityData) => {
    const params = useParams();
    const [loadingSlashNinjaSeasonal, setLoadingSlashNinjaSeasonal] = useState<boolean>(false);
    const [provideSkipSlashNinjaSeasonal, setProvideSkipSlashNinjaSeasonal] = useState<boolean>(false);
    const [checkedSlashNinjaSeasonal, setCheckedSlashNinjaSeasonal] = useState<string>(fileTypeEnum.image);
    const [tileDataSlashNinjaSeasonal, setTileDataSlashNinjaSeasonal] = useState<SlashNinjaTileDataArr>();
    const [selectedItemsTraditionalSlashNinjaSeasonal, setSelectedItemsTraditionalSlashNinjaSeasonal] = useState<Array<string>>([]);
    const [selectedItemsSimplifiedSlashNinjaSeasonal, setSelectedItemsSimplifiedSlashNinjaSeasonal] = useState<Array<string>>([]);
    const [dndList, setDndList] = useState<SlashNinjaActivityList[]>([]);
    const [newOrder, setNewOrder] = useState<SlashNinjaActivityList[]>();
    const radioOptionsMatchingSeasonal = [
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
        setLoadingSlashNinjaSeasonal(true);
        APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?topicId=${params.topicId}&lessonId=${params.lessonId}`)
            .then((response) => {
                if (response.status === ResponseCode.success) {
                    const data = response.data.data.data;
                    setTileDataSlashNinjaSeasonal(data);
                } else {
                    toast.error(response?.data?.message);
                }
                setLoadingSlashNinjaSeasonal(false);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
                setLoadingSlashNinjaSeasonal(false);
            });
    }, []);

    useEffect(() => {
        if (params.activityId) {
            APIService.getData(`${url}/${activityPaths.slashNinjaGame}/${params.activityId}?${activityPaths.isForSeasonal}`)
                .then((response) => {
                    if (response.status === ResponseCode.success) {
                        const { activityData, title, isSkippable, toggle } = response.data.data;
                        toggleSeasonalActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
                        formik.setFieldValue(FieldNames.title, title);
                        setProvideSkipSlashNinjaSeasonal(isSkippable);
                        setCheckedSlashNinjaSeasonal(activityData[0].isImage ? fileTypeEnum.image : fileTypeEnum.text);
                        formik.setFieldValue(FieldNames.isSkippable, isSkippable);
                        activityData?.forEach((tile: { activityDataId: string, traditionalImage: string }) => {
                            changeSelectionActivitySlashNinjaSeasonal(tile.activityDataId, FieldNames.traditional, tile.traditionalImage);
                        });
                    } else {
                        toast.error(response?.data?.message);
                    }
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message);
                });
        }
    }, []);

    const initialValues: SlashNinjaActivitySubmitData = {
        [FieldNames.topicId]: params.topicId as string,
        [FieldNames.lessonId]: params.lessonId as string,
        [FieldNames.activityTypeId]: activityUuid,
        [FieldNames.title]: '',
        [FieldNames.activityData]: [],
        [FieldNames.isImage]: false,
        [FieldNames.isSkippable]: false,
        isMoving: isMoving,
    };

    /**
     *
     * @returns Method used for get validation for add/edit activity
     */
    const getObjSlashNinjaSeasonal = () => {
        const objSlashNinjaSeasonal: ObjectShape = {
            [FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
        };
        return Yup.object<ObjectShape>(objSlashNinjaSeasonal);
    };
    const validationSchema = getObjSlashNinjaSeasonal();

    const activityDataObjSlashNinjaSeasonal: SlashNinjaMatchingActivityDataArr[] = [];
    if (checkedSlashNinjaSeasonal === fileTypeEnum.text) {
        dndList?.filter((item, index) => {
            tileDataSlashNinjaSeasonal?.filter((tile) => {
                if (tile?.activityDataId === item.id) {
                    activityDataObjSlashNinjaSeasonal.push({
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
            tileDataSlashNinjaSeasonal?.filter((tile) => {
                if (tile?.activityDataId === item.id) {
                    activityDataObjSlashNinjaSeasonal.push({
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
            const submitDataSlashNinjaSeasonal: SlashNinjaActivitySubmitData = {
                isMoving: isMoving,
                topicId: moveData(isMoving, topicId as string, values.topicId),
                lessonId: moveData(isMoving, lessonId as string, values.lessonId),
                activityTypeId: values.activityTypeId,
                title: values.title,
                activityData: activityDataObjSlashNinjaSeasonal,
                isSkippable: provideSkipSlashNinjaSeasonal,
                isForSeasonal: true,
            };
            if(activityDataObjSlashNinjaSeasonal.length < 3){
                toast.error(Errors.CARDS_GREATER_THAN_OR_EQUAL_TO)
                return
            }
            if (checkedSlashNinjaSeasonal === fileTypeEnum.image && activityDataObjSlashNinjaSeasonal.length > 10) {
				toast.error(`${Errors.CARDS_LESS_THAN_OR_EQUAL_TO} 10.`);
				return;
			}
			if (checkedSlashNinjaSeasonal === fileTypeEnum.text && activityDataObjSlashNinjaSeasonal.length > 6) {
				toast.error(`${Errors.CARDS_LESS_THAN_OR_EQUAL_TO} 6.`);
				return;
			}
            if (params.activityId) {
                setLoadingSlashNinjaSeasonal(true);
                APIService.putData(`${url}/${activityPaths.slashNinjaGame}/${params.activityId}`, submitDataSlashNinjaSeasonal)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingSlashNinjaSeasonal(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingSlashNinjaSeasonal(false);
                    });
            } else {
                setLoadingSlashNinjaSeasonal(true);
                APIService.postData(`${url}/${activityPaths.slashNinjaGame}`, submitDataSlashNinjaSeasonal)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingSlashNinjaSeasonal(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingSlashNinjaSeasonal(false);
                    });
            }
        },
    });

    /**
     *
     * @returns Method used to Perform Selection.
     */
    const changeSelectionActivitySlashNinjaSeasonal = (activityDataId: string, chinese: string, imageUrl: string) => {
        if (chinese === FieldNames.traditional) {
            if (!selectedItemsTraditionalSlashNinjaSeasonal.includes(activityDataId)) {
                setSelectedItemsTraditionalSlashNinjaSeasonal((prevItem) => [...prevItem, activityDataId]);
                setDndList(prevList => [...prevList, { id: activityDataId, image: imageUrl }]);
            } else {
                setDndList(dndList?.filter((item) => item.id !== activityDataId));
                setSelectedItemsTraditionalSlashNinjaSeasonal(selectedItemsTraditionalSlashNinjaSeasonal?.filter((item: string) => item !== activityDataId));
            }
        }
        if (chinese === FieldNames.simplified) {
            if (!selectedItemsSimplifiedSlashNinjaSeasonal.includes(activityDataId)) {
                setSelectedItemsSimplifiedSlashNinjaSeasonal((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsSimplifiedSlashNinjaSeasonal(selectedItemsSimplifiedSlashNinjaSeasonal?.filter((item: string) => item !== activityDataId));
            }
        }
    };

    return (
        <form className='w-full' onSubmit={formik.handleSubmit}>
            {loadingSlashNinjaSeasonal && <Loader />}
            <div className='mb-4'>
                <TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
            </div>
            <div className='mb-4'>
                <RadioButton
                    id='matchingType'
                    label={'Matching Type'}
                    name='isImage'
                    onChange={useCallback(
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckedSlashNinjaSeasonal(e.target.value);
                            formik.handleChange(e);
                        },
                        [checkedSlashNinjaSeasonal]
                    )}
                    checked={checkedSlashNinjaSeasonal}
                    radioOptions={radioOptionsMatchingSeasonal}
                    required
                />
            </div>
            <div className='flex gap-3 mb-4'>
                <div className='rounded border w-full'>
                    <h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
                    <div className='p-3'>
                        {tileDataSlashNinjaSeasonal?.length ? (
                            <ul className='grid grid-cols-3 md:grid-cols-8 gap-3 media-list'>
                                {tileDataSlashNinjaSeasonal?.map((tile) => {
                                    return !tile?.isFlashCardText && tile.traditionalGameImageUrl ? (
                                        <li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 cursor-pointer relative ${selectedItemsTraditionalSlashNinjaSeasonal?.includes(tile?.activityDataId) ? 'border-primary border-2 active' : ''}`}>
                                            <button type='button' className='w-full h-full cursor-pointer' onClick={() => changeSelectionActivitySlashNinjaSeasonal(tile.activityDataId, FieldNames.traditional, tile.traditionalGameImageUrl)}> <img src={tile.traditionalGameImageUrl} alt='Img preview' className='h-full w-full object-cover rounded' width='139' height='160' /></button>
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
							id: 'provideSkipSlashNinjaSeasonal',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipSlashNinjaSeasonal,
							onChange: () => {
								setProvideSkipSlashNinjaSeasonal((prev) => !prev);
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
        </form>
    );
};

export default SeasonalActivitySlashNinja;
