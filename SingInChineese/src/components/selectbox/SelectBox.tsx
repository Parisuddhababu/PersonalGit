import React from 'react';
import { ISelectBoxOption, SelectBoxProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { generateUuid } from '@utils/helpers';

const SelectBox = ({ id, label, name, value, error, note, options, inputIcon, disabled }: SelectBoxProps) => {
	return (
		<div className={cn(FormClasses['form-group'])}>
			{label != undefined && <label htmlFor='password'>{label}</label>}
			<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
				{inputIcon && <div className={cn(FormClasses['input-icon'])}>{inputIcon}</div>}
				<select className={`${cn(FormClasses['form-control'], FormClasses['custom-select'])} ${error ? 'error' : ''}`} id={id} name={name} value={value} disabled={disabled}>
					{options?.map((list: ISelectBoxOption) => (
						<option key={generateUuid()} value={list.value} disabled={list.disabled}>
							{list.label}
						</option>
					))}
				</select>
			</div>
			{error != undefined && <p className='text-error text-sm'>{error}</p>}
			{note != undefined && <p className='text-black text-sm font-medium my-1'>{note}</p>}
		</div>
	);
};

export default React.memo(SelectBox);
