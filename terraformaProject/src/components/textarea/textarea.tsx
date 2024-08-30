import React from 'react';
import { TextAreaInputProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const TextAreaInput = ({ id, label, placeholder, rows = 4, name, required = false, onChange, onKeyDown, onBlur, value, error, note, disabled, hidden, cols = 50, maxLength, minLength, className }: TextAreaInputProps) => {
	const { t } = useTranslation();
	return (
		<div className={cn(FormClasses['form-group'])}>
			{label != undefined && (
				<label htmlFor={id}>
					{label}
					{required === true && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div>
				<textarea className={`${cn(FormClasses['form-control'])} ${className ? className : ''} ${error ? cn(FormClasses['error']) : ''}`} id={id} name={name} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} hidden={hidden} rows={rows} cols={cols} maxLength={maxLength} minLength={minLength} onBlur={onBlur} onKeyDown={onKeyDown}></textarea>
			</div>
			{error != undefined && error != '' && <p className='mt-1 md:text-xs-15 error'>{t(error)}</p>}
			{note != undefined && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
		</div>
	);
};

export default React.memo(TextAreaInput);
