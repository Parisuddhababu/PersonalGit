import React from 'react';
import { SwitchProps } from 'src/types/component';

const Switch = ({ onChange, status, checked, disabled = false }: SwitchProps) => {
	return (
		<label onChange={onChange} className='ml-3 relative inline-flex items-center cursor-pointer'>
			<input type='checkbox' value={status} className='sr-only peer' checked={checked} readOnly disabled={disabled} />
			<div className={'w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary'}></div>
		</label>
	);
};

export default Switch;
