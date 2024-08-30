import React from 'react';
import { TextInputProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

const TextInput = ({ id, label, placeholder, min, name, required = false, type = 'text', onChange, onBlur, value, error, note, inputIcon, disabled, hidden, loginInput, max, maxLength, className }: TextInputProps) => {
	const { t } = useTranslation();
	return (
		<div className={`${className} ${cn(FormClasses['form-group'])}`}>
			{label != undefined && (
				<label htmlFor='password'>
					{label}
					<span className='text-red-500'>{required === true && ' *'}</span>
				</label>
			)}
			<div className={` ${className} ${cn(FormClasses['input-group'])}  ${inputIcon ? cn(FormClasses['with-icon']) : ''} ${disabled ? 'bg-light-blue rounded-xl overflow-hidden' : ''}`}>
				<input className={`${cn(FormClasses['form-control'])} ${loginInput ? cn(FormClasses['input-login']) : ''} ${error ? cn(FormClasses['error']) : ''} font-base `} id={id} type={type} name={name} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} hidden={hidden} min={min} max={max} maxLength={maxLength} onBlur={onBlur} />
				{inputIcon && <div className={cn(FormClasses['input-icon'])}>{inputIcon}</div>}
			</div>
			{error != undefined && <p className='mt-1 md:text-xs-15 error'>{t(error)}</p>}
			{note != undefined && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
		</div>
	);
};

export default React.memo(TextInput);
