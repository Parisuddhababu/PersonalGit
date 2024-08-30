import React from 'react';
import { ISelectBoxOption, SelectBoxProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const SelectBox = ({ id, label, name, value, error, note, option, inputIcon, disabled }: SelectBoxProps) => {
	const { t } = useTranslation();
	return (
		<React.Fragment>
			<div className={cn(FormClasses['form-group'])}>
				{label != undefined && <label htmlFor='password'>{label}</label>}
				<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
					{inputIcon && <div className={cn(FormClasses['input-icon'])}>{inputIcon}</div>}
					<select className={`${cn(FormClasses['form-control'], FormClasses['custom-select'])} ${error ? 'error' : ''}`} id={id} name={name} value={value} disabled={disabled}>
						{option?.map((list: ISelectBoxOption, index: number) => (
							<option key={`${index + 1}`} value={list.key} disabled={list?.disabled}>
								{list.name}
							</option>
						))}
					</select>
				</div>
				{error != undefined && <p className='text-red-600 text-sm'>{t(`${error}`)}</p>}
				{note != undefined && <p className='text-black text-sm font-medium my-1'>{note}</p>}
			</div>
		</React.Fragment>
	);
};

export default React.memo(SelectBox);
