import { handleGraphQLErrors } from "@/utils/helpers";
import { ApolloError } from "@apollo/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingState } from "../redux/reducers/commonSlice";

const useLoadingAndErrors = (loadingStates: boolean[], errorStates: (ApolloError | undefined)[]) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const anyLoading = loadingStates.some((state: boolean) => state);
    dispatch(setLoadingState(anyLoading));

    errorStates.forEach((error: ApolloError | undefined) => {
      if (error) {
        handleGraphQLErrors(error);
      }
    });
  }, [dispatch, ...loadingStates, ...errorStates]);
};

export default useLoadingAndErrors;
