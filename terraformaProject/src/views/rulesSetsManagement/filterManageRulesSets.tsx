import React, { useCallback } from 'react';
import { RulesSetsProps, FilterDataArrRulesProps } from 'src/types/manageRulesSets';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import Dropdown from '@components/dropdown/dropDown';
import { STATUS_DRP } from '@config/constant';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';

const FilterManageRulesSets = ({ onSearchManageRulesSets,clearSelectionRuleSets }: RulesSetsProps) => {
	const { t } = useTranslation();

	const initialValues: FilterDataArrRulesProps = {
		ruleName: '',
		RulesStatus: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionRuleSets()
			onSearchManageRulesSets(values);
		},
	});

	const onResetRules = useCallback(() => {
		formik.resetForm();
		onSearchManageRulesSets(initialValues);
	}, []);
	return (
		<React.Fragment>
			<form className=' w-full md:w-auto bg-white shadow-lg rounded-sm p-5 mb-5 border border-[#c8ced3]  ' onSubmit={formik.handleSubmit}>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
					<div className='md:mb-4 '>
						<TextInput placeholder={t('Rule Name')} name='ruleName' type='text' onChange={formik.handleChange} value={formik.values.ruleName} />
					</div>
					<div className='md:mb-4'>
						<Dropdown placeholder={t('Select Status')} name='RulesStatus' onChange={formik.handleChange} value={formik.values.RulesStatus} options={STATUS_DRP} id='status' />
					</div>
					<div className='md:mb-4'>
						<div className='btn-group  flex items-start justify-end '>
							<Button className='btn-primary btn-normal' type='submit' label={t('Search')}  title={`${t('Search')}`} >
								{' '}
								<Search />
							</Button>
							<Button className='btn-warning btn-normal' onClick={onResetRules} label={t('Reset')}  title={`${t('Reset')}`} >
								{' '}
								<Refresh />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterManageRulesSets;
