import React from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Modal from "@components/Modal";
import { IGiftForm, IGiftWrapMessage } from "@templates/Checkout/components/GiftMessage/index";
import { useForm, Controller } from "react-hook-form";
import { Message } from "@constant/errorMessage";
import FormValidationError from "@components/FormValidationError";
import { NAME_MAXLENGTH, NAME_MINLENGTH, SPECIAL_CHARCATER } from "@constant/regex";
import useGiftMessage from "@components/Hooks/giftMessage";

const GiftMessage1 = ({ onClose, isModal, _id, gift_message, updateData }: IGiftWrapMessage) => {

    const { submitGiftMessage, removeGiftMessage } = useGiftMessage()
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<IGiftForm>({
        defaultValues: {
            gift_recipient: gift_message?.gift_recipient ?? '',
            gift_sender: gift_message?.gift_sender ?? '',
            gift_message: gift_message?.gift_message ?? ''
        },
    });

    const toggleModal = () => {
        onClose();
    };
    const submitForm = async (data: IGiftForm) => {
        const response = await submitGiftMessage(data, _id)
        if (response?.meta.status_code == 200) {
            updateData()
            toggleModal()
        }
    }
    const deleteGift = async () => {
        const response = await removeGiftMessage(_id)
        if (response?.meta.status_code == 200) {
            toggleModal()
            updateData()
        }
    }
    return (
        <>
            <Head>
                <link rel="stylesheet" href={getTypeBasedCSSPath("", CSS_NAME_PATH.cartCoupon)} />
            </Head>
            <Modal className="available-coupen-popup" headerName="Wrap Gift Message" open={isModal} onClose={toggleModal} dimmer={false}>
              <div className="modal-content">
                  <div className="apply-coupon-sec">
                      <form noValidate onSubmit={handleSubmit(submitForm)}>
                          <div className="row">
                              <div className="d-col">
                                  <div className="form-group">
                                      <Controller
                                          name="gift_recipient"
                                          control={control}
                                          rules={{
                                              required: Message.RECIPIENT_REQUIRED,
                                              pattern: { value: SPECIAL_CHARCATER, message: Message.SPECIAL_CHARACTERS_NOW_ALLOW },
                                          }}
                                          render={({ field }) => (
                                              <>
                                                  <input placeholder="Enter recipient name*" id={field.name} {...field}
                                                      minLength={NAME_MINLENGTH}
                                                      maxLength={NAME_MAXLENGTH}
                                                      className="form-control"
                                                  />
                                              </>
                                          )}
                                      />
                                      <FormValidationError errors={errors} name="gift_recipient" />
                                  </div>
                              </div>
                              <div className="d-col">
                                  <div className="form-group">
                                      <Controller
                                          name="gift_sender"
                                          control={control}
                                          rules={{
                                              required: Message.SENDER_REQUIRED,
                                              pattern: { value: SPECIAL_CHARCATER, message: Message.SPECIAL_CHARACTERS_NOW_ALLOW },
                                          }}
                                          render={({ field }) => (
                                              <>
                                                  <input placeholder="Enter sender name" id={field.name} {...field}
                                                      minLength={NAME_MINLENGTH}
                                                      maxLength={NAME_MAXLENGTH}
                                                      className="form-control"
                                                  />
                                              </>
                                          )}
                                      />
                                      <FormValidationError errors={errors} name="gift_sender" />
                                  </div>
                              </div>
                              <div className="d-col">
                                  <div className="form-group">
                                      <Controller
                                          name="gift_message"
                                          control={control}
                                          rules={{
                                              required: Message.DESCRIPTION_REQUIRED,
                                          }}
                                          render={({ field }) => (
                                              <>
                                                  <label>
                                                  </label>
                                                  <textarea
                                                      placeholder="Enter Message *"
                                                      rows={3}
                                                      cols={30}
                                                      id={field.name}
                                                      {...field}
                                                      autoFocus={true}
                                                      className="form-control"
                                                  />
                                              </>
                                          )}
                                      />
                                      <FormValidationError errors={errors} name="gift_message" />
                                  </div>
                              </div>
                              <>
                                  <div className="d-col actions">
                                      <button className="btn btn-primary btn-medium" type="submit">{gift_message?.gift_message ? 'Update Message' : 'Send Message'}</button>
                                      {
                                          gift_message != undefined &&
                                          <button className="btn btn-secondary btn-medium" type="button" onClick={() => deleteGift()}>Delete Message</button>
                                      }
                                  </div>
                              </>
                          </div>
                      </form>
                  </div>
              </div>
            </Modal>
        </>
    )
}

export default GiftMessage1
