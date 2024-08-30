import React, { useCallback, useState } from 'react';
import { TextInputProps } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import Button from '@components/button/Button';
import { Eye, EyeCrossed } from '@components/icons';

const TextInput = ({ id, label, placeholder, name, type = 'text', onChange, value, error, note, inputIcon, disabled, accept, min = 0, max, maxLength, required = false, step, hidden = false, keyDown }: TextInputProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const showPasswordHandler = useCallback(() => {
		setShowPassword(!showPassword);
	}, [showPassword]);
	return (
		<div className={cn(FormClasses['form-group'])}>
			{label != undefined && (
				<label htmlFor={id}>
					{label} {required && <span className='text-error'>*</span>}
				</label>
			)}
			<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
				{inputIcon && <div className={`${cn(FormClasses['input-icon'])} ${error ? cn(FormClasses['error']) : ''}`}>{inputIcon}</div>}
				<input className={`${cn(FormClasses['form-control'])} ${error ? cn(FormClasses['error']) : ''} ${showPassword ? cn(FormClasses['password-shown']) : ''}`} id={id} type={showPassword ? 'text' : type} name={name} placeholder={placeholder} accept={accept} onChange={onChange} value={value} disabled={disabled} min={type === 'number' || 'date' ? min : ''} onKeyDown={keyDown} max={type === 'number' || 'date' ? max : ''} maxLength={maxLength} step={step} hidden={hidden} />
				{type === 'password' && (
					<Button className='absolute right-0 h-full' onClick={showPasswordHandler}>
						{showPassword ? <Eye /> : <EyeCrossed />}
					</Button>
				)}
			</div>
			{error && <p className='text-error mt-2 text-sm'>{error}</p>}
			{note && <small className='text-gray-400 text-sm my-1 block'>{note}</small>}
		</div>
	);
};

export default React.memo(TextInput);
