import { Message } from "@/constant/errorMessage";
import { UPDATE_COMMENTS, UPDATE_PRIMARY_COLORS } from "@/framework/graphql/mutations/myProfile";
import { CommonSliceTypes } from "@/framework/redux/redux";
import { ICustomisePlatformProps, IMyProfile } from "@/types/components";
import { getDefaultPrimaryColor, setDynamicDefaultStyle } from "@/utils/helpers";
import { useMutation } from "@apollo/client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormValidationError from "../FormValidationError/FormValidationError";
import useValidation from "@/framework/hooks/validations";
import { GET_PROFILE } from "@/framework/graphql/queries/myProfile";
import useLoadingAndErrors from "@/framework/hooks/useLoadingAndErrors";

const CustomisePlatform = ({ data }: ICustomisePlatformProps) => {
  const { userType } = useSelector((state: CommonSliceTypes) => state.common);
  const [updateCommentKeyWords, { error: commentsError, loading: cLoading }] = useMutation(UPDATE_COMMENTS, {
    refetchQueries: [{ query: GET_PROFILE }],
  });
  const [isChecked, setIsChecked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [updatePrimaryColor, { error: primaryColorError, loading: primaryColorLoading }] = useMutation(UPDATE_PRIMARY_COLORS);
  const path = usePathname();
  const commentValues = {
    keyWords: "",
  };
  const {
    register: register2,
    setValue: setValue2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    trigger,
  } = useForm<IMyProfile>({ defaultValues: commentValues });
  const { keywordValidations } = useValidation();
  const loadingStates = [cLoading, primaryColorLoading];
  const errorStates = [commentsError, primaryColorError];
  useLoadingAndErrors(loadingStates, errorStates);

  useEffect(() => {
    if (data?.getProfile?.data) {
      setValue2("keyWords", data?.getProfile?.data?.key_words);
      setIsChecked(data?.getProfile?.data?.is_display_keyword);
    }
  }, [data]);

  useEffect(() => {
    const defaultColor = getDefaultPrimaryColor();
    setSelectedColor(defaultColor);
    setDynamicDefaultStyle(defaultColor);
  }, [path]);

  // update primary color
  const updateBrandPrimaryColor = async () => {
    updatePrimaryColor({
      variables: {
        primaryColor: selectedColor,
      },
    })
      .then((res) => {
        const data = res?.data;
        if (data?.updatePrimaryColor?.meta?.statusCode === 200) {
          setDynamicDefaultStyle(selectedColor);
          toast.success(data?.updatePrimaryColor?.meta?.message);
          return;
        }
        toast.error(Message.THEME_COLOR_NOT_CHANGE);
      })
      .catch(() => {
        toast.error(Message.THEME_COLOR_NOT_CHANGE);
        return;
      });
  };

  const onSubmitComments: SubmitHandler<IMyProfile> = async (data) => {
    updateCommentsFunction(data);
  };

  // update comments
  const updateCommentsFunction = async (data: IMyProfile) => {
    updateCommentKeyWords({
      variables: {
        keyWords: data.keyWords,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.updateCommentKeyWords?.meta.statusCode === 200 || data.updateCommentKeyWords?.meta.statusCode === 201) {
          toast.success(data.updateCommentKeyWords?.meta.message);
        }
      })
      .catch(() => {
        return;
      });
  };

  const onHandleKeywordDisplay = (isDisplayKeyword: boolean) => {
    setIsChecked(true);
    updateCommentKeyWords({
      variables: {
        isDisplayKeyword,
        keyWords: data?.getProfile?.data?.key_words,
      },
    })
      .then((res) => {
        const data = res.data;
        if (data.updateCommentKeyWords?.meta.statusCode === 200 || data.updateCommentKeyWords?.meta.statusCode === 201) {
          toast.success(data.updateCommentKeyWords?.meta.message);
          return;
        }
        setIsChecked(false);
      })
      .catch(() => {
        setIsChecked(false);
        return;
      });
  };

  return (
    <div className="card-wrapper">
      <h2 className="h3 spacing-40">Customize your Platform</h2>
      {userType === "brand" && (
        <div className="innerCard-wrapper spacing-40">
          <h3 className="spacing-10">Customize your Live Player</h3>
          <p className="content spacing-30">
            To help integrate the Live Player on the e-commerce site, some customization can be optionally set. Typically, the primary brand color is selected here. Please be aware that this color
            will be applied to buttons, therefore be sure to leave sufficient contrast between background color and text.
          </p>
          <div className="row">
            <div className="col30 col-3">
              <div className="col-inner">
                <div className="left">
                  <p className="title">Theme Color</p>
                </div>
                <div className="right">
                  <form>
                    <div className="">
                      <div className="color-picker form-control">
                        <label htmlFor="colorPicker"> {selectedColor}</label>
                        <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} placeholder="hello" id="colorPicker" className="colorPicker" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col30 col-3">
              <div className="col-inner">
                <button type="button" className="btn btn-primary" onClick={() => updateBrandPrimaryColor()}>
                  Update
                </button>
              </div>
            </div>
            {/* Temporary Commented */}
            {/* <div className="col30 col-3 border-right">
                    <div className="col-inner">
                        <div className="left">
                            <p className="title">Rounded Corners</p>
                        </div>
                        <div className="right">
                            <div className="toggle-btn">
                                <input type="checkbox" checked />
                                <span className="circle"></span>
                                <label className="toggle-yes">yes</label>
                                <label className="toggle-no">No</label>
                            </div>
                        </div>
                    </div>
              </div> */}
            {/* <div className="col30 col-3">
                  <div className="col-inner">
                      <div className="left">
                          <p className="title">Highlight Current Product</p>
                      </div>
                      <div className="right">
                          <div className="toggle-btn">
                              <input type="checkbox" />
                              <span className="circle"></span>
                              <label className="toggle-yes">yes</label>
                              <label className="toggle-no">No</label>
                          </div>
                      </div>
                  </div>
            </div> */}
          </div>
        </div>
      )}
      <div className="innerCard-wrapper spacing-40">
        <form onSubmit={handleSubmit2(onSubmitComments)}>
          <h3 className="spacing-10">Set Comment Keyword</h3>
          <p className="content spacing-30">
            Create an additional comment keyword that resonates with your audience more directly. We recommend keeping it short, easy to type, and unique to avoid typos and easily be harvested in a
            comment&apos;s feed.
          </p>
          <div className="row row30">
            <div className="col30 col-3">
              <div className="form-group">
                <input
                  aria-label="Keyword"
                  {...register2("keyWords", keywordValidations.keyWords)}
                  onChange={(e) => {
                    setValue2("keyWords", e.target.value.toUpperCase());
                    trigger("keyWords");
                  }}
                  name="keyWords"
                  className="form-control"
                  type="text"
                  placeholder="Enter Keywords"
                />
                <FormValidationError errors={errors2} name="keyWords" />
              </div>
            </div>
            <div>
              <button className="btn btn-primary">Update</button>
            </div>
          </div>
          <div className="row row30">
            <div className="col30 col-3 mt-n20">
              <p className="content">The comment &apos;sold&apos; keyword will always work for your customers</p>
            </div>
          </div>
          <div className="divider-line"></div>
          <h3 className="spacing-10">Display Sold Comments</h3>
          <p className="content spacing-30">Display sold comments when shoppers click on your product links. (web channel only)</p>
          <div className="toggle-btn">
            <input type="checkbox" checked={isChecked} id={isChecked ? "keyword-yes" : "keyword-no"} onChange={(e) => onHandleKeywordDisplay(e?.target?.checked)} />
            <span className="circle"></span>
            <label htmlFor="keyword-yes" className="toggle-yes">
              yes
            </label>
            <label htmlFor="keyword-no" className="toggle-no">
              No
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomisePlatform;
