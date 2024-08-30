import React, { useEffect, useState } from 'react';
import { Loader } from '@components/index';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResponseCode } from 'src/interfaces/enum';
import './cms.scss';

type PageContent = {
	title: string;
	description: string;
	slug: string;
	isTerms: boolean;
	isPrivacy: boolean;
	bottomLink: {
		privacyLink: string;
		termsAndConditions: string;
	};
};

const CMSPage = () => {
	const params = useParams();
	const [data, setData] = useState<PageContent>();
	const [loader, setLoader] = useState<boolean>(false);
	useEffect(() => {
		setLoader(true);
		APIService.getData(`${URL_PATHS.pages}/${params.slug}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					setData(response?.data.data);
				} else {
					toast.error(response?.data?.message);
				}
				setLoader(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoader(false);
			});
	}, []);
	return (
		<div className='p-3 cms-page'>
			{loader && <Loader />}
			<div dangerouslySetInnerHTML={{ __html: data?.description as string }} />
		</div>
	);
};

export default CMSPage;
