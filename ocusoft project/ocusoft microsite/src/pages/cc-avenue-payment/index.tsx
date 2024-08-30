import CCAvenuePaymentResponse from "@templates/CCAvenuePayment/CCAvenuePayment";
import { parse } from "cookie";
import { NextPageContext } from "next";

const Page = (data: any) => {
  return <CCAvenuePaymentResponse ccresponse={data} />
};

Page.getInitialProps = async ({ req }: NextPageContext) => {
  const useragent = req?.headers["user-agent"];
  let parseCookie = req?.headers?.cookie || "";
  const header = parse(parseCookie);

  const host = req?.headers["host"];
  const canonical = `https://${host}${req?.url}`;

  return { data: header, useragent, host: req ? req.headers.host : "", canonical };
};

export default Page;
