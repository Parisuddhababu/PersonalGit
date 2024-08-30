import React from 'react';
import { TDatePicker } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';

const DatePicker = ({ id, label, name, type = 'date', onChange, value, error, note, inputIcon, min, max }: TDatePicker) => {
	return (
		<React.Fragment>
			<div className={cn(FormClasses['form-group'])}>
				{label != undefined && <label htmlFor='date'>{label}</label>}
				<div className={`${cn(FormClasses['input-group'])} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
					{inputIcon && <div className={cn(FormClasses['input-icon'])}>{inputIcon}</div>}
					<input className={`${cn(FormClasses['form-control'])} ${error ? 'error' : ''}`} id={id} type={type} name={name} onChange={onChange} value={value} min={min} max={max} />
				</div>
				{error != undefined && <p className='text-error text-sm'>{error}</p>}
				{note != undefined && <p className='text-black text-sm font-medium my-1'>{note}</p>}
			</div>
		</React.Fragment>
	);
};

export default React.memo(DatePicker);
