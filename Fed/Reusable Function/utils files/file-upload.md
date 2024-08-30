### Components

```
let fileBucket = null;

const setError = (error) => {
  // display error in toastr or other
}

const fileSizePending = () => {
    let maxFileUpload = maxFileSize * (1024 * 1024);

    const fileSizes: number[] = state.fileBucket.filter((file) => file).map((file) => file.size);
    const fileSizeRemain: number = fileSizes.length > 0 ? fileSizes.reduce((total, value) => total + value) : 0;

    return maxFileUpload - fileSizeRemain;
  };


// handle file upload, and validate file is valid or not
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {

    let files: FileList = event.target.files;
    const acceptFiles = ".jpeg,.jpg,.png,.csv,.xls,.pdf,.zip";
    const allowedTypes = acceptFiles.split(",");
    const allowedExtensionsCheck = (fileName: string): boolean => {
      const flType = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length);
      return allowedTypes.includes("." + flType);
    };
    const maxFileUpload = 3;
    let fileRemain: number = maxFileUpload - fileBucket.filter((file) => file).length;

    if (fileRemain <= 0) return;

    for (let i = 0; i < fileRemain; i++) {
      let fileSizeRemain = fileSizePending();
      const file: File = files[i]; // file

      // return if file upload has cancel from file explore
      if (!file) return;

      const fileSize: number = Number(file.size); // current file size

      if (!allowedExtensionsCheck(file.name)) {
        // file is not valid then return function
        setError("Only Document, Image or ZIP file. Max size " + maxFileSize + "MB");
        return;
      }

      if (fileSize > fileSizeRemain) {
        setError("Maximum " + maxFileSize + "MB allowed to upload.");

        fileInputRef.current.value = null;
        fileInputRef.current.files = null;

        return;
      }

      // Here Define Your function to call api for store data
      await uploadFile(i, file);

      const isLastFile = fileRemain - 1 === i;

      if (isLastFile) {
        setTimeout(() => {
          fileInputRef.current.value = null;
          fileInputRef.current.files = null;
        }, 500);
      }
    }
  }
```

### Output Structure
```
handleFileChange(file) // handle Change Event
```