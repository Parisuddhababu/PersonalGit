import Wrapper from "@components/Wrapper/Wrapper";

type arrayGen = string | number | boolean;

export interface IWrapperProps {
  andRequired?: arrayGen[];
  orRequired?: arrayGen[];
  children: any;
}

export default Wrapper;
