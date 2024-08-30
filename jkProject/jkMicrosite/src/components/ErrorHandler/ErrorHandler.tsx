import { IAPIError } from "@type/Common/Base";

const ErrorHandler = (error: IAPIError, showError: any) => {
  if (error && error?.meta) {
    if (error?.meta?.message_code === "VALIDATION_ERROR") {
      for (const key in error.errors) {
        if (key) {
          showError(error?.errors[key][0]);
        }
      }
    } else {
      showError(error?.meta?.message);
    }
  } else {
    showError("Something went wrong");
  }
};

export default ErrorHandler;
