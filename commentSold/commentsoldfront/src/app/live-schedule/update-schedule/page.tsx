"use client";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { DATE_TIME_FORMAT } from "@/constant/common";
import "@/styles/pages/go-live.scss";
import { useDispatch, useSelector } from "react-redux";
import { CommonSliceTypes } from "@/framework/redux/redux";
import moment from "moment";
import Step1 from "../create-schedule/steps-componenets/step-1";
import { GoLiveScheduleStep1Form } from "@/types/pages";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { UPDATE_SCHEDULE_STREAMING } from "@/framework/graphql/mutations/schedule";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { handleGraphQLErrors } from '@/utils/helpers';
import { ROUTES } from "@/config/staticUrl.config";
import Link from "next/link";

export default function UpdateScheduleStreaming() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userDetails } = useSelector(
    (state: CommonSliceTypes) => state.common
  );
  const [updateScheduleStreaming, { error, loading }] = useMutation(
    UPDATE_SCHEDULE_STREAMING
  );
  const pathName = usePathname()

  useEffect(() => {
    dispatch(setLoadingState(loading));
    if (error) {
      handleGraphQLErrors(error)
  }
  }, [loading, error]);

  const goToStep2 = useCallback((values: GoLiveScheduleStep1Form) => {
    updateScheduleStreaming({
      variables: {
        ...values,
        scheduleTime: moment(
          values.scheduleTime,
          DATE_TIME_FORMAT.format4
        ).format(DATE_TIME_FORMAT.format3),
      },
    }).then((response) => {
      if (response?.data?.updateStreamingSchedule?.meta?.statusCode === 200) {
        toast.success(response?.data?.updateStreamingSchedule?.meta?.message);
        router.push(`/${ROUTES.private.liveSchedule}`);
      }
    });
  }, [pathName]);

  return (
    <div>
      <div className="golive-sec">
        <div className="container-lg">
          <div className="row spacing-30">
              <div className="l-col">
                <h1 className="golive-title">
                  {userDetails?.user_type === "3" ? "Brand" : "Influencer"} - Multi
                  Hosting
                </h1>
              </div>
              <div className='r-col'>
                <Link href={`/${ROUTES.private.liveSchedule}`}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-prev btn-icon"
                    >
                    <span className="icon-left-long icon"></span> Back
                  </button>
                </Link>
              </div>
          </div>
          <div className="golive-inner">
            <ul className="golive-list list-unstyled">
              <Step1 active={true} onSubmitStep1={goToStep2} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
