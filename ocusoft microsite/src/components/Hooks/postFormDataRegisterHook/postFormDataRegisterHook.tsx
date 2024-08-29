import pagesServices from "@services/pages.services";
import { generateFormData } from "@util/common";

const usePostFormDataHook = () => {
  const makeDynamicFormDataAndPostData = (
    data: any,
    postApiName: string,
    allowWithCustomForm: boolean = false
  ) => {
    const FormData = generateFormData(data);

    if (FormData || allowWithCustomForm) {
      return pagesServices.postPage(
        postApiName,
        allowWithCustomForm ? data : FormData
      );
    }
  };

  const submitFormDataHook = (data: any, postApiName: string) => {
    return pagesServices.postPage(postApiName, data);
  };
  const submitFormDataJSONHook = ({...data}: any, postApiName: string) => {
    return pagesServices.postPage(postApiName, data);
  };
  const deleteDataHook = (data: any, postApiName: string) => {
    return pagesServices.deleteData(postApiName, data);
  };

  const getDataHook = (endpoint : any , data : any) =>{
    return pagesServices.getPage(endpoint, data)
  }

  return { makeDynamicFormDataAndPostData, submitFormDataHook, deleteDataHook, getDataHook, submitFormDataJSONHook };
};

export default usePostFormDataHook;
