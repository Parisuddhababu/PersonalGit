import React, { ReactElement } from 'react';
import { TextInputProps } from '@type/component';
import FormClassess from '@pageStyles/Form.module.scss';
import '@pageStyles/PlanManagement.scss';
import Button from '@components/button/button';
import { Eye, EyeCrossed } from '@components/icons/icons';

const TextInput = ({addPlanClass, btnShowHide, btnShowHideFun, id, label, placeholder, min, name, required = false, type = 'text', onChange, onKeyDown, onBlur, value, error, note, inputIcon, disabled, hidden, loginInput, max, maxLength, minLength, pattern, password, className }: TextInputProps): ReactElement => {

	return (
		<div className={`${FormClassess['form-group']} ${addPlanClass ? addPlanClass : ''}`}>
			{label && (
				<label htmlFor={id}>
					{(label)}
					{required === true && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div className='relative'>
				<div className={` ${FormClassess['input-group']}  ${inputIcon ? FormClassess['with-icon'] : ''}`}>
					{inputIcon && <div className={FormClassess['input-icon']}>{inputIcon}</div>}
					<input autoComplete='new-Password' className={`${FormClassess['form-control']} ${className ? className : ''} ${loginInput ? FormClassess['input-login'] : ''} ${password ? FormClassess['input-password'] : ''}  ${error ? FormClassess['error'] : ''}`} id={id} type={type} name={name} placeholder={placeholder} onChange={onChange} value={value} disabled={disabled} hidden={hidden} min={min} max={max} maxLength={maxLength} minLength={minLength} onBlur={onBlur} pattern={pattern} onKeyDown={onKeyDown} />
				</div>

				{password && (
					<Button className='absolute right-1 top-1' onClick={btnShowHideFun}>
						{btnShowHide ? (
							<span className='svg-icon inline-block text-black-400 w-3.5 h-3.5'>
								<Eye />
							</span>
						) : (
							<span className='svg-icon inline-block text-black-400 w-3.5 h-3.5'>
								<EyeCrossed />
							</span>
						)}
					</Button>
				)}
			</div>
			{error && error != '' && <p className='error '>{(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{(note)}</p>}
		</div>
	);
};

export default React.memo(TextInput);
