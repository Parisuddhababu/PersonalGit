import React from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import Button from '@components/button/button';
import { Download, Layout, Sorting } from '@components/icons/icons';
import { useQuery } from '@apollo/client';
import { GET_ITEM_BY_CATEGORIES_PAGINATION } from '@framework/graphql/queries/userManual';
import { getSignUrl, IMAGE_BASE_URL, PAGE_LIMIT, PAGE_NUMBER, ROUTES } from '@config/constant';
import UpdatedHeader from '@components/header/updatedHeader';
import { useTranslation } from 'react-i18next';

const TechnicalManualGrid = () => {
    const { id: subCategoryId } = useParams();
    const { data } = useQuery(GET_ITEM_BY_CATEGORIES_PAGINATION, { variables: { limit: PAGE_LIMIT, page: PAGE_NUMBER, sortField: 'createdAt', sortOrder: 'descend', search: '', itemCategoryId: subCategoryId } });
    const navigate = useNavigate();
    const { t } = useTranslation();
    function handleOpenEmployeeDetailsList() {
        navigate(`/${ROUTES.app}/${ROUTES.itemByCategory}/${ROUTES.itemByCategoryList}/${subCategoryId}`);
    }
    return (
        <>
            <UpdatedHeader headerTitle='User Manuals' />
            <div className="p-5 my-5 overflow-auto border border-solid rounded-xl border-border-primary">
                <div className='flex flex-wrap items-center justify-between gap-3 mb-5 md:gap-5'>
                <h6>{t('Walmart Employee Details')}</h6>
                    <div className="flex flex-wrap w-full gap-3 md:flex-nowrap md:gap-5 md:w-auto">
                        <Button className='w-full btn btn-secondary btn-normal md:w-[50px]' onClick={handleOpenEmployeeDetailsList} label={''} title=''>
                            <Layout className='order-2' fontSize='18' />
                        </Button>
                        <Button className='w-full btn btn-primary md:w-[50px]' type='submit' label={''} title=''>
                            <Sorting className='order-2 fill-white' fontSize='18' />
                        </Button>
                    </div>
                </div>
                <div className='flex flex-wrap gap-5 '>
                    {data?.getItemByCategoriesPagination?.data?.itemByCategories?.map(
                        (data: { url: string, name: string, uuid: string,image: string }) => {                            
                            return (
                                <div className='w-full lg:w-[calc(50%-14px)] xl:w-[calc(33.3%-14px)] 3xl:w-[calc(25%-15px)] border border-solid border-border-primary rounded-xl overflow-hidden' key={data.uuid}>                                   
                                    <div className='flex flex-wrap items-center justify-between gap-2 pb-2.5'>
                                        <div className='flex'>                                            
                                            <span className='text-xl-26 md:text-xl-28'>
                                                <img className='fill-error' src={IMAGE_BASE_URL + data.image} />
                                            </span>
                                        </div>
                                        <div className='flex justify-between content-center w-full px-4'>                                            
                                            <span className='w-full overflow-hidden truncate'>{data.name}</span>
                                            <a download={true} className='cursor-pointer' target="_blank" rel="noreferrer"
                                               onClick={async () => {
                                                const url = await getSignUrl(data.url)
                                                fetch(url).then(response => {
                                                    response.blob().then(blob => {
                                                        const fileURL = window.URL.createObjectURL(blob);
                                                        const alink = document.createElement('a');
                                                        alink.href = fileURL;
                                                        alink.download = data?.name;
                                                        alink.click();
                                                    })
                                                })
                                            }}
                                            >
                                                <span className='text-base md:text-lg'><Download className='fill-primary' /></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </>
    );
};
export default TechnicalManualGrid;
