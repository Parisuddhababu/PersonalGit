import Link from "next/link";
import React from "react";
import { IHeaderTopState } from ".";
import { useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { formatUSPhoneNumber } from "@util/common";

const HeaderTop = (props: IHeaderTopState) => {
	const reduxData = useSelector((state: ISignInReducerData) => state);

	return (
		<div className="sub-header">
			<div className="container">
				<a href="#" className="sub-text">{props?.data?.header?.announcement}</a>
				<ul>
					{
						props?.contact_header?.length && props?.contact_header?.length > 0 &&
						<li>
							<Link href={
								props?.contact_header
									? `tel:${props?.data?.header?.country?.country_phone_code}${props?.contact_header}`
									: "#"
							}>
								<a aria-label={formatUSPhoneNumber(props?.contact_header)} >
									<i className="osicon-call"></i>
									<span>{formatUSPhoneNumber(props?.contact_header)}</span></a>
							</Link>
						</li>
					}
					<li>
						<a aria-label={props?.data?.header?.email} href={`mailto:${props?.data?.header?.email}`}><i className="osicon-doctor"></i><span>{props?.data?.header?.email}</span></a>
					</li>
					{
						reduxData?.signIn?.userData?.user_detail?.email ? <></> :
							<li className="login-register-btn">
								<Link href={'/sign-in'}>
									<a aria-label="Login/Register"><button className="login-btn">Login/Register</button></a>
								</Link>
							</li>
					}

				</ul>
			</div>
		</div>
	);
};

export default HeaderTop;
