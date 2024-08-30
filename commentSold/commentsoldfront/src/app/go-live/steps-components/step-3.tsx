import FormValidationError from "@/components/FormValidationError/FormValidationError";
import InstaLogin from "@/components/Popup/InstaLogin";
import { LOCAL_STORAGE_KEY } from "@/constant/common";
import { E_PLATFORMS } from "@/constant/enums";
import { Message } from "@/constant/errorMessage";
import { IMAGE_PATH } from "@/constant/imagePath";
import useGetActiveSocialPlatform from "@/framework/hooks/useGetActiveSocialPlatform";
import { GoLiveStep3 } from "@/types/components"
import { GoLiveStep3Form } from "@/types/pages";
import Image from "next/image";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Step3 = ({ active, onPrev, onSubmitStep3, accordionHandle, completed, hidPrev }: GoLiveStep3) => {
    const [selectFbPage, setSelectFbPage] = useState(false)
    const [selectInsta, setSelectInsta] = useState(false)
    const [selectYoutube, setSelectYoutube] = useState(false)
    const [selectTikTok, setSelectTikTok] = useState(false)
    const [open, setOpen] = useState(false)
    const [validationError, setValidationError] = useState(false)
    const [selectLinkedin, setSelectLinkedin] = useState(false)
    const {
        handleSubmit,
        setValue,
    } = useForm<GoLiveStep3Form>({
        defaultValues: {
            pageUuid: '',
            instaId: false,
            youTube: false,
        },
    });
    const {activePlatformList} = useGetActiveSocialPlatform();

    const onSubmit: SubmitHandler<GoLiveStep3Form> = (values) => {
        if (!selectFbPage && !selectInsta && !selectYoutube && !selectTikTok && !selectLinkedin) {
            setValidationError(true)
            return
        }
        onSubmitStep3({ ...values, is_fb: selectFbPage, is_tiktok: selectTikTok, is_linkedin: selectLinkedin})
    };

    const onFbSelect = (status: boolean) => {
        if (!status) {
            setSelectFbPage(false)
            return
        }
        const facebook = localStorage.getItem(LOCAL_STORAGE_KEY.facebookPage)
        if (!facebook) {
            toast.error(Message.FACEBOOK_NOT_CONNECTED)
            return
        }
        setValidationError(false)
        setValue('pageUuid', facebook)
        setSelectFbPage(true)
    }

    const onInstaSelect = (status: boolean) => {
        if (!status) {
            setValue('instaId', false)
            setSelectInsta(false)
            return
        }
        const facebook = localStorage.getItem(LOCAL_STORAGE_KEY.facebookPage)
        if (!facebook) {
            toast.error(Message.FACEBOOK_NOT_CONNECTED)
            return
        }
        const insta = localStorage.getItem(LOCAL_STORAGE_KEY.instaAccount)
        if (!insta) {
            toast.error(Message.INSTA_NOT_CONNECTED)
            return
        }
        setValue('pageUuid', facebook)
        setOpen(true)
    }
    const onYoutubeSelect = (status: boolean) => {
        if (!status) {
            setValue('youTube', false)
            setSelectYoutube(false)
            return
        }
        const youtubeChannel = localStorage.getItem(LOCAL_STORAGE_KEY.youtubeChannel)
        if (!youtubeChannel) {
            toast.error(Message.YOUTUBE_NOT_CONNECTED)
            return
        }
        setValue('youTube', true)
        setSelectYoutube(true)
    }

    const onTikTokSelect = (status: boolean) => {
        if (!status) {
            setValue('tikTok', false)
            setSelectTikTok(false)
            return
        }
        const youtubeChannel = localStorage.getItem(LOCAL_STORAGE_KEY.tikTokAccount);
        console.log(youtubeChannel && JSON.parse(youtubeChannel));
        if (!youtubeChannel) {
            toast.error(Message.TIKTOK_NOT_CONNECTED)
            return
        }
        setValidationError(false)
        setValue('tikTok', true)
        setSelectTikTok(true)
    }

    const onLinkedinSelect = (status: boolean) => {
        if (!status) {
            setValue('linkedin', false)
            setSelectLinkedin(false)
            return
        }
        const linkedinData = localStorage.getItem(LOCAL_STORAGE_KEY.linkedinData);
        console.log(linkedinData && JSON.parse(linkedinData));
        if (!linkedinData) {
            toast.error(Message.LINKEDIN_NOT_CONNECTED)
            return
        }
        setValidationError(false)
        setValue('linkedin', true)
        setSelectLinkedin(true)
    }

    const toggleModal = () => {
        setOpen(false)
    }
    const onSubmitInsta = () => {
        setOpen(false)
        setSelectInsta(true)
        setValue('instaId', true)
        setValidationError(false)
    }

    return (
        <Fragment>
            <li className={`golive-list-item ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}>
                <div className="golive-item-header">
                    <span className="icon-check"></span>
                    <span className="golive-item-number h3">3</span>
                    <div className="golive-item-title-wrap">
                        <h3>Connect to Broadcast Channels</h3>
                        <p>Set which channels your live will appear on. To add new or manage existing channels click on the Manage Channels button.</p>
                    </div>
                    <span className="golive-item-icon" onClick={() => accordionHandle('step3')}></span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="golive-item-content">
                        <div className="golive-card spacing-40">
                            <div className="step-3-content-inner">
                                <ul className="step-social-list list-unstyled">
                                   {activePlatformList?.[E_PLATFORMS.Facebook] &&
                                    <li className="step-social-item">
                                        <div className="step-social-item-left">
                                            <i className="icon-facebook"></i>
                                            <h3 className="step-social-item-label">Facebook Business Page</h3>
                                        </div>
                                        <div className="step-social-item-right">
                                            <div className="toggle-btn">
                                                <input type="checkbox" id="use_logo"
                                                    checked={selectFbPage}
                                                    onChange={(e) => onFbSelect(e.target.checked)}
                                                    aria-label={selectInsta ? 'Yes' : 'No'}
                                                />
                                                <span className="circle"></span>
                                                <label className="toggle-yes" htmlFor="use_logo">yes</label>
                                                <label className="toggle-no" htmlFor="use_logo">No</label>
                                            </div>
                                        </div>
                                    </li>}
                                   {activePlatformList?.[E_PLATFORMS.Instagram] &&
                                    <li className="step-social-item">
                                        <div className="step-social-item-left">
                                            <i className="icon-instagram"></i>
                                            <h3 className="step-social-item-label">Instagram Business Page</h3>
                                        </div>
                                        <div className="step-social-item-right">
                                            <div className="toggle-btn">
                                                <input type="checkbox" id="use_logo"
                                                    checked={selectInsta}
                                                    onChange={(e) => onInstaSelect(e.target.checked)}
                                                    aria-label={selectInsta ? 'Yes' : 'No'}
                                                />
                                                <span className="circle"></span>
                                                <label className="toggle-yes" htmlFor="use_logo">yes</label>
                                                <label className="toggle-no" htmlFor="use_logo">No</label>
                                            </div>
                                        </div>
                                    </li> }
                                   {activePlatformList?.[E_PLATFORMS.Youtube] &&
                                    <li className="step-social-item">
                                        <div className="step-social-item-left">
                                            <Image src={IMAGE_PATH.youtubeLogo}  alt="youtube icon" width={56} height={56} layout={'fit'} objectFit={'contain'}/>
                                            <h3 className="step-social-item-label">Youtube Channel</h3>
                                        </div>
                                        <div className="step-social-item-right">
                                            <div className="toggle-btn">
                                                <input type="checkbox" id="use_logo"
                                                    checked={selectYoutube}
                                                    onChange={(e) => onYoutubeSelect(e.target.checked)}
                                                    aria-label={selectYoutube ? 'Yes' : 'No'}
                                                />
                                                <span className="circle"></span>
                                                <label className="toggle-yes" htmlFor="use_logo">yes</label>
                                                <label className="toggle-no" htmlFor="use_logo">No</label>
                                            </div>
                                        </div>
                                    </li>}
                                    {activePlatformList?.[E_PLATFORMS.TikTok] && <li className="step-social-item">
                                        <div className="step-social-item-left">
                                            <i className="icon-tiktok"></i>
                                            <h3 className="step-social-item-label">TikTok Account</h3>
                                        </div>
                                        <div className="step-social-item-right">
                                            <div className="toggle-btn">
                                                <input type="checkbox" id="use_logo"
                                                    checked={selectTikTok}
                                                    onChange={(e) => onTikTokSelect(e.target.checked)}
                                                    aria-label={selectTikTok ? 'Yes' : 'No'}
                                                />
                                                <span className="circle"></span>
                                                <label className="toggle-yes" htmlFor="use_logo">yes</label>
                                                <label className="toggle-no" htmlFor="use_logo">No</label>
                                            </div>
                                        </div>
                                    </li>}
                                    {activePlatformList?.[E_PLATFORMS.Linkedin]  && <li className="step-social-item">
                                        <div className="step-social-item-left">
                                            <i className="icon-instagram"></i>
                                            <h3 className="step-social-item-label">Linkedin Account</h3>
                                        </div>
                                        <div className="step-social-item-right">
                                            <div className="toggle-btn">
                                                <input type="checkbox" id="use_logo"
                                                    checked={selectLinkedin}
                                                    onChange={(e) => onLinkedinSelect(e.target.checked)}
                                                    aria-label={selectLinkedin ? 'Yes' : 'No'}
                                                />
                                                <span className="circle"></span>
                                                <label className="toggle-yes" htmlFor="use_logo">yes</label>
                                                <label className="toggle-no" htmlFor="use_logo">No</label>
                                            </div>
                                        </div>
                                    </li>}
                                </ul>
                                <br />
                                {
                                    validationError &&
                                    <FormValidationError
                                        errors={{
                                            pageUuid: {
                                                message: Message.FACEBOOK_REQUIRED
                                            }
                                        }}
                                        name="pageUuid" />
                                }
                            </div>
                        </div>
                        <div className="step-btn-group">
                            {
                                !hidPrev &&
                                <button type="button" className="btn btn-secondary btn-prev btn-icon" onClick={onPrev}><span className="icon-left-long icon"></span> Previous</button>
                            }
                            <button type="submit" className="btn btn-primary btn-next btn-icon">Next <span className="icon-right-long icon"></span></button>
                        </div>
                    </div>
                </form>
            </li>
            <InstaLogin
                open={open}
                onClose={toggleModal}
                onSubmit={onSubmitInsta}
            />
        </Fragment>
    )
}

export default Step3