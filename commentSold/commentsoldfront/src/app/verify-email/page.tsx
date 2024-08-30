"use client";
import { VERIFY_EMAIL_ADDRESS } from "@/framework/graphql/mutations/user";
import { setLoadingState } from "@/framework/redux/reducers/commonSlice";
import { IVerifyEmailResponse } from "@/types/pages";
import { FetchResult, useMutation } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "@/styles/pages/verify-email.scss";
import Link from "next/link";
import { ROUTES } from "@/config/staticUrl.config";
import { IMAGE_PATH } from "@/constant/imagePath";
import Image from "next/image";

const VerifyEmail = () => {
  const [verifyEmailAddress, { loading }] = useMutation(VERIFY_EMAIL_ADDRESS);
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [verifyStatus, setVerifyStatus] = useState({ status: '', message: '' });
  const token = params.get('token');

  useEffect(() => {
    token && dispatch(setLoadingState(loading));
  }, [loading]);

  const handleVerifyEmail = (token: string) => {
    verifyEmailAddress({
      variables: {
        token: token,
      },
    })
      .then((data: FetchResult<IVerifyEmailResponse>) => {
        if (data?.data?.verifyEmail) {
          setVerifyStatus({
            status: data?.data?.verifyEmail?.meta?.status,
            message: data?.data?.verifyEmail?.meta?.message,
          });
        }
      })
      .catch((error) => {
        const graphError = error?.graphQLErrors?.[0]?.extensions?.meta;
        if (!graphError) return;
        setVerifyStatus({
          status: graphError?.status,
          message: graphError?.message,
        });
      });
  };

  useEffect(() => {
    if (!token) return;
    handleVerifyEmail(token);
  }, [params]);

  return (
    <section className="verify-section">
        <div className="verify-wrapper">
        <Image className="spacing-30" src={IMAGE_PATH.verifyEmail} alt="verified image" width={300} height={200} style={{objectFit:"contain"}}/>
          <h1 className="spacing-30">{verifyStatus.message}</h1>
          <Link href={`/${ROUTES.public.signIn}`}>
            <button className="btn btn-primary">Go to Sign In</button>
          </Link>
        </div>
    </section>
  );
};

export default VerifyEmail;
