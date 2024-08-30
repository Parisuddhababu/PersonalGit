import React from 'react';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import { ColArrType } from '@types';
import { COL_ARR_REJECT_IMPORT_USER } from '@config/constant';

interface RejectedUserType {
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role: string,
    reason: string
}

function rejectUserPopUp ({
    rejectedUserPopup,
    rejectedUsersData,
    oncancel
}: {
    rejectedUserPopup: boolean;
    rejectedUsersData: {
        totalCount: number;
        successCount: number;
        rejectCount: number;
        rejectedUsers: RejectedUserType[]
    };
    oncancel: any
}) {
    return (
        <>
            {rejectedUserPopup && (
            <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${rejectedUserPopup ? '' : 'hidden'}`}>
                <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${rejectedUserPopup ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                    <div className='w-full mx-5 sm:max-w-[1200px]'>
                        <div className='relative bg-white rounded-xl'>
                            <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                                <p className='text-lg font-bold md:text-xl text-baseColor'>{'Uploaded Employee Details'}</p>
                                <Button onClick={() => oncancel()} label='' title='Close'>
                                    <span className='text-xl-22'><Cross className='text-error' /></span>
                                </Button>
                            </div>
                            <div className='flex flex-wrap justify-center gap-3 p-5 md:gap-10'>
                                <p className='font-bold max-md:px-5'>Total User: <span className='font-regular'>{rejectedUsersData.totalCount}</span></p>
                                <p className='font-bold text-success max-md:px-5'>Success User: <span className='font-regular'>{rejectedUsersData.successCount}</span></p>
                                <p className='font-bold text-error max-md:px-5'>Rejected User: <span className='font-regular'>{rejectedUsersData.rejectCount}</span></p>
                            </div>
                            <div className='flex items-center justify-between px-5'>
                                <p className='text-lg font-bold md:text-xl text-baseColor'>{'Rejected Employee List'}</p>
                            </div>
                            <div className='w-full p-5 max-h-[calc(100vh-260px)] overflow-auto'>
                                <div className="overflow-auto custom-dataTable">
                                    <table>
                                        <thead>
                                            <tr>
                                                {COL_ARR_REJECT_IMPORT_USER?.map((colVal: ColArrType, index: number) => {
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
                                            {rejectedUsersData.rejectedUsers?.map(
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
        </>
    )
}


export default rejectUserPopUp;