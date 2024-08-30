import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import { GET_ALL_DIVERSION_TEMPLATE } from '@framework/graphql/queries/createDiversionReport';
import { ColArrType } from '@types';
import React, { useCallback,  useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DiversionContractorType, setCreateDiversionReportTableViewData, setIsOpenDiversionTemplateSelectionPopup, setSelectedTemplateIds } from 'src/redux/diversion-contractor-slice';
import { AddtimeSetData, SetTableviewType } from 'src/types/diversionContractors';


const AddServiceFromTemplate = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const contractorsDetails = useSelector(((state: { diversionContractors: DiversionContractorType }) => state.diversionContractors));
    const { data,loading } = useQuery(GET_ALL_DIVERSION_TEMPLATE,{
        fetchPolicy:'network-only',skip:!contractorsDetails?.locationId, variables:{
            locationId: contractorsDetails?.locationId
        }
    });
    const [state, setState] = useState<AddtimeSetData[]>([]);
    const COL_ARR_SERVICE = [
        { name: t('Service Type'), sortable: false },
        { name: t('Material Category'), sortable: false, fieldName: 'Material Category' },
        { name: t('Material Type'), sortable: false, fieldName: 'Material Type' },
        { name: t('Equipment'), sortable: false, fieldName: 'Equipment' },
        { name: t('Volume'), sortable: false, fieldName: 'Volume' },
    ] as ColArrType[];
    const onChecked = (data: SetTableviewType) => {
        const dataReq :AddtimeSetData= {
            diversion_report_template: {
                uuid: data?.uuid,
                equipment: data?.equipment,
                material: data?.material,
                material_type:  data?.material_type,
                service_type: data?.service_type,
                volume:  data?.volume,
                location:data?.location,
            },
            add_units: 0,
            contractor_company:{
                uuid:'',
                name:''
            },
            frequency:{frequency:null,frequency_type:'',uuid:''},
            subscriber: data?.subscriber,
            user: {
                first_name:'',
                last_name:'',
                uuid:''
            } ,
            zone: {
                location: '',
                uuid:''
            },
            uuid: '',
            is_full_site: false
        }
        setState((prev) => {
            if(!prev.find((data)=>data?.diversion_report_template?.uuid===dataReq?.diversion_report_template?.uuid)){
                return [...prev, dataReq];
            }else{
                return prev.filter((data)=>data?.diversion_report_template?.uuid!==dataReq?.diversion_report_template?.uuid)
            }
        })
    }
    
    const onSubmit = useCallback(() => {
        dispatch(setSelectedTemplateIds(state?.map((data)=>{
            return data?.diversion_report_template?.uuid;
        })))
        dispatch(setCreateDiversionReportTableViewData(state));
        dispatch(setIsOpenDiversionTemplateSelectionPopup(false));
    }, [state])

    return (<div>
        <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={' fixed top-0 left-0 right-0 z-50 h-full bg-modal modal'}>
            <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className="flex items-center justify-center h-full py-5 transition-all duration-300">
                <div className='w-full mx-5 sm:max-w-[780px] '>
                    {/* <!-- Modal content --> */}
                    <div className='relative bg-white rounded-xl'>
                        {/* <!-- Modal header --> */}
                        <div className='flex items-center justify-between px-5 py-4 border-b md:py-6 bg-accents-2 rounded-t-xl'>
                            <p className='text-lg font-bold md:text-xl text-baseColor'>Add New Service</p>
                            <Button onClick={() => dispatch(setIsOpenDiversionTemplateSelectionPopup(false))} label={t('')}>
                                <span className='text-xl-22'><Cross className='text-error' /></span>
                            </Button>
                        </div>
                        <div className='mb-3 bg-white rounded-xl overflow-y-auto max-h-[300px] mx-7 p-3 md:p-5'>
                            <div className='w-full mb-3 overflow-auto bg-white border sm:w-auto rounded-t-xl custom-dataTable border-border-primary'>
                                <table>
                                    <thead >
                                        <tr>
                                            {COL_ARR_SERVICE?.map((colValUser: ColArrType) => {
                                                return (
                                                    <th scope='col' key={crypto.randomUUID()}>
                                                        <div className={`flex items-center ${colValUser.name == 'Status' ? 'justify-center' : ''}`}>
                                                            {colValUser.name}

                                                        </div>
                                                    </th>
                                                );
                                            })}
                                            <th scope='col'>
                                                <div className='flex items-center'>{t('Action')}</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {loading && 
                                    <tr>

                                    <div className=' flex justify-center  p-4'>
                                         <div className='w-7 h-7 mx-auto rounded-[50%] border-solid border-4 border-[#E8E8EA] border-r-[#2575d6] animate-spin  z-[9999]'></div>
                                        </div>
                                    </tr>
                                     } 
                                        {data?.getAllDiversionTemplates?.data?.map((data:SetTableviewType ) => {
                                            return (
                                                <tr key={data?.uuid}>
                                                    <td className='text-left'>{data?.service_type}</td>
                                                    <td className='text-left'>{data?.material?.name}</td>
                                                    <td className='text-left'>{data?.material_type?.type}</td>
                                                    <td className='text-left'>{data?.equipment?.name}</td>
                                                    <td className='text-left'>{data?.volume?.volume}</td>
                                                    <td className='text-left'>
                                                        <div className='btn-group'>
                                                            <input type='checkbox' onClick={() => onChecked(data)} />
                                                        </div>
                                                    </td>
                                                </tr>)
                                        })}
                                    </tbody>
                                </table>
                                        {(data?.getAllDiversionTemplates?.data?.length===null||data?.getAllDiversionTemplates?.data?.length===undefined)&&(
                                    <div className='flex justify-center'>
                                        <div>{t('No Data')}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-end p-5 border-t border-solid md:space-x-3 md:flex-row border-border-primary'>
                            {<Button label='Add' className={'btn-primary btn-normal w-full md:w-auto min-w-[160px]'} type='submit' onClick={onSubmit} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    );

}

export default AddServiceFromTemplate;