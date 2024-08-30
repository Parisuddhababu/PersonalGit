import { IWrapperProps } from "@components/Wrapper/index";

const Wrapper = ({ children, andRequired, orRequired }: IWrapperProps) => {
  const isReuired = andRequired ? andRequired.filter((e) => (!e)).length <= 0 : false;
  const isNotReuired = orRequired ? orRequired.filter((e) => (!e)).length <= 0 : false;

  if (andRequired || orRequired) {
    if (isReuired || isNotReuired) return children;
    else return null;
  }

  return children;
};

export default Wrapper;
