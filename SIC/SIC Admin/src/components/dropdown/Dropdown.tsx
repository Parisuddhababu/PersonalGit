import React from 'react';
import { DropdownProps, DropdownOptionType } from 'src/types/component';
import cn from 'classnames';
import FormClasses from '@pageStyles/Form.module.scss';

const Dropdown = ({ id, placeholder, name, onChange, options, label, error, value, inputIcon, disabled, note, className, required = false, disableOption }: DropdownProps) => {
	return (
		<div className={`${className} ${cn(FormClasses['form-group'])}`}>
			{label != undefined && (
				<label htmlFor={name}>
					{label} {required && <span className='text-error'>*</span>}
				</label>
			)}
			<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
				<select className={`${cn(FormClasses['form-control'], FormClasses['custom-select'])} ${error ? cn(FormClasses['error']) : ''} ${value === '' ? cn(FormClasses['no-selection']) : ''}`} id={id} onChange={onChange} name={name} value={value} disabled={disabled}>
					{placeholder && (
						<option value={''} disabled>
							{placeholder}
						</option>
					)}
					{options?.map((data: DropdownOptionType, index: number) => {
						return (
							<option hidden={disableOption === data.key} value={data.key} key={`${index + 1}`}>
								{data.name}
							</option>
						);
					})}
				</select>
			</div>

			{error && <p className='text-error text-sm mt-2'>{error}</p>}
			{note && <p className='text-black text-sm font-medium my-1'>{note}</p>}
		</div>
	);
};

export default React.memo(Dropdown);
