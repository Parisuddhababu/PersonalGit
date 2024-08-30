import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { ColArrType } from '@types';
import { v4 as uuidv4 } from 'uuid';
import { Cross } from '@components/icons/icons';
import { importEmployeeList } from '@config/common';

interface VendorEmployeesProps {
    companyId: string | null,
    locationId: string | null,
    onImportCallBack: any
}

interface RejectedUserType {
    uuid: string,
    first_name: string,
    last_name: string,    
    email: string,
    phone_number: string,
    role: string,
    reason: string,
}

function ImportVendorEmployeesList({ companyId, locationId, onImportCallBack }: Readonly<VendorEmployeesProps>) {
    const { t } = useTranslation();
    const vendorFileInputRef = useRef<HTMLInputElement | null>(null);
    const [rejectedVendorUserPopup, setRejectedVendorUserPopup] = useState<boolean>(false);
    const [rejectedVendorUsersData, setRejectedVendorUsersData] = useState<{successCount: number;rejectCount: number; totalCount: number;rejectedUsers:RejectedUserType[]}>({successCount: 0,rejectCount: 0, totalCount: 0, rejectedUsers: [] });
    const COL_ARR_REJECT_IMPORT_VENDOR_USER = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('First Name'), sortable: true, fieldName: 'first_name' },
		{ name: t('Last Name'), sortable: true, fieldName: 'last_name' },
		{ name: t('email'), sortable: true, fieldName: 'email' },
		{ name: t('Phone Number'), sortable: true, fieldName: 'phone_number' },
		{ name: t('Role'), sortable: true, fieldName: 'role' },
        { name: t('Reason'), sortable: true, fieldName: 'reason' },
	] as ColArrType[];
    const [isVendorImportFiles, setIsVendorImportFiles] = useState<boolean>(false);
    const onImportVendorEmployeeList = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsVendorImportFiles(false);
        const files = event.currentTarget.files;    
        await importEmployeeList({
            files,
            companyId,
            branchId: locationId,
            onImportCallBack,
            setRejectedUserPopup: setRejectedVendorUserPopup,
            setRejectedUsersData: setRejectedVendorUsersData,
			employeeType: '2'
        }) 
    }, [companyId, locationId]);

    const oncancel = () => {
        setIsVendorImportFiles(false)
        setRejectedVendorUserPopup(false);
    }
    const onImport = useCallback(() => {
        setIsVendorImportFiles(prev=>!prev)
    }, [isVendorImportFiles])

    return (
        <>
            <div className='w-full lg:w-[calc(50%-10px)] h-full bg-border-secondary p-5 min-h-[227px] justify-center rounded-xl border border-solid border-border-light-blue-shade flex flex-col items-center'>
                <div className='mb-[30px]'>
                    <p className='font-bold text-center'>{t('You can import your employees details by clicking import button.')}</p>
                    <p className='font-bold text-center'>{t('It supports CSV format.')}</p>
                </div>
                <Button className='btn btn-primary text-white whitespace-nowrap w-[220px]' type='button' label={'Import Employees List'} onClick={() => onImport()}  title={`${t('Import Employee List')}`} />
            </div>
            {rejectedVendorUserPopup && (
				<div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${rejectedVendorUserPopup ? '' : 'hidden'}`}>
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${rejectedVendorUserPopup ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[1200px]'>
							<div className='relative bg-white rounded-xl'>
								{/* <!-- Modal header --> */}
								<div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
									<p className='text-lg font-bold md:text-xl text-baseColor'>{'Uploaded Employee Details'}</p>
									<Button onClick={() => oncancel()} label=''  title={`${t('Close')}`}>
										<span className='text-xl-22'><Cross className='text-error' /></span>
									</Button>
								</div>
								{/* <!-- Modal body --> */}
                                <div className='flex flex-wrap justify-center gap-3 p-5 md:gap-10'>
                                    <p className='font-bold max-md:px-5'>Total User: <span className='font-regular'>{rejectedVendorUsersData.totalCount}</span></p>
                                    <p className='font-bold text-success max-md:px-5'>Success User: <span className='font-regular'>{rejectedVendorUsersData.successCount}</span></p>
                                    <p className='font-bold text-error max-md:px-5'>Rejected User: <span className='font-regular'>{rejectedVendorUsersData.rejectCount}</span></p>
                                </div>
                                <div className='flex items-center justify-between px-5'>
									<p className='text-lg font-bold md:text-xl text-baseColor'>{'Rejected Employee List'}</p>
								</div>
								<div className='w-full p-5 max-h-[calc(100vh-260px)] overflow-auto'>
									<div className="overflow-auto custom-dataTable">
										<table>
											<thead>
												<tr>
													{COL_ARR_REJECT_IMPORT_VENDOR_USER?.map((colVal: ColArrType, index: number) => {
														return (
															<th
																scope="col"
																className={'whitespace-nowrap'}
																key={`${index + 1}`}
															>
																<div
																	className='flex items-center'
																>
																	{colVal.name}
																</div>
															</th>
														);
													})}
												</tr>
											</thead>
											<tbody>
												{rejectedVendorUsersData.rejectedUsers?.map(
													(data: RejectedUserType, index: number) => {
														return (
															<tr key={data?.uuid}>
																<td className="text-left pl-7" scope="row">
																	{index + 1}
																</td>
																<td className="text-left">{data?.first_name}</td>
																<td className="text-left">{data?.last_name}</td>
																<td className="text-left">{data?.email}</td>
																<td className="text-left">{data?.phone_number}</td>
																<td className="text-left">{data?.role}</td>
																<td className="text-left min-w-[300px]">{data?.reason}</td>
															</tr>
														);
													}
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
            {isVendorImportFiles && (
                <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${isVendorImportFiles ? '' : 'hidden'}`}>
                    <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${isVendorImportFiles ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
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
                                            ref={vendorFileInputRef}
                                            className='hidden focus:bg-transparent'
                                            accept=".csv"
                                            onChange={(e) => onImportVendorEmployeeList(e)}
                                            key={uuidv4()}
                                        />
                                    </label>
                                    
                                    <Button className='btn-secondary btn-normal w-full md:w-auto md:min-w-[160px]' label={t('Cancel')} onClick={oncancel}  title={`${t('Cancel')}`}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ImportVendorEmployeesList
