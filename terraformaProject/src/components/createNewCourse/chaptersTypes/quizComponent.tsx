import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { Edit, Trash } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { DELETE_WARNING_TEXT, QUESTION_TYPE } from '@config/constant';
import useValidation from '@framework/hooks/validations';
import { FormikErrors, useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Options, Questiontype, QuizProps } from 'src/types/common';


const QuizCompoent = ({ onAddChapter, editData, disabled }: QuizProps) => {
    const { t } = useTranslation();
    const [isQuizDeleted, setIsQuizDeleted] = useState<boolean>(false);
    const { QuizValidationSchema } = useValidation();
    useEffect(() => {
        if (editData !== null) {
            formik.setValues({
                delete_question_ids: editData?.quiz?.delete_question_ids as string[],
                chapterName: editData?.title,
                questions: editData?.quiz?.questions as Questiontype[],
                selectedQuestions: {
                    uuid: '',
                    type: null,
                    order: null,
                    question: '',
                    delete_options_ids: [],
                    options: [
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 1
                        },
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 2
                        },

                    ]
                },
                deleteIndex: null,
                editIndex: null,
                correctAnswer: []
            })
        }
    }, [editData])

    const initialValues: {
        selectedQuestions: Questiontype;
        questions: Questiontype[];
        deleteIndex: null | number;
        chapterName: string;
        editIndex: string | null;
        delete_question_ids: string[];
        correctAnswer: number[];
    } = {
        chapterName: '',
        selectedQuestions: {
            uuid: '',
            type: null,
            order: null,
            question: '',
            delete_options_ids: [],
            options: [
                {
                    uuid: '',
                    option: '',
                    is_correct: false,
                    order: 1
                },
                {
                    uuid: '',
                    option: '',
                    is_correct: false,
                    order: 2
                },

            ]
        },
        delete_question_ids: [],
        questions: [],
        deleteIndex: null,
        editIndex: null,
        correctAnswer: []
    }
    const formik = useFormik({
        initialValues,
        validationSchema: QuizValidationSchema,
        onSubmit(values) {
            if (values?.editIndex !== null) {
                formik.setFieldValue(`questions.[${values?.editIndex}]`, { ...values?.selectedQuestions, type: values?.correctAnswer?.length > 1 ? QUESTION_TYPE?.MULTIPLE : QUESTION_TYPE?.SINGLE, }, false);
                formik.setFieldValue('editIndex', null, false);
                formik.setFieldValue('correctAnswer', [], false)
                formik.setFieldValue('selectedQuestions', {
                    uuid: '',
                    type: null,
                    order: null,
                    question: '',
                    delete_options_ids: [],
                    options: [
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 1
                        },
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 2
                        },

                    ]

                }, false);
            } else {
                const newQuestion = {
                    ...values?.selectedQuestions, order: values.questions.length + 1, type: values?.correctAnswer?.length > 1 ? QUESTION_TYPE?.MULTIPLE : QUESTION_TYPE?.SINGLE 
                }
                formik.setFieldValue('questions', [...values?.questions,newQuestion], false);
                formik.setFieldValue('correctAnswer', [], false)
                formik.setFieldValue('selectedQuestions', {
                    uuid: '',
                    type: null,
                    order: null,
                    question: '',
                    delete_options_ids: [],
                    options: [
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 1
                        },
                        {
                            uuid: '',
                            option: '',
                            is_correct: false,
                            order: 2
                        },

                    ]

                }, false);
            }
        }
    })

    const onBlurQuiz = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        formik.setFieldValue(target.name, target.value)
    }, [])

    const onAddOption = () => {
        if (formik?.values?.selectedQuestions?.options.length <= 4) {
            formik.setFieldValue('selectedQuestions.options', [...formik?.values?.selectedQuestions?.options,
            {
                uuid: '',
                option: '',
                is_correct: false,
                order: formik?.values?.selectedQuestions?.options.length + 1
            }
            ])
        }
    }
    const editQuestion = useCallback((editIndex: number) => {
        formik.setFieldValue('editIndex', editIndex)
        formik.setFieldValue('selectedQuestions', formik?.values?.questions?.[editIndex]);
        formik.setFieldValue('correctAnswer', [...formik?.values?.questions?.[editIndex]?.options?.filter((data: Options) => data?.is_correct)]);
    }, [formik])

    const isDeleted = useCallback((index: number) => {
        setIsQuizDeleted(true)
        formik.setFieldValue('deleteIndex', index);
    }, [])

    const onClose = useCallback(() => {
        setIsQuizDeleted(false)
        formik.setFieldValue('deleteIndex', null);
    }, [])

    const deleteData = useCallback(() => {
        const newArray = formik?.values?.questions.filter((_, index: number) => index !== formik?.values?.deleteIndex);
        const reqArray = newArray.map((data, index: number) => {
            return {
                ...data,
                order: index + 1
            }
        })
        if (formik?.values?.deleteIndex&&formik?.values?.questions?.[formik?.values?.deleteIndex]?.uuid) {
            formik.setFieldValue('delete_question_ids', [...formik?.values.delete_question_ids,formik?.values?.questions?.[formik?.values?.deleteIndex]?.uuid])
        }
        formik.setFieldValue('questions', reqArray);
        formik.setFieldValue('deleteIndex', null);
        setIsQuizDeleted(false)
    }, [formik])

    const onAddQuizChapter = useCallback(() => {
        if (formik?.values?.questions.length) {
            onAddChapter({
                questions: formik.values.questions,
                delete_question_ids: formik?.values?.delete_question_ids,
                chapterName: formik?.values?.chapterName,
            })
            formik.resetForm({ values: initialValues });
        }
    }, [formik]);

    const onSelectCorrectAnswer = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (formik?.values?.correctAnswer.includes(index)) {
            formik.setFieldValue('correctAnswer', [...formik?.values?.correctAnswer.filter((data: number) => data !== index)]);
        } else {
            formik.setFieldValue('correctAnswer', [...formik?.values?.correctAnswer, index]);
            formik.setFieldError('correctAnswer', '')
        }
        formik.setFieldValue(`selectedQuestions.options.[${index}].is_correct`, e.target.checked);
    }, [formik])
    const onDeleteOption =useCallback((index:number)=>{
        if(formik?.values?.selectedQuestions?.options.length > 2){
            const reqOption = formik?.values?.selectedQuestions?.options?.filter((data)=>data?.order !==index+1)
            formik.setFieldValue('selectedQuestions.options',reqOption);
            if(formik.values.selectedQuestions?.options?.[index]?.uuid!==''){
                formik.setFieldValue('selectedQuestions.delete_options_ids',[...formik.values.selectedQuestions.delete_options_ids,formik.values.selectedQuestions?.options?.[index]?.uuid])
            }
        }
    },[formik])
    return <>
        <div className='overflow-hidden border border-solid border-border-primary rounded-xl mb-5'>
            <div className='px-5 border-b border-solid last:border-none py-7 border-border-primary'>
                <form className='p-5 border border-solid bg-accents-2 border-border-primary rounded-xl' onSubmit={formik.handleSubmit}>
                    <div >
                        <div className='w-full mb-5'>
                            <TextInput placeholder={t('Enter Chapter Name')} type='text' id='chapterName' name='chapterName' label={t('Chapter Name')} value={formik.values.chapterName} onChange={formik.handleChange} required={true}
                                error={formik?.errors?.chapterName && formik?.touched?.chapterName ? formik?.errors?.chapterName : ''}
                                onBlur={onBlurQuiz} disabled={disabled} />
                        </div>
                        <div className='flex justify-between items-center flex-wrap gap-2.5 mb-5'>
                            <h6>{formik.values.editIndex !== null ? t('Edit Question') : t('Add Question')}</h6>
                            <p className='before:content-[""] before:min-w-[8px] before:h-2 before:md:min-w-[12px] before:md:h-3 before:bg-success flex items-center gap-2.5 before:inline-block before:rounded-full'>Correct Answer</p>
                        </div>
                        <div className='w-full mb-5'>
                            <TextInput placeholder={t('Enter Question')} type='text' id='enterQuestion' name='selectedQuestions.question' label={t('Question')} value={formik.values.selectedQuestions.question} onChange={formik.handleChange} required={true}
                                error={formik?.errors?.selectedQuestions?.question && formik?.touched?.selectedQuestions?.question ? formik?.errors?.selectedQuestions?.question : ''}
                                onBlur={onBlurQuiz} disabled={disabled} />
                        </div>
                        {formik?.values?.selectedQuestions?.options?.map((_, index: number) => {
                            const displayKeyQuiz = index;
                            return <div key={displayKeyQuiz} className='flex flex-col mb-3 md:mb-5'>
                                <div className='flex items-center gap-2.5 mb-2'>

                                    <div className='w-[calc(100%-36px)] md:w-[calc(50%-10px)] xl:w-[calc(33.3%-12px)]'>
                                        <TextInput
                                            id='optionAnswer1'
                                            name={`selectedQuestions.options.[${index}].option`}
                                            placeholder={t('Enter')}
                                            type="text"
                                            label={t(`Option ${index + 1}`)}
                                            value={formik?.values?.selectedQuestions?.options?.[index]?.option}
                                            onChange={formik.handleChange}
                                            required={true}
                                            disabled={disabled}
                                        />
                                    </div>
                                    <div className='flex items-center mt-7'>
                                        <input
                                            className='w-3 h-3 bg-white border border-solid rounded-full appearance-none border-secondary cursor-pointer disabled:cursor-none'
                                            type="checkbox"
                                            name={`selectedQuestions.options.[${index}].is_correct`}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectCorrectAnswer(e, index)}
                                            checked={formik?.values?.selectedQuestions?.options?.[index]?.is_correct}
                                            disabled={disabled}
                                        />
                                    </div>
                                    <div className='flex items-center mt-7'>
                                            <Button className='w-3.5 h-3.5 md:w-[18px] md:h-[18px] cursor-pointer disabled:cursor-not-allowed' label='' onClick={()=>onDeleteOption(index)} disabled={disabled||formik?.values?.selectedQuestions?.options.length<=2} >
                                             <Trash className='text-base md:text-lg fill-error' />
                                        </Button>
                                    </div>
                                </div>
                                {((formik?.errors.selectedQuestions?.options?.[index] as FormikErrors<Options>)?.option) && formik?.touched?.selectedQuestions?.options?.[index]?.option && <p className='error md:text-xs-15 inline-block'>{t((formik?.errors.selectedQuestions?.options?.[index] as FormikErrors<Options>)?.option as string)}</p>}
                            </div>

                        })}
                        {formik?.values?.selectedQuestions?.options.length < 4 && <button type='button' className='text-primary font-semibold whitespace-nowrap md:ml-4 mb-3 md:mb-3.5' onClick={onAddOption} disabled={disabled} >+ <span className='underline whitespace-nowrap'>Add Option</span></button>}
                        {(formik?.errors.correctAnswer) && !formik?.values?.correctAnswer?.length && <p className='error md:text-xs-15 '>{t(formik?.errors.correctAnswer)}</p>}

                    </div>
                    <button className='btn btn-primary btn-normal w-full md:w-[160px]' type='submit' title={`${editData !== null ? 'update Chapter' : 'Add New Chapter'}`} disabled={disabled} >
                        {t(`${formik.values.editIndex !== null ? 'Edit Question' : 'Add Question'}`)}
                    </button>
                </form>

            </div>
            {formik?.values?.questions?.map((data: Questiontype, index: number) => (
                <div className='px-3 py-3 border-b border-solid md:px-5 md:py-4 border-border-primary last:border-none' key={`questionAnswerList-${index + 1}`}>
                    <div className='pb-4 border-b border-solid first:pt-3 pt-7 border-border-primary last:border-none last:pb-0'>
                        <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
                            <p className='font-bold leading-6'>{`Question ${index + 1}: ${data?.question}`}</p>
                            <div className='flex items-center gap-3 md:gap-5'>
                                <Button className='bg-transparent cursor-pointer btn-default' disabled={disabled} onClick={() => editQuestion(index)} label={''} title='Edit'>
                                    <Edit className='cursor-pointer fill-primary' />
                                </Button>
                                <Button className='bg-transparent cursor-pointer btn-default' disabled={disabled} onClick={() => isDeleted(index)} label={''} title='Delete' >
                                    <Trash className='fill-error' />
                                </Button>
                            </div>
                        </div>
                        <div>
                            {data?.options?.map((optionsData: Options) => {
                                return <label className='block mb-3 last:mb-0' key={`option-1-${index + 1}`}>
                                    <span className={`w-3 h-3 rounded-full ${optionsData?.is_correct ? 'bg-p-list-box-btn' : 'border border-solid border-secondary'} inline-block`}></span>
                                    <span className='ml-2 text-sm font-normal md:text-base'>{optionsData?.option}</span>
                                </label>
                            })}

                        </div>
                    </div>
                    {isQuizDeleted && (
                        <CommonModel
                            warningText={DELETE_WARNING_TEXT}
                            onClose={onClose}
                            action={deleteData}
                            show={isQuizDeleted}
                        />
                    )}
                </div>
            ))}
              <button className='btn btn-primary btn-normal w-full md:w-[160px] my-2 mx-3' type='submit' title={`${editData !== null ? 'update Chapter' : 'Add Chapter'}`} disabled={disabled|| !formik?.values?.questions} onClick={onAddQuizChapter} >
                {t(`${editData !== null ? 'update Chapter' : 'Add Chapter'}`)}
            </button>
        </div>
    </>
}

export default QuizCompoent