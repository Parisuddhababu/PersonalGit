import React from 'react';
import FormClass from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { CheckBoxOption, TCheckBox } from 'src/types/component';

const CheckBox = ({ label, error, note, option, IsCheckList, disabled }: TCheckBox) => {
	return (
		<div className={cn(FormClass['form-group'])}>
			{label != undefined && <label htmlFor='CheckBox'>{label}</label>}
			<div className={cn(FormClass['checkbox-group'], `${IsCheckList ? FormClass['checkbox-group-list'] : ''}`)}>
				{option?.map((optionList: CheckBoxOption, index: number) => (
					<label htmlFor={optionList.id} key={`${index + 1}`} className={cn(FormClass['checkbox-item'])}>
						<input className={`${cn(FormClass['form-control'])} ${error ? 'error' : ''}`} id={optionList.id} type='checkbox' name={optionList.name} value={optionList.value} checked={optionList.checked} onChange={optionList.onChange} disabled={disabled} />
						<span>{optionList.name}</span>
					</label>
				))}
			</div>
			{error != undefined && <p className='text-error text-sm'>{error}</p>}
			{note != undefined && <p className='text-sm font-medium my-1'>{note}</p>}
		</div>
	);
};

export default React.memo(CheckBox);
