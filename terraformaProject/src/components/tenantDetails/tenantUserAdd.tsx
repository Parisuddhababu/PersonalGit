import { ROUTES } from '@config/constant'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setCustomCreateNewAccountStep } from 'src/redux/courses-management-slice';

interface TenantUserProps {
    companyId: string | null,
    branchId: string | null,
}

function TenantUserAdd({ companyId, branchId }: Readonly<TenantUserProps>) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const addNewBtn = () => {
        dispatch(setCustomCreateNewAccountStep(1));
        navigate(`/${ROUTES.app}/${ROUTES.createNewAccount}/?company_uuid=${companyId}&branch_id=${branchId}&tenant-details-page=true`);
    }

    return (
        <div className='bg-border-secondary px-5 py-5 md:py-[36px] lg:py-[50px] h-full rounded-xl border border-solid border-border-light-blue-shade flex flex-col items-center'>
            <div className='mb-5 md:mb-[30px]'>
                <p className='font-bold text-center'>No employees has been added yet.</p>
                <p className='font-bold text-center'>Please add employees by clicking Add new button.</p>
            </div>
            <button className="btn btn-primary text-white whitespace-nowrap w-[160px] " type="button" onClick={() => addNewBtn()}  
            title='Add New'>Add New</button>
        </div>
    )
}

export default TenantUserAdd
