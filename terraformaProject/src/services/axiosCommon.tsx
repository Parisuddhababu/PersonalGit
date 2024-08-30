/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import DecryptionFunction from './decryption';

export const APIServices = {
    //get method
    getList(url: string) {
        const encryptedToken = localStorage.getItem('authToken') as string;
        const token = encryptedToken && DecryptionFunction(encryptedToken);
        return axios.get(url, { headers: { authorization: token ? `Bearer ${token}` : '' }, responseType: 'blob' });
    },
    //post method
    postData(url: string, data: any ) {
        return axios.post<any>(url, data);
    },
    //delete method
    delList(url: string) {
        return axios.delete(url);
    },
    //put method
    putData(url: string, data: any) {
        return axios.put(url, data);
    },
};