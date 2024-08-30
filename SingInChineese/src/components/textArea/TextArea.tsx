import React from 'react';
import { TextAreaInputProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';

const TextArea = ({ id, label, placeholder, name, onChange, value, error, note, inputIcon, disabled, maxLength, required = false }: TextAreaInputProps) => {
	return (
		<div className={cn(FormClasses['form-group'])}>
			{label != undefined && (
				<label htmlFor={id}>
					{label} {required && <span className='text-error'>*</span>}
				</label>
			)}
			<div>
				{inputIcon && <div className={`${cn(FormClasses['input-icon'])} ${error ? cn(FormClasses['error']) : ''}`}>{inputIcon}</div>}
				<textarea className={`bg-white appearance-none border rounded w-full py-2 px-3 text-slate-800 focus:border-slate-600 focus:outline-0 ${error ? 'border-error' : 'border-gray-300 '} `} id={id} name={name} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} maxLength={maxLength} />
			</div>
			{error && <p className='text-error mt-2 text-sm'>{error}</p>}
			{note && <small className='text-gray-400 text-sm my-1 block'>{note}</small>}
		</div>
	);
};

export default React.memo(TextArea);
