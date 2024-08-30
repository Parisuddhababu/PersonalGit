'use client'
import { ApolloError, useMutation, } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { DATE_TIME_FORMAT } from '@/constant/common'
import { GoLiveScheduleStep3Form, GoLiveScheduleStep1Form, IInfluencers, IStep, ISteps, ScheduleForm, StepsTrack } from '@/types/pages';
import "@/styles/pages/go-live.scss";
import Step1 from "./steps-componenets/step-1";
import Step4 from "./steps-componenets/step-4";
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/staticUrl.config';
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingState } from '@/framework/redux/reducers/commonSlice'
import { SCHEDULE_STREAMING } from '@/framework/graphql/mutations/schedule'
import { CommonSliceTypes } from '@/framework/redux/redux'
import { HostingType } from '@/types/components'
import moment from 'moment'
import { handleGraphQLErrors } from '@/utils/helpers';
import Link from 'next/link'
import { Message } from '@/constant/errorMessage'
import { ScheduleStreamingResponse } from '@/types/graphql/pages'

export default function CreateLiveSchedule () {
    const dispatch = useDispatch();
    const [scheduleStreaming, { error, loading }] = useMutation(SCHEDULE_STREAMING);
    const router = useRouter()
    const { userDetails } = useSelector((state: CommonSliceTypes) => state.common)
    const [steps, setSteps] = useState<ISteps>({
        step1: true,
        step2: false,
    })
    const [scheduleProps, setScheduleProps] = useState<ScheduleForm>({
        streamTitle: '',
        streamDescription: '',
        scheduleDate: '',
        scheduleTime: '',
        timeZone: '',
        email: [],
    })

    const formCompleted: StepsTrack = useMemo(() => {
        let stepsTrack = {
            step1: false,
            step2: false,
            step3: false,
        }

        if (scheduleProps?.scheduleDate && scheduleProps?.scheduleTime && scheduleProps?.timeZone) {
            stepsTrack.step1 = true
        }

        return stepsTrack
    }, [scheduleProps])

    const goToStep2 = (values: GoLiveScheduleStep1Form) => {
        setScheduleProps({
            ...scheduleProps, ...values,
            scheduleTime: moment(values.scheduleTime, DATE_TIME_FORMAT.format4).format(DATE_TIME_FORMAT.format3)
        })
        setSteps({ ...steps, step1: false, step2: true })
    }

    const onSubmit = (values: GoLiveScheduleStep3Form | undefined, type: HostingType) => {
        if (!formCompleted.step1) {
            toast.error(Message.STEP_1_REQUIRED)
            return;
        };
        if (values === null) {
            return
        }
        scheduleStreaming({
            variables: {
                ...scheduleProps,
                email: type === 'single' ? [userDetails?.email] : Object.values(values!).filter(email => email !== "")
            }
        }).then((res) => {
            const response = res?.data as ScheduleStreamingResponse
            if (response?.scheduleStreaming?.meta?.statusCode === 200) {
                router.replace(`/${ROUTES.private.liveSchedule}`)
                toast.success(response?.scheduleStreaming?.meta?.message)
            }
        })
    }
    
    const onSubmitBrand = (values: IInfluencers[]) => {
        if (!formCompleted.step1) {
            toast.error(Message.STEP_1_REQUIRED)
            return;
        };
        scheduleStreaming({
            variables: {
                ...scheduleProps,
                influencers: values
            }
        }).then((res) => {
            const response = res?.data as ScheduleStreamingResponse
            if (response?.scheduleStreaming?.meta?.statusCode === 200) {
                router.replace(`/${ROUTES.private.liveSchedule}`)
                toast.success(response?.scheduleStreaming?.meta?.message)
            }
        })
    }

    const handleRedirectOnNoCount = (error :  ApolloError | undefined) =>{
        if(error?.graphQLErrors?.[0]?.extensions?.code === 'YOU_DO_NOT_HAVE_SESSION_COUNT') {
            router.push(`/${ROUTES.private.myPlans}`)
        }
    }

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error) {
            handleGraphQLErrors(error)
            handleRedirectOnNoCount(error)
        }
    }, [loading, error])

    const accordionHandler = useCallback((step: IStep) => {
        setSteps((prevSteps) => ({
            step1: false, step2: false, step3: false, step4: false,
            [step]: !prevSteps[step]
        }));
    }, [setSteps, scheduleProps]);

    return (
        <div>
            <div className="golive-sec">
                <div className="container-lg">
                    <div className="row spacing-30">
                        <div className="l-col">
                            <h1 className="golive-title">Schedule Session</h1>
                        </div>
                        <div className='r-col'>
                            <Link href={`/${ROUTES.private.liveSchedule}`}>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-prev btn-icon">
                                    <span className="icon-left-long icon"></span> Back
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="golive-inner">
                        <ul className="golive-list list-unstyled">
                            <Step1
                                active={steps.step1}
                                onSubmitStep1={goToStep2}
                                accordionHandle={accordionHandler}
                                completed={formCompleted?.step1}
                            />
                            {
                                userDetails?.email !== undefined &&
                                <Step4
                                    active={steps.step2}
                                    onPrev={() => setSteps({ ...steps, step1: true, step2: false })}
                                    accordionHandle={accordionHandler}
                                    completed={formCompleted?.step2}
                                    onSubmitStep4={onSubmit}
                                    onSubmitBrand={onSubmitBrand}
                                    selfEmail={userDetails?.email}
                                    isBrand={userDetails?.user_type === '3'}
                                />
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
