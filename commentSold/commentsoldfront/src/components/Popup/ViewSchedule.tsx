'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import Modal from 'react-modal';
import "@/styles/pages/product-catalog-management.scss";
import { GET_SINGLE_SCHEDULE_STREAMING } from "@/framework/graphql/queries/schedules";
import {  GoLiveScheduleTep1Form1 } from "@/types/pages";
import Select from 'react-select';
import "@/styles/pages/influencer.scss";
import { IViewScheduleStreaming } from "@/types/components";
import { CDatePicker, CTimePicker } from "@coreui/react-pro";
import { CommonSliceTypes } from "@/framework/redux/redux";

interface IGuestDetails {
    uuid: string;
    product_id: number;
    invitation_url: string;
    invited_user_email: string;
    product?: {name : string}
}

const ViewScheduleDetails = ({
    SingleScheduleId,
    model,
    onClose
}: IViewScheduleStreaming) => {
    const {
        register,
        setValue,
        getValues,
    } = useForm<GoLiveScheduleTep1Form1>({
        defaultValues: {
            scheduleDate: "",
            scheduleTime: "",
            timeZone: "",
            streamTitle: "",
            streamDescription: "",
            email: ''
        },
    });
    const [getSingleScheduleDetails,{ refetch, data, error, loading }] = useLazyQuery(GET_SINGLE_SCHEDULE_STREAMING)
    const dispatch = useDispatch();
    const [guestDetails, setGuestDetails] = useState<IGuestDetails[]>([]);
    const { userType, userDetails, brandName, isWhiInfluencer } = useSelector((state: CommonSliceTypes) => state.common)

    useEffect(() => {
        dispatch(setLoadingState(loading))
        if (error?.message) {
            toast.error(error?.message)
        }
    }, [loading, error])

    const initializeData = () => {
        setValue('scheduleDate', data?.getScheduleStreaming?.data?.schedule_date);
        setValue('scheduleTime', data?.getScheduleStreaming?.data?.schedule_time);
        setValue('timeZone', data?.getScheduleStreaming?.data?.timeZone);
        setValue('streamTitle', data?.getScheduleStreaming?.data?.stream_title);
        setValue('streamDescription', data?.getScheduleStreaming?.data?.stream_description);
        setValue('email', data?.getScheduleStreaming?.data?.HostDetails?.email);
        if(data?.getScheduleStreaming?.data?.invite){
            if(data?.getScheduleStreaming?.data?.HostDetails?.email === userDetails?.email || (brandName === 'whi' && !isWhiInfluencer)){
                setGuestDetails(data.getScheduleStreaming.data.invite)
                return;
            }
            setGuestDetails([{invited_user_email : userDetails?.email , product : {name : data?.getScheduleStreaming?.data?.product?.name}},...data.getScheduleStreaming.data.invite])
        }
    };

    useEffect(() => {
        if (SingleScheduleId) {
            getSingleScheduleDetails({
                    variables: { scheduleUuid: SingleScheduleId }
            })
            refetch();
            initializeData();
        }
    }, [SingleScheduleId, data?.getScheduleStreaming, userDetails]);

    return (
        <Modal
            isOpen={model}
            contentLabel="Example Modal"
        >
            <button onClick={onClose} className='modal-close'><i className='icon-close'></i></button>
            <p className="spacing-40 h3">Schedule Live For Later</p>
            <div className='modal-body scrollbar-sm schedule-live-modal-body'>
                <form>
                    <div className="golive-item-content">
                        <div className="golive-card spacing-40">
                            <div className="setp1-middle">
                                <div className="setp1-middle-inner">
                                    <div className="setp1-middle-col">
                                        <div className="form-group">
                                            <label htmlFor="select_date">Select Date*</label>
                                            <CDatePicker
                                              disabled
                                              cleaner={false}
                                              date={getValues('scheduleDate')}
                                              id="select_time"
                                            />
                                        </div>
                                    </div>
                                    <div className="setp1-middle-col">
                                        <div className="form-group">
                                            <label htmlFor="select_time">Select Time*</label>
                                            <span className="icon-time"></span>
                                             <CTimePicker cleaner={false} disabled time={getValues('scheduleTime')} id="select_time"  locale="en-US" seconds={false} />
                                        </div>
                                    </div>
                                    <div className="setp1-middle-col">
                                        <div className="form-group">
                                            <label htmlFor="select_time_zone">Select Time Zone*</label>
                                            <div className="react-select-design with-icon">
                                                <Select
                                                    placeholder="Time Zone"
                                                    id="select_time_zone"
                                                    name="timezone"
                                                    value={{ label: getValues('timeZone') }}
                                                    isDisabled
                                                />
                                                <span className="icon icon-flag"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="golive-item-bottom-content">
                            <div className="form-group">
                                <label htmlFor="streamTitle">Go Live Title*</label>
                                <input
                                    {...register("streamTitle")}
                                    type="text"
                                    className="form-control"
                                    id="streamTitle"
                                    placeholder="Grab attention with a title (255 characters or less)"
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="streamDescription">Live Description*</label>
                                <textarea
                                    {...register(
                                        "streamDescription"
                                    )}
                                    className="form-control"
                                    id="streamDescription*"
                                    placeholder="Build excitement for the live"
                                    disabled
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="Influencer Email ID">Host Email ID*</label>
                                <input className="form-control" type="email" placeholder="Influencer Email ID"  {...register("email")} name="email" id="email" disabled />
                            </div>
                            {guestDetails?.length > 0 && <div className="form-group">
                                <label htmlFor="Influencer Email ID">Guest Details*</label>
                                <ul className="live-for-later-email list-unstyled">
                                    {
                                      guestDetails?.map((guest)=>(
                                            <li key={guest?.invited_user_email} className="disable">
                                                {userType !== 'influencer' && guest?.product?.name && <p>Product Name : {guest.product.name}</p>}
                                                <p>Email  : {guest?.invited_user_email ?? "-"}</p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>}
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ViewScheduleDetails;















