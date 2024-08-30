/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUrl, PAGE_LIMIT, PAGE_NUMBER, ROUTES } from '@config/constant';
import { GET_CHILD_CATEGORIES_DROPDOWN } from '@framework/graphql/queries/userManual';
import { useQuery } from '@apollo/client';
import UpdatedHeader from '@components/header/updatedHeader';


const TechnicalManualsAndGuidesComponent = () => {
    const navigate = useNavigate();
    const { data } = useQuery(GET_CHILD_CATEGORIES_DROPDOWN, {
        variables: {
            limit: PAGE_LIMIT,
            page: PAGE_NUMBER,
            sortField: 'createdAt',
            sortOrder: 'descend',
            search: '',
        },
    });

    const HandleUserManual = useCallback((uuid: string, name: string) => {
        navigate(`/${ROUTES.app}/${ROUTES.itemByCategory}/${ROUTES.itemByCategoryList}/${uuid}?guide_name=${name}`);
    }, []);

    return (
        <>
            <UpdatedHeader headerTitle='All Manuals & Guides' />
            <div className='p-3 my-5 border border-solid md:p-5 border-border-primary rounded-xl'>
                <div className='mb-3 md:mb-5 last:mb-0'>
                    {data?.getManualCategories?.data?.manualCategories?.map((item: { name: string,children:[{image_url:string}] }) => {
                        if (item?.children?.length > 0) {
                            return (
                                <div className='mb-3 md:mb-5 last:mb-0' key={data.uuid}>
                                    <h6 className='mb-2'>{item.name}</h6>
                                    <div className='flex flex-wrap gap-3 md:gap-5'>
                                        {item.children.map((children: any,index:number) => {
                                            const imageUrl = children.image_url.startsWith(ImageUrl)
                                                ? children.image_url
                                                : `${ImageUrl}/${children.image_url}`;
                                            return (
                                                <div key={`${index+1}`} className='min-h-[230px] xl:min-h-[264px] max-h-[264px] w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2 cursor-pointer' onClick={() => HandleUserManual(children.uuid, item.name)}>                                                
                                                    <div className='py-2 h-[180px]'><img className='object-contain h-full mx-auto mt-auto' src={imageUrl} alt="User Manual" /></div>
                                                    <p className='w-full mt-auto text-base font-bold text-center truncate md:text-lg'>{children.name}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    );
};
export default TechnicalManualsAndGuidesComponent;
