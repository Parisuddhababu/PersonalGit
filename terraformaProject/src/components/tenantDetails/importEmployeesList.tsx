import React, { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import {  importEmployeeList } from '@config/common';
import RejectedUserPopup from './rejectedUserPopup';
interface ImportEmployeesProps {
    companyId: string | null,
    branchId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onImportCallBack: any
}

interface RejectedUserType {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role: string,
    reason: string
}

function ImportEmployeesList ({ companyId, branchId, onImportCallBack }: Readonly<ImportEmployeesProps>) {
    
    const fileEmployeeInputRef = useRef<HTMLInputElement | null>(null);
    const { t } = useTranslation();
    const [rejectedEmployeePopup, setRejectedEmployeePopup] = useState<boolean>(false);
    const [isImportEmployeeFiles, setIsEmployeeImportFiles] = useState<boolean>(false);
    const [rejectedEmployeeData, setRejectedEMployeeData] = useState<{ successCount: number; rejectCount: number; totalCount: number; rejectedUsers: RejectedUserType[] }>({ successCount: 0, rejectCount: 0, totalCount: 0, rejectedUsers: [] });
    

    const onImportEmployeeList = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEmployeeImportFiles(false)
        const files = event.currentTarget.files;
        await importEmployeeList({
            files,
            companyId,
            branchId,
            onImportCallBack,
            setRejectedUserPopup: setRejectedEmployeePopup,
            setRejectedUsersData: setRejectedEMployeeData
        }) 
        
        if (fileEmployeeInputRef.current) {
            fileEmployeeInputRef.current.value = '';
        }
    }, [companyId, branchId]);

    const onEmployeeCancel = () => {
        setIsEmployeeImportFiles(false)
        setRejectedEmployeePopup(false);
    }
    const onEmployeeImport = useCallback(() => {
        setIsEmployeeImportFiles((prev) => !prev)
    }, [isImportEmployeeFiles])

    return (
        <>
            <div className='bg-border-secondary px-5 py-5 md:py-[36px] lg:py-[50px] h-full rounded-xl border border-solid border-border-light-blue-shade flex flex-col items-center'>
                <div className='mb-5 md:mb-[30px]'>
                    <p className='font-bold text-center'>You can import your employees details by clicking import button.</p>
                    <p className='font-bold text-center'>It supports CSV format.</p>
                </div>
                <Button className='btn btn-primary text-white whitespace-nowrap w-[220px]' type='button' label={'Import Employees List'} onClick={() => onEmployeeImport()} title='Import Employee List' />
            </div>
            <RejectedUserPopup 
                rejectedUserPopup={rejectedEmployeePopup}
                rejectedUsersData={rejectedEmployeeData}
                oncancel={onEmployeeCancel} 
            />
            
            {isImportEmployeeFiles && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isImportEmployeeFiles ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${isImportEmployeeFiles ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
                        <div className='w-full mx-5 sm:max-w-[640px]'>
                            <div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
                                
                                <h6 className='mb-6 font-bold leading-normal text-center md:mb-10'>{t('Before you upload the list, the roles should be created')}</h6>
                                <div className='flex items-center justify-center space-x-5 md:flex-row'>
                                    <label id='importCsv' className="btn btn-primary btn-normal w-full md:w-auto md:min-w-[160px] mb-0">
                                        Okay
                                        <input
                                            id='importCsv'
                                            type="file"
                                            name='importCsv'
                                            multiple
                                            ref={fileEmployeeInputRef}
                                            className='hidden focus:bg-transparent'
                                            accept=".csv"
                                            onChange={(e) => onImportEmployeeList(e)}
                                            key={uuidv4()}
                                        />
                                    </label>
                                    
                                    <Button className='btn-secondary btn-normal w-full md:w-auto md:min-w-[160px]' label={t('Cancel')} onClick={oncancel} title={`${t('Cancel')}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ImportEmployeesList
