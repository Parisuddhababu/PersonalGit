import React from 'react';
import { DropdownProps, DropdownOptionType } from 'src/types/component';
import cn from 'classnames';
import FormClasses from '../../styles/page-styles/Form.module.scss';
import { useTranslation } from 'react-i18next';

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
				<select className={`${cn(FormClasses['form-control'], FormClasses['custom-select'])} ${error ? cn(FormClasses['error']) : ''}`} id={id} onChange={onChange} name={name} value={value} disabled={disabled}>
					{placeholder && (
						<option value={''} disabled>
							{placeholder}
						</option>
					)}
					{options?.map((data: DropdownOptionType, index: number) => {
						return (
							<option value={data.key} key={data.key}>
								{t(data.name as string)}
							</option>
						);
					})}
				</select>
			</div>

			{error && <p className='error '>{t(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
		</div>
	);
};

export default React.memo(Dropdown);
