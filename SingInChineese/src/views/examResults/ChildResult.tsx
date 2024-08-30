import React, { useCallback, useEffect, useState } from 'react';
import { ColArrType } from 'src/types/common';
import { ArrowSmallLeft, Document } from '@components/icons';
import { childDetailArr, childResult } from '@framework/rest/rest';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@components/button/Button';
import { ROUTES, endPoint } from '@config/constant';

const ChildResult = () => {
	const params = useParams();
	const navigate = useNavigate();

	const [result, setResult] = useState<childResult>();
	const [childDetail, setChildDetail] = useState<childDetailArr>();
	const [loader, setLoader] = useState<boolean>(false);

	const COL_ARR = [
		{
			name: 'Level Number',
			sortable: true,
			fieldName: 'number',
		},
		{
			name: 'Level Name',
			sortable: true,
			fieldName: 'name',
		},
		{
			name: 'Required Percentage',
			sortable: true,
			fieldName: 'requiredPercentage',
		},
		{
			name: 'Percentage',
			sortable: false,
			fieldName: 'percentage',
		},
	] as ColArrType[];

	/**
	 *
	 * @param  Method used for fetching exam List
	 */
	const getChildResult = () => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.examResultDetail}/${params.parentId}/child/${params.childId}/${endPoint.result}`)
			.then((response) => {
				if (response.status === ResponseCode.success || ResponseCode.created) {
					setResult(response?.data?.data?.levels);
					setChildDetail(response?.data?.data?.child);
				} else {
					toast.error(response?.data.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoader(false);
			});
	};

	/**
	 *
	 * @param  Method used for fetching exam List
	 */
	useEffect(() => {
		getChildResult();
	}, []);

	const pageRedirect = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.examResults}/${ROUTES.list}`);
	}, []);

	return (
		<div>
			{loader && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={pageRedirect} title='Back to Result'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' /> Child Results: {childDetail?.fullName}
					</h6>
				</div>
				<div className='p-3 w-full'>
					<div className='overflow-auto w-full'>
						<table>
							<thead>
								<tr>
									{COL_ARR?.map((colVal: ColArrType) => {
										return (
											<th scope='col' key={colVal.name}>
												<div className='flex items-center'>{colVal.name}</div>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody>
								{result?.map((data) => {
									return (
										<tr key={data?.uuid}>
											<td className='w-16 text-center'>{data?.number}</td>
											<td className='font-medium'>{data?.name}</td>
											<td className='w-40 text-center'>{data?.requiredPercentage}</td>
											<td className='w-32 font-semibold text-center'>{data?.percentage < data?.requiredPercentage ? <span className='text-error'>{data?.percentage}</span> : <span className='text-success'>{data?.percentage}</span>}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChildResult;
