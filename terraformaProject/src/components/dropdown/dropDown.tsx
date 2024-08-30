import React from 'react';
import { DropdownProps, DropdownOptionType } from 'src/types/component';
import cn from 'classnames';
import FormClasses from '@pageStyles/Form.module.scss';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
const Dropdown = ({ id, placeholder, name, onChange, options, label, error, value, inputIcon, disabled, note, className, required = false }: DropdownProps) => {
	const { t } = useTranslation();
	return (
		<div className={`${className} ${cn(FormClasses['form-group'])}`}>
			{label != undefined && (
				<label htmlFor={name}>
					{label} {required && <span className='text-error'> *</span>}
				</label>
			)}
			<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
				<select className={`${cn(FormClasses['form-control'], FormClasses['custom-select'])} ${inputIcon ? 'cus-icon bg-white' : ''} ${error ? cn(FormClasses['error']) : ''}`} id={id} onChange={onChange} name={name} value={value} disabled={disabled}>
					{placeholder && (
						<option value={''} disabled>
							{placeholder}
						</option>
					)}
					{options?.map((data: DropdownOptionType) => {
						return (
							<option value={data.key} key={uuidv4()}>
								{t(data.name as string)}
							</option>
						);
					})}
				</select>
					{inputIcon && <div className={cn(FormClasses['input-icon'])}>{inputIcon}</div>}
			</div>

			{error && <p className='mt-1 error md:text-xs-15'>{t(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
		</div>
	);
};

export default React.memo(Dropdown);
