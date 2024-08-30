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
import { FILE_TYPE, MAX_AUDIO_FILE_SIZE, activityPaths, endPoint, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { AddEditSeasonalActivityData } from 'src/types/seasonalTopics';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar } from '@config/validations';
import { generateUuid, moveData, typeValidationAudio } from '@utils/helpers';
import { RunningGameActivitySubmitData, RunningGameMatchingActivityDataArr, RunningTileData, RunningTileDataArr } from 'src/types/activities/runningGameActivity';
import { fileTypesQA } from '@views/activities/ActivityReadingComprehensive';
import { Uploader } from '@views/activities/utils/upload';
import FileUpload from '@components/fileUpload/FileUpload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import CheckBox from '@components/checkbox/CheckBox';

const SeasonalRunningGameActivity = ({ onSubmit, onClose, url, activityUuid, toggleSeasonalActivity, isMoving, topicId, lessonId }: AddEditSeasonalActivityData) => {
    const params = useParams();
    const [loadingRunningGameSeasonal, setLoadingRunningGameSeasonal] = useState<boolean>(false);
    const [provideSkipRunningGameSeasonal, setProvideSkipRunningGameSeasonal] = useState<boolean>(false);
    const [checkedRunningGameSeasonal, setCheckedRunningGameSeasonal] = useState<string>(fileTypeEnum.image);
    const [tileDataRunningGameSeasonal, setTileDataRunningGameSeasonal] = useState<RunningTileDataArr>();
    const [selectedItemsTraditionalRunningGameSeasonal, setSelectedItemsTraditionalRunningGameSeasonal] = useState<Array<string>>([]);
    const [selectedItemsSimplifiedRunningGameSeasonal, setSelectedItemsSimplifiedRunningGameSeasonal] = useState<Array<string>>([]);
    const [correctAudioSeasonal, setCorrectAudioSeasonal] = useState<string>('');
	const [correctAudioPercentageSeasonal, setCorrectAudioPercentageSeasonal] = useState<number>(0);
    const radioOptionsRunningGameSeasonal = [
        { name: 'Image To Image', key: fileTypeEnum.image, disabled: !!params.activityId },
        { name: 'Image To Text', key: fileTypeEnum.text, disabled: !!params.activityId },
    ];

    /**
     * @returns Method used to show the percentage for file.
     */
    const updatePercentage = (newPercentage: number) => {
		setCorrectAudioPercentageSeasonal(newPercentage);
	};

    /**
     * @returns Method used to show the valid percentage.
     */
	const isPercentageValid = (percentage: number) => percentage === 0 || percentage === 100;

    /**
     *@returns Method used for setValue from activity data and get the details of activity by uuid
     */
    useEffect(() => {
        setLoadingRunningGameSeasonal(true);
        APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?topicId=${params.topicId}&lessonId=${params.lessonId}`)
            .then((response) => {
                if (response.status === ResponseCode.success) {
                    const data = response.data.data.data;
                    setTileDataRunningGameSeasonal(data);
                } else {
                    toast.error(response?.data?.message);
                }
                setLoadingRunningGameSeasonal(false);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
                setLoadingRunningGameSeasonal(false);
            });
    }, []);

    /**
     *@returns Method used for setValue from activity data and get the details of activity by uuid
     */
    useEffect(() => {
        if (params?.activityId) {
            setLoadingRunningGameSeasonal(true)
            APIService.getData(`${url}/${activityPaths.runningGame}/${params.activityId}?${activityPaths.isForSeasonal}`)
                .then((response) => {
                    if (response.status === ResponseCode.success) {
                        const { activityData, title, isSkippable, toggle, incorrectAudio } = response.data.data;
                        toggleSeasonalActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
                        formik.setFieldValue(FieldNames.title, title);
                        setProvideSkipRunningGameSeasonal(isSkippable);
                        setCheckedRunningGameSeasonal(activityData[0].isImage ? fileTypeEnum.image : fileTypeEnum.text);
                        formik.setFieldValue(FieldNames.isSkippable, isSkippable);
                        activityData?.forEach((tile: RunningTileData) => {
                            changeSelectionActivityRunningGameSeasonal(tile.activityDataId, FieldNames.traditional);
                            if (tile.isMarked) {
                                formik.setFieldValue('markedId', tile.activityDataId);
                            }
                        });
                        setCorrectAudioSeasonal(incorrectAudio)
                    }
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message);
                })
                .finally(()=> setLoadingRunningGameSeasonal(false));
        }
    }, []);

    const initialValues: RunningGameActivitySubmitData = {
        [FieldNames.topicId]: params.topicId as string,
        [FieldNames.lessonId]: params.lessonId as string,
        [FieldNames.activityTypeId]: activityUuid,
        [FieldNames.title]: '',
        [FieldNames.activityData]: [],
        [FieldNames.isImage]: false,
        [FieldNames.isSkippable]: false,
        isMoving: isMoving,
        [FieldNames.incorrectAudio]: null
    };

    /**
     * @returns Method used for file upload
     */
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
		const fileRGSeasonal = event.target.files?.[0] as File;
		typeValidationAudio(fileRGSeasonal, fileTypesQA, Errors.PLEASE_ALLOW_MP3_WAV_FILE);
		const lastIndex = fileRGSeasonal?.name?.lastIndexOf('.');
		const extension = fileRGSeasonal?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileRGSeasonal);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
            if (audio.duration > MAX_AUDIO_FILE_SIZE) {
                toast.error(Errors.AUDIO_FILE_DURATION_MUST_LESSTHAN_OR_EQUAL_TO_4_SECONDS);
                return false;
            }
			const audioUploaderOptions = {
				fileName: name,
				file: fileRGSeasonal,
				isForSeasonal: true,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentage);
			uploader.start();
				formik.setFieldValue(FieldNames.incorrectAudio, uploader.fileName);
				uploader.onComplete((response: string) => {
					setLoadingRunningGameSeasonal(false);
					setCorrectAudioSeasonal(response);
				});
		});
	};

    /**
     * @returns Method used to set the file value onchange.
     */
	const onChangeAudioHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const fileNameQA = e.target.name;
		handleFileUpload(e, fileNameQA);
	}, []);

    /**
     *
     * @returns Method used for get validation for add/edit activity
     */
    const getObjRunningGameSeasonal = () => {
        const objRunningGameSeasonal: ObjectShape = {
            [FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
            [FieldNames.incorrectAudio]: correctAudioSeasonal ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED)
        };
        return Yup.object<ObjectShape>(objRunningGameSeasonal);
    };
    const validationSchema = getObjRunningGameSeasonal();

    const activityDataObjRunningGameSeasonal: RunningGameMatchingActivityDataArr[] = [];

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const submitDataRunningGameSeasonal: RunningGameActivitySubmitData = {
                isMoving: isMoving,
                topicId: moveData(isMoving, topicId as string, values.topicId),
                lessonId: moveData(isMoving, lessonId as string, values.lessonId),
                activityTypeId: values.activityTypeId,
                title: values.title,
                activityData: activityDataObjRunningGameSeasonal,
                isSkippable: provideSkipRunningGameSeasonal,
                isForSeasonal: true,
				incorrectAudio: correctAudioSeasonal.split('/').pop() as string,
            };
            if (params.activityId) {
                setLoadingRunningGameSeasonal(true);
                APIService.putData(`${url}/${activityPaths.runningGame}/${params.activityId}`, submitDataRunningGameSeasonal)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingRunningGameSeasonal(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingRunningGameSeasonal(false);
                    });
            } else {
                setLoadingRunningGameSeasonal(true);
                APIService.postData(`${url}/${activityPaths.runningGame}`, submitDataRunningGameSeasonal)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingRunningGameSeasonal(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingRunningGameSeasonal(false);
                    });
            }
        },
    });

    if (checkedRunningGameSeasonal === fileTypeEnum.text) {
        tileDataRunningGameSeasonal?.filter((tile) => {
            selectedItemsTraditionalRunningGameSeasonal?.filter((item) => {
                if (tile?.activityDataId === item) {
                    activityDataObjRunningGameSeasonal.push({
                        activityDataId: tile.activityDataId,
                        simplifiedImage: tile.simplifiedGameImageUrl,
                        simplifiedAudio: tile.simplifiedGameAudioUrl,
                        simplifiedText: tile.simplifiedTitleChinese,
                        traditionalImage: tile.traditionalGameImageUrl,
                        traditionalAudio: tile.traditionalGameAudioUrl,
                        traditionalText: tile.traditionalTitleChinese,
                        isImage: false,
                    });
                }
            });
        });
    } else {
        tileDataRunningGameSeasonal?.filter((tile) => {
            selectedItemsTraditionalRunningGameSeasonal?.filter((item) => {
                if (tile?.activityDataId === item) {
                    activityDataObjRunningGameSeasonal.push({
                        activityDataId: tile.activityDataId,
                        simplifiedImage: tile.simplifiedGameImageUrl,
                        simplifiedAudio: tile.simplifiedGameAudioUrl,
                        traditionalImage: tile.traditionalGameImageUrl,
                        traditionalAudio: tile.traditionalGameAudioUrl,
                        isImage: true,
                    });
                }
            });
        });
    }

    /**
     *
     * @returns Method used to Perform Selection.
     */
    const changeSelectionActivityRunningGameSeasonal = (activityDataId: string, chinese: string) => {
        if (chinese === FieldNames.traditional) {
            if (!selectedItemsTraditionalRunningGameSeasonal.includes(activityDataId)) {
                setSelectedItemsTraditionalRunningGameSeasonal((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsTraditionalRunningGameSeasonal(selectedItemsTraditionalRunningGameSeasonal?.filter((item: string) => item !== activityDataId));
            }
        }
        if (chinese === FieldNames.simplified) {
            if (!selectedItemsSimplifiedRunningGameSeasonal.includes(activityDataId)) {
                setSelectedItemsSimplifiedRunningGameSeasonal((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsSimplifiedRunningGameSeasonal(selectedItemsSimplifiedRunningGameSeasonal?.filter((item: string) => item !== activityDataId));
            }
        }
    };

    return (
        <form className='w-full' onSubmit={formik.handleSubmit}>
            {loadingRunningGameSeasonal && <Loader />}
            <div className='mb-4'>
                <TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
            </div>
            <div className='mb-4'>
				<FileUpload labelName='Incorrect Audio' id={FieldNames.incorrectAudio} imageSource={correctAudioSeasonal} name={FieldNames.incorrectAudio} error={formik.errors.incorrectAudio && formik.touched.incorrectAudio ? formik.errors.incorrectAudio : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
				{!isPercentageValid(correctAudioPercentageSeasonal) && <LoadingPercentage percentage={correctAudioPercentageSeasonal} />}
			</div>
            <div className='mb-4'>
                <RadioButton
                    id='matchingType'
                    label={'Matching Type'}
                    name='isImage'
                    onChange={useCallback(
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckedRunningGameSeasonal(e.target.value);
                            formik.handleChange(e);
                        },
                        [checkedRunningGameSeasonal]
                    )}
                    checked={checkedRunningGameSeasonal}
                    radioOptions={radioOptionsRunningGameSeasonal}
                    required
                />
            </div>
            <div className='flex gap-3 mb-4'>
                <div className='rounded border w-full'>
                    <h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
                    <div className='p-3'>
                        {tileDataRunningGameSeasonal?.length ? (
                            <ul className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 media-list'>
                                {tileDataRunningGameSeasonal?.map((tile: RunningTileData) => {
                                    return !tile?.isFlashCardText && tile.traditionalGameImageUrl ? (
                                        <li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 mb-4 relative ${selectedItemsTraditionalRunningGameSeasonal?.includes(tile?.activityDataId) ? 'border-primary border-2 active' : ''}`} >
                                            <button type='button' className='w-full h-full cursor-pointer' onClick={() => changeSelectionActivityRunningGameSeasonal(tile.activityDataId, FieldNames.traditional)}> <img src={tile.traditionalGameImageUrl} alt='Img preview' className='w-full h-full object-cover rounded ' width='139' height='160' /></button>
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
            <div className='flex justify-end gap-2 items-center'>
                <CheckBox
					option={[
						{
							id: 'provideSkipRunningGameSeasonal',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipRunningGameSeasonal,
							onChange: () => {
								setProvideSkipRunningGameSeasonal((prev) => !prev);
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

export default SeasonalRunningGameActivity;
