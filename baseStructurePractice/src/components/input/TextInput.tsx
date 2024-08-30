import React, { useState } from 'react';
import { TextInputProps } from 'src/types/component';
import FormClassess from '../../../src/styles/page-styles/Form.module.scss';
import cn from 'classnames';
import { Eye, EyeCrossed } from '@components/icons';

const TextInput = ({ id, label, placeholder, name, type = 'text', onChange, value, error, note, inputIcon, disabled, accept, required = false, maxLength, hidden }: TextInputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<React.Fragment>
			<div className={`${cn(FormClassess['form-group'])} relative`}>
				{label !== undefined && (
					<label htmlFor='password'>
						{label}
						{required && <span className='text-red-700'>*</span>}
					</label>
				)}
				<div className={`${cn(FormClassess['input-group'])} ${inputIcon ? FormClassess['with-icon'] : ''}`}>
					{inputIcon && <div className={cn(FormClassess['input-icon'])}>{inputIcon}</div>}
					<input className={`${cn(FormClassess['form-control'])} ${error ? 'error' : ''} ${disabled ? 'disabled-input' : ''}`} id={id} type={showPassword ? 'text' : type} name={name} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled && true} accept={accept} maxLength={maxLength} hidden={hidden} />
					{type === 'password' && (
						<button className='absolute top-auto right-3 h-full' onClick={() => setShowPassword(!showPassword)}>
							{showPassword ? <Eye /> : <EyeCrossed />}
						</button>
					)}
				</div>
				{error !== undefined && <p className='text-[#FA717E] text-sm'>{error}</p>}
				{note !== undefined && <p className='text-black text-sm font-medium my-1'>{note}</p>}
			</div>
		</React.Fragment>
	);
};

export default React.memo(TextInput);
