import FormValidationError from "@/components/FormValidationError/FormValidationError";
import { Message } from "@/constant/errorMessage";
import useValidation from "@/framework/hooks/validations";
import { GoLiveStep1, } from "@/types/components"
import { GoLiveStep1Form } from "@/types/pages";
import { SubmitHandler, useForm } from "react-hook-form";

const Step1 = ({ active, onSubmitStep1, accordionHandle }: GoLiveStep1) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GoLiveStep1Form>({
        defaultValues: {
            streamTitle: "",
            streamDescription: "",
        },
    });

    const Validations = {
        streamTitle: {
            required: Message.STREAM_TITLE_REQUIRED,
        },
    };

    const { goLiveStep1Validations } = useValidation()

    const onSubmit: SubmitHandler<GoLiveStep1Form> = (values) => {
        onSubmitStep1(values)
    };

    return (
        <li className={`golive-list-item ${active ? 'active' : ''} ${!active ? 'completed' : ''}`}>
            <div className="golive-item-header">
                <span className="icon-check"></span>
                <span className="golive-item-number h3">1</span>
                <div className="golive-item-title-wrap">
                    <h2 className="h3">Your Live Information</h2>
                    <p>Add a unique name and a description of your live event. This will also be used for replay information</p>
                </div>
                <span className="golive-item-icon" onClick={() => accordionHandle('step1')}></span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="golive-item-content">
                    <div className="golive-item-bottom-content">
                        <div className="form-group">
                            <label htmlFor="go_live_title">Go Live Title*</label>
                            <input
                                {...register("streamTitle", Validations.streamTitle)}
                                type="text" className="form-control" id="go_live_title"
                                placeholder="Grab attention with a title (50 characters or less)" />
                            <FormValidationError errors={errors} name="streamTitle" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="live_description">Live Description</label>
                            <textarea
                                {...register("streamDescription", goLiveStep1Validations.streamDescription)}
                                className="form-control" id="live_description" placeholder="Build excitement for the live"></textarea>
                            <FormValidationError errors={errors} name="streamDescription" />
                        </div>
                    </div>
                    <div className="step-btn-group">
                        <button className="btn btn-primary btn-next btn-icon" aria-label="next-button">Next <span className="icon-right-long icon"></span></button>
                    </div>
                </div>
            </form>

        </li>
    )
}

export default Step1