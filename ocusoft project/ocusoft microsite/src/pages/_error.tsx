import { GetServerSideProps, NextPage } from "next";
import { ErrorPage } from "@components/Error";

interface IProps {
  statusCode: number;
  errorMessage: string;
  error?: any;
}
// @ts-ignore
const Error: NextPage<IProps> = ({ statusCode, errorMessage, error }) => (
  <ErrorPage code={statusCode} message={errorMessage} error={error} />
);

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const statusCode = res ? res.statusCode : 404;
  return { props: { statusCode } };
};

export default Error;
