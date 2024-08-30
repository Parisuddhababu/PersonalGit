import DecryptionFunction from 'src/services/decryption';
import { API_BASE_URL, MAX_FILE_SIZE } from './constant';
import { toast } from 'react-toastify';
import axios from 'axios';
export const getToken = async () => {
    const encryptedToken = await localStorage.getItem('authToken') as string;     
    return encryptedToken && await DecryptionFunction(encryptedToken);
}

export const importEmployeeList = async ({
  files,
  companyId,
  branchId,
  onImportCallBack,
  setRejectedUserPopup,
  setRejectedUsersData,
  employeeType
}: any) => {
  try {
      if (files) {
        const allowedExtensions = ['csv'];
        const maxFileSize = MAX_FILE_SIZE;
        const selectedFiles = Array.from(files);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validFiles = selectedFiles.filter((file: any) => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            const fileSize = file.size;
            if (!allowedExtensions.includes(extension)) {
                toast.error(`Invalid file type: ${file.name}`);
                return false;
            }
            if (fileSize > maxFileSize) {
                toast.error('Please make sure your file is must be less than 5MB.');
                return false;
            }
            return true;
        });
        if (validFiles.length > 0) {
           await csvImport({
            companyId,
            branchId,
            onImportCallBack,
            setRejectedUserPopup,
            setRejectedUsersData,
            employeeType,
            validFiles
           })            
        } else {
            toast.error('Invalid file type Please enter valid attachment');
        }
    }
  } catch(err){
  }
}
export const csvImport = async({
  companyId,
  branchId,
  onImportCallBack,
  setRejectedUserPopup,
  setRejectedUsersData,
  validFiles,
  employeeType
}: any) => {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData.append('file', validFiles[0] as any);
  formData.append('location_id', branchId);
  if(employeeType === '3') {
    await employeeImportCSV({formData,onImportCallBack,setRejectedUserPopup,setRejectedUsersData});
  } else {
    formData.append('company_id', companyId as string);           
    formData.append('type', employeeType || '1')             
    await userImportCSV({formData,onImportCallBack,setRejectedUserPopup,setRejectedUsersData})  
  }
}
export const userImportCSV = async({
  formData,onImportCallBack,setRejectedUserPopup,setRejectedUsersData
}: any) => {
  try{
    const token = await getToken();
    // Attempt to upload the attachment
    onImportCallBack(true)
    axios.post(`${API_BASE_URL}users/import-csv`, formData, { headers: { authorization: `Bearer ${token}` } })
        .then((response) => {
            onImportCallBack(false)
            if (response?.data?.data?.rejectedUsers?.length > 0) {
                setRejectedUserPopup(true);
                setRejectedUsersData(response?.data?.data)
            }
            toast.success(response?.data?.message);
        })
        .catch((err) => {
            onImportCallBack(false)
            toast.error(err?.message);
        });
  } catch(err){}
}

export const employeeImportCSV = async({
  formData,onImportCallBack,setRejectedUserPopup,setRejectedUsersData
}: any) => {
  try{
    const token = await getToken();
    // Attempt to upload the attachment
    onImportCallBack(true)
    axios.post(`${API_BASE_URL}users/import-employee-user-csv`, formData, { headers: { authorization: `Bearer ${token}` } })
        .then((response) => {
            onImportCallBack(false)
            if (response?.data?.data?.rejectedUsers?.length > 0) {
                setRejectedUserPopup(true);
                setRejectedUsersData(response?.data?.data)
            }
            toast.success(response?.data?.message);
        })
        .catch((err) => {
            onImportCallBack(false)
            toast.error(err?.message);
        });
  } catch(err){}
}