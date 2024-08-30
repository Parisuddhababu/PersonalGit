import { IWrapperProps } from ".";

const Wrapper = ({ children, andRequired, orRequired }: IWrapperProps) => {
  const isReuired = andRequired ? andRequired.filter((e) => (e ? false : true)).length <= 0 : false;
  const isNotReuired = orRequired ? orRequired.filter((e) => (e ? false : true)).length <= 0 : false;

  if (andRequired || orRequired) {
    if (isReuired || isNotReuired) return children;
    else return null;
  }

  return children;
};

export default Wrapper;
