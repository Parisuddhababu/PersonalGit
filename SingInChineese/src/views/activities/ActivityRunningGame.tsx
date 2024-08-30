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
import { FILE_TYPE, MAX_AUDIO_FILE_SIZE, activityPaths, endPoint, fileTypeEnum } from '@config/constant';
import { Errors } from '@config/errors';
import TextInput from '@components/textInput/TextInput';
import RadioButton from '@components/radiobutton/RadioButton';
import { RunningGameActivitySubmitData, RunningGameMatchingActivityDataArr, RunningTileData, RunningTileDataArr } from 'src/types/activities/runningGameActivity';
import { mixedNotRequired, mixedRequired, stringNoSpecialChar } from '@config/validations';
import { generateUuid, moveData, typeValidationAudio } from '@utils/helpers';
import FileUpload from '@components/fileUpload/FileUpload';
import { fileTypesQA } from './ActivityReadingComprehensive';
import { Uploader } from './utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import CheckBox from '@components/checkbox/CheckBox';

const ActivityRunningGame = ({ onSubmit, onClose, url, activityUuid, toggleActivity, isMoving, levelId, topicId, lessonId }: AddEditActivitiesData) => {
    const params = useParams();
    const [loadingRunningGame, setLoadingRunningGame] = useState<boolean>(false);
    const [provideSkipRunningGame, setProvideSkipRunningGame] = useState<boolean>(false);
    const [checkedRunningGame, setCheckedRunningGame] = useState<string>(fileTypeEnum.image);
    const [tileDataRunningGame, setTileDataRunningGame] = useState<RunningTileDataArr>();
    const [selectedItemsTraditionalRunningGame, setSelectedItemsTraditionalRunningGame] = useState<Array<string>>([]);
    const [selectedItemsSimplifiedRunningGame, setSelectedItemsSimplifiedRunningGame] = useState<Array<string>>([]);
	const [correctAudio, setCorrectAudio] = useState<string>('');
	const [correctAudioPercentage, setCorrectAudioPercentage] = useState<number>(0);
    const radioOptionsRunningGame = [
        { name: 'Image To Image', key: fileTypeEnum.image, disabled: !!params.activityId },
        { name: 'Image To Text', key: fileTypeEnum.text, disabled: !!params.activityId },
    ];

    /**
     * @returns Method used to show the percentage for file.
     */
    const updatePercentage = (newPercentage: number) => {
		setCorrectAudioPercentage(newPercentage);
	};

    /**
     * @returns Method used to show the valid percentage.
     */
	const isPercentageValid = (percentage: number) => percentage === 0 || percentage === 100;

    /**
     *@returns Method used for setValue from activity data and get the details of activity by uuid
     */
    useEffect(() => {
        setLoadingRunningGame(true);
        APIService.getData(`${url}/${endPoint.flashcard}/${endPoint.list}?levelId=${params.levelId}&topicId=${params.topicId}&lessonId=${params.lessonId}`)
            .then((response) => {
                if (response.status === ResponseCode.success) {
                    const data = response.data.data.data.allActivityArr;
                    setTileDataRunningGame(data);
                }
                setLoadingRunningGame(false);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message);
                setLoadingRunningGame(false);
            });
    }, []);

    /**
     *@returns Method used for setValue from activity data and get the details of activity by uuid.
     */
    useEffect(() => {
        if (params?.activityId) {
            setLoadingRunningGame(true)
            APIService.getData(`${url}/${activityPaths.runningGame}/${params.activityId}`)
                .then((response) => {
                    if (response.status === ResponseCode.success) {
                        const { activityData, title, isSkippable, toggle, incorrectAudio } = response.data.data;
                        toggleActivity(toggle.previousActivityUUID, toggle.previousActivityTypeUUID, toggle.nextActivityUUID, toggle.nextActivityTypeUUID);
                        formik.setFieldValue(FieldNames.title, title);
                        setProvideSkipRunningGame(isSkippable);
                        setCheckedRunningGame(activityData[0].isImage ? fileTypeEnum.image : fileTypeEnum.text);
                        formik.setFieldValue(FieldNames.isSkippable, isSkippable);
                        activityData?.forEach((tile: RunningTileData) => {
                            changeSelectionActivityRunningGame(tile.activityDataId, FieldNames.traditional);
                        });
                        setCorrectAudio(incorrectAudio)
                    }
                })
                .catch((err) => {
                    toast.error(err?.response?.data?.message);
                })
                .finally(() => setLoadingRunningGame(false));
        }
    }, []);

    const initialValues: RunningGameActivitySubmitData = {
        [FieldNames.levelId]: params.levelId as string,
        [FieldNames.topicId]: params.topicId as string,
        [FieldNames.lessonId]: params.lessonId as string,
        [FieldNames.activityTypeId]: activityUuid,
        [FieldNames.title]: '',
        [FieldNames.activityData]: [],
        [FieldNames.isSkippable]: false,
        [FieldNames.isImage]: false,
        isMoving: isMoving,
        [FieldNames.incorrectAudio]: null
    };

    /**
     * @returns Method used for file upload
     */
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileName: string) => {
		const fileRG = event.target.files?.[0] as File;
		typeValidationAudio(fileRG, fileTypesQA, Errors.PLEASE_ALLOW_MP3_WAV_FILE);
		const lastIndex = fileRG?.name?.lastIndexOf('.');
		const extension = fileRG?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		const audio = document.createElement('audio');
		audio.preload = 'metadata';
		const blob = URL.createObjectURL(fileRG);
		audio.src = blob;
		audio.addEventListener('loadedmetadata', () => {
            if (audio.duration > MAX_AUDIO_FILE_SIZE) {
                toast.error(Errors.AUDIO_FILE_DURATION_MUST_LESSTHAN_OR_EQUAL_TO_4_SECONDS);
                return false;
            }
			const audioUploaderOptions = {
				fileName: name,
				file: fileRG,
				isForSeasonal: false,
				isForSop: false,
				fieldName: fileName,
			};
			const uploader = new Uploader(audioUploaderOptions, updatePercentage);
			uploader.start();
				formik.setFieldValue(FieldNames.incorrectAudio, uploader.fileName);
				uploader.onComplete((response: string) => {
					setLoadingRunningGame(false);
					setCorrectAudio(response);
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
    const getObjMatching = () => {
        const objMatching: ObjectShape = {
            [FieldNames.title]: stringNoSpecialChar(Errors.PLEASE_ENTER_TITLE),
            [FieldNames.incorrectAudio]: correctAudio ? mixedNotRequired() : mixedRequired(Errors.AUDIO_IS_REQUIRED)
        };
        return Yup.object<ObjectShape>(objMatching);
    };
    const validationSchema = getObjMatching();

    const activityDataObjMatching: RunningGameMatchingActivityDataArr[] = [];


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const submitDataMatching: RunningGameActivitySubmitData = {
                isMoving: isMoving,
                levelId: moveData(isMoving, levelId as string, values.levelId as string),
                topicId: moveData(isMoving, topicId as string, values.topicId),
                lessonId: moveData(isMoving, lessonId as string, values.lessonId),
                activityTypeId: values.activityTypeId,
                title: values.title,
                activityData: activityDataObjMatching,
                isSkippable: provideSkipRunningGame,
				incorrectAudio: correctAudio.split('/').pop() as string,
            };
            if (params.activityId) {
                setLoadingRunningGame(true);
                APIService.putData(`${url}/${activityPaths.runningGame}/${params.activityId}`, submitDataMatching)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingRunningGame(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingRunningGame(false);
                    });
            } else {
                setLoadingRunningGame(true);
                APIService.postData(`${url}/${activityPaths.runningGame}`, submitDataMatching)
                    .then((response) => {
                        if (response.status === ResponseCode.success) {
                            toast.success(response?.data?.message);
                            formik.resetForm();
                            onClose();
                            onSubmit();
                        }
                        setLoadingRunningGame(false);
                    })
                    .catch((err) => {
                        toast.error(err?.response?.data?.message);
                        setLoadingRunningGame(false);
                    });
            }
        },
    });

    if (checkedRunningGame === fileTypeEnum.text) {
        tileDataRunningGame?.filter((tile) => {
            selectedItemsTraditionalRunningGame?.filter((item) => {
                if (tile?.activityDataId === item) {
                    activityDataObjMatching.push({
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
        tileDataRunningGame?.filter((tile) => {
            selectedItemsTraditionalRunningGame?.filter((item) => {
                if (tile?.activityDataId === item) {
                    activityDataObjMatching.push({
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
    const changeSelectionActivityRunningGame = (activityDataId: string, chinese: string) => {
        if (chinese === FieldNames.traditional) {
            if (!selectedItemsTraditionalRunningGame.includes(activityDataId)) {
                setSelectedItemsTraditionalRunningGame((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsTraditionalRunningGame(selectedItemsTraditionalRunningGame?.filter((item: string) => item !== activityDataId));
            }
        }
        if (chinese === FieldNames.simplified) {
            if (!selectedItemsSimplifiedRunningGame.includes(activityDataId)) {
                setSelectedItemsSimplifiedRunningGame((prevItem) => [...prevItem, activityDataId]);
            } else {
                setSelectedItemsSimplifiedRunningGame(selectedItemsSimplifiedRunningGame?.filter((item: string) => item !== activityDataId));
            }

        }
    };
    
    return (
        <form className='w-full' onSubmit={formik.handleSubmit}>
            {loadingRunningGame && <Loader />}
            <div className='mb-4'>
                <TextInput placeholder='Title' name={FieldNames.title} onChange={formik.handleChange} label='Title (English)' value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
            </div>
            <div className='mb-4'>
				<FileUpload labelName='Incorrect Audio' id={FieldNames.incorrectAudio} imageSource={correctAudio} name={FieldNames.incorrectAudio} error={formik.errors.incorrectAudio && formik.touched.incorrectAudio ? formik.errors.incorrectAudio : ''} acceptNote='mp3, wav files only' accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} onChange={onChangeAudioHandler} uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} />
				{!isPercentageValid(correctAudioPercentage) && <LoadingPercentage percentage={correctAudioPercentage} />}
			</div>
            <div className='mb-4'>
                <RadioButton
                    id='matchingType'
                    label={'Matching Type'}
                    name='isImage'
                    onChange={useCallback(
                        (e: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckedRunningGame(e.target.value);
                            formik.handleChange(e);
                        },
                        [checkedRunningGame]
                    )}
                    checked={checkedRunningGame}
                    radioOptions={radioOptionsRunningGame}
                    required
                />
            </div>
            <div className='flex gap-3 mb-4'>
                <div className='rounded border w-full'>
                    <h6 className='font-medium bg-gray-100 p-3 rounded-t'>Flashcard List</h6>
                    <div className='p-3'>
                        {tileDataRunningGame?.length ? (
                            <ul className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 media-list'>
                                {tileDataRunningGame?.map((tile: RunningTileData) => {
                                    return !tile?.isFlashCardText && tile.traditionalGameImageUrl ? (
                                        <li id={tile.activityDataId} key={tile.activityDataId} className={`border rounded p-1 h-40 mb-4 relative ${selectedItemsTraditionalRunningGame.includes(tile.activityDataId) ? 'border-primary border-2 active' : ''}`} >
                                            <button type='button' className='w-full h-full cursor-pointer' onClick={() => changeSelectionActivityRunningGame(tile.activityDataId, FieldNames.traditional)}> <img src={tile.traditionalGameImageUrl} alt='Img preview' className='h-full w-full object-cover rounded' width='139' height='160' /></button>
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
							id: 'provideSkipRunningGame',
							name: 'Provide skip button for this activity',
							value: 'Provide skip button for this activity',
							checked: provideSkipRunningGame,
							onChange: () => {
								setProvideSkipRunningGame((prev) => !prev);
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

export default ActivityRunningGame;
