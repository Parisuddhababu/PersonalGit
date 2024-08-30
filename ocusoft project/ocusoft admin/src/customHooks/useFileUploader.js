import { API } from "src/services/Api";
import { useToast } from "src/shared/toaster/Toaster";
import { FILE_TYPE_DATA } from "src/shared/constant/constant";

const useFileUploader = () => {
    const { showError } = useToast();

    const handleFileImportAction = (
        e,
        uploadType,
        resetFileCache,
        url,
        responseObj,
        setIsLoading,
        maxFileSize = 5,
        formData = new FormData(),
    ) => {
        e.preventDefault();
        const targetFile = e?.target?.files?.[0] ?? null;

        if (targetFile) {
            const availableFileTypes = FILE_TYPE_DATA[uploadType] ?? [];

            if (!availableFileTypes.includes(targetFile.type)) {
                showError("Uploaded file is not of the proper type");
                resetFileCache();
            } else if (((targetFile.size / 1000) / 1024) < maxFileSize) {
                const reader = new FileReader();
                reader.onload = () => {
                    formData.append("file", targetFile);

                    if (typeof setIsLoading === "function") setIsLoading(true);
                    if (responseObj) API.addMaster(responseObj, formData, true, url);
                };

                reader.readAsDataURL(targetFile);
            } else {
                showError(`Max upload size is ${maxFileSize}MB`);
                resetFileCache();
            }
        }
    };

    return { handleFileImportAction };
};

export default useFileUploader;
