import FormValidationError from "@/components/FormValidationError/FormValidationError";
import { Message } from "@/constant/errorMessage";
import { GET_SINGLE_SCHEDULE_STREAMING } from "@/framework/graphql/queries/schedules";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { GoLiveScheduleStep1 } from "@/types/components";
import { GoLiveScheduleStep1Form, SelectedOption } from "@/types/pages";
import { useLazyQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from 'react-select';
import { toast } from "react-toastify";
import { CDatePicker, CTimePicker } from '@coreui/react-pro';
import moment from "moment";
import { getMinDateForTimezone, timeValidator } from "@/utils/helpers";
import useValidation from "@/framework/hooks/validations";
import { DATE_TIME_FORMAT } from "@/constant/common";

const Step1 = ({
  active,
  onSubmitStep1,
  accordionHandle,
  completed,
}: GoLiveScheduleStep1) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<GoLiveScheduleStep1Form>({
    defaultValues: {
      scheduleDate: "",
      scheduleTime: moment().tz(moment.tz.guess(true)).format(DATE_TIME_FORMAT.format6),
      timeZone: moment.tz.guess(true),
      streamTitle: "",
      streamDescription: "",
    },
  });
  
  const [uuidForUpdate, setUuidForUpdate] = useState<string>('')
  const param = useSearchParams();
  const [getScheduleData, { loading, error, refetch : refetchGetScheduleData, data: scheduleData }] = useLazyQuery(GET_SINGLE_SCHEDULE_STREAMING,{variables :{ scheduleUuid: uuidForUpdate }});
  const dispatch = useDispatch()
  const [selectedTime,setSelectedTime] = useState(moment().tz(moment.tz.guess(true)).format(DATE_TIME_FORMAT.format6));
  const [selectedTimezone,setSelectedTimezone] = useState(moment.tz.guess(true));
  const [selectedDate ,setSelectedDate] = useState('')
  const {scheduleStep1Validations} = useValidation()

  const Validations = {
    ...scheduleStep1Validations,
    scheduleDate: {
      required: Message.DATE_REQUIRED,
      validate: (value: string) => {
        return !moment.tz(value, 'YYYY-MM-DD', selectedTimezone).startOf('day').isBefore(moment().tz(selectedTimezone).startOf('day'), 'day') ? true : Message.DATE_PATTERN
      }
    },
    scheduleTime: {
      required: Message.TIME_REQUIRED,
      validate: (value: string) => {
        if (!moment.tz(getValues('scheduleDate'), 'YYYY-MM-DD', selectedTimezone).startOf('day').isSame(moment().tz(selectedTimezone).startOf('day'), 'day')) return true;
        return timeValidator(moment.tz(value, DATE_TIME_FORMAT.format6, getValues('timeZone')).format(DATE_TIME_FORMAT.format6),moment().tz(getValues('timeZone')).format(DATE_TIME_FORMAT.format6)) ? true : Message.TIME_PATTERN
      }
    },
  };

  useEffect(() => {
    if (!uuidForUpdate) return
    dispatch(setLoadingState(loading))
    if (error?.message) {
      toast.error(error?.message)
    }
  }, [loading, error])

  useEffect(()=>{
    setValue('timeZone',selectedTimezone)
    setSelectedTime(moment().tz(selectedTimezone).format(DATE_TIME_FORMAT.format6))
  },[selectedTimezone])

  const setPreviousValuesForUpdate = (uuid: string) => {
    refetchGetScheduleData({ scheduleUuid: uuid });
    getScheduleData({ variables: { scheduleUuid: uuid } })
  }

  useEffect(() => {
    const userScheduleData = scheduleData?.getScheduleStreaming?.data
    if (userScheduleData) {
      setValue('scheduleDate', userScheduleData?.schedule_date)
      setValue('scheduleTime', userScheduleData?.schedule_time?.substr(0,5))
      setValue('streamDescription', userScheduleData?.stream_description)
      setValue('streamTitle', userScheduleData?.stream_title)
      setValue('timeZone', userScheduleData?.timeZone)
      setSelectedTime(userScheduleData?.schedule_time?.substr(0,5))
      setSelectedTimezone(userScheduleData?.timeZone)
      setSelectedDate(userScheduleData?.schedule_date)
    }
  }, [uuidForUpdate, scheduleData])

  useEffect(() => {
    const uuid = param.get('uuid') ?? '';
    if (!uuid) return
    setUuidForUpdate(uuid);
    setPreviousValuesForUpdate(uuid);
  }, [param]);

  const onSubmit: SubmitHandler<GoLiveScheduleStep1Form> = (values) => {
    uuidForUpdate ? onSubmitStep1({ ...values, scheduleUuid: uuidForUpdate }) : onSubmitStep1(values);
  };

  const onCountryChange = useCallback((selectedOption: SelectedOption) => {
    setSelectedTimezone(selectedOption?.value!)
  }, [getValues('timeZone'),selectedTimezone]);

  const onChangeSelectedTime = (value: string | null) => {
    setSelectedTime(moment(value, DATE_TIME_FORMAT.format3).format(DATE_TIME_FORMAT.format6));
  };

  useEffect(()=>{
    setValue('scheduleTime',selectedTime)
  },[selectedTime]);

  return (
    <li
      className={`golive-list-item ${active ? "active" : ""} ${
        completed ? "completed" : ""
      }`}
    >
      <div className="golive-item-header">
        <span className="icon-check"></span>
        {!uuidForUpdate && <span className="golive-item-number h3">1</span>}
        <div className="golive-item-title-wrap">
          <h2 className="h3">Your Live Information</h2>
          <p>
            Add a unique name and a description of your live event. This will
            also be used for replay information
          </p>
        </div>
        {!uuidForUpdate && (
          <span
            className="golive-item-icon"
            onClick={() => accordionHandle && accordionHandle("step1")}
          ></span>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="golive-item-content">
          <div className="golive-card spacing-40">
            <div className="step1-top">
              <div className="step1-top-left">
                <span className="icon-calendar-add"></span>
                <div className="step1-top-left-content">
                  <h2 className="h3">Schedule Live For Later</h2>
                  <p>
                    You can schedule your live in advance, even if you don’t
                    have your collection ready.
                  </p>
                </div>
              </div>
            </div>
            <div className="setp1-middle">
              <div className="setp1-middle-inner">
                <div className="setp1-middle-col">
                  <div className="form-group">
                    <label htmlFor="select_date">Select Date*</label>
                    <CDatePicker
                      {...register("scheduleDate", Validations.scheduleDate)}
                      id="select_date"
                      date = {selectedDate}
                      onDateChange={(date) => {
                        setValue('scheduleDate',moment(date).format("YYYY-MM-DD"))
                      }}
                      cleaner = {false}
                      minDate={getMinDateForTimezone(moment().tz(selectedTimezone).startOf('day').format(DATE_TIME_FORMAT.format1))}
                    />
                  </div>
                  <FormValidationError errors={errors} name="scheduleDate" />
                </div>
                <div className="setp1-middle-col">
                  <div className="form-group">
                    <label htmlFor="select_time">Select Time*</label>
                    <span className="icon-time"></span>
                    <CTimePicker
                      cleaner={false}
                      {...register("scheduleTime", Validations.scheduleTime)}
                      time={selectedTime}
                      onTimeChange={(e) => {
                        onChangeSelectedTime(e);
                      }}
                      id="select_time"
                      locale="en-US"
                      seconds={false}
                    />
                  </div>
                  <FormValidationError errors={errors} name="scheduleTime" />
                </div>
                <div className="setp1-middle-col">
                  <div className="form-group">
                    <label htmlFor="react-select-4-input">Select Time Zone*</label>
                    <div className="react-select-design with-icon">
                      <Select
                        {...register("timeZone", Validations.timeZone)}
                        id="select_time_zone"
                        name="timezone"
                        onChange={(e) => onCountryChange(e as SelectedOption)}
                        defaultValue={{ label: selectedTimezone }}
                        value={{ label: selectedTimezone }}
                        aria-label="Select Time Zone"
                        options={moment.tz.names()?.map((item) => ({
                          value: item,
                          label: item,
                        }))}
                      />
                      <span className="icon icon-flag"></span>
                    </div>
                  </div>
                  <FormValidationError errors={errors} name="timeZone" />
                </div>
              </div>
            </div>
          </div>
          <div className="golive-item-bottom-content">
            <div className="form-group">
              <label htmlFor="streamTitle">Go Live Title*</label>
              <input
                {...register("streamTitle", Validations.streamTitle)}
                type="text"
                className="form-control"
                id="streamTitle"
                placeholder="Grab attention with a title (50 characters or less)"
              />
              <FormValidationError errors={errors} name="streamTitle" />
            </div>
            <div className="form-group">
              <label htmlFor="streamDescription">Live Description*</label>
              <textarea
                {...register(
                  "streamDescription",
                  Validations.streamDescription
                )}
                className="form-control"
                id="streamDescription"
                placeholder="Build excitement for the live"
              ></textarea>
              <FormValidationError errors={errors} name="streamDescription" />
            </div>
          </div>
          <div className="step-btn-group">
            <button type="submit" className="btn btn-primary btn-next btn-icon">
              {!uuidForUpdate ? "Next" : "Update"}
              {!uuidForUpdate && <span className="icon-right-long icon"></span>}
            </button>
          </div>
        </div>
      </form>
    </li>
  );
};

export default Step1;
