import React from 'react';
import { IRadioButtonOptions, TRadioButton } from 'src/types/component';
import FormClass from '@pageStyles/Form.module.scss';
import cn from 'classnames';

const RadioButton = ({ label, error, note, radioOptions, name, IsRadioList, onChange, checked, required }: TRadioButton) => {
	return (
		<React.Fragment>
			<div className={cn(FormClass['form-group'])}>
				{label != undefined && (
					<label htmlFor='password'>
						{label}
						<span className='text-red-500'>{required === true && ' *'}</span>
					</label>
				)}
				<>
					<div className={cn(FormClass['radio-btn-group'], `${IsRadioList ? FormClass['radio-btn-group-list'] : ''}`)}>
						{radioOptions?.map((item: IRadioButtonOptions, index: number) => (
							<label className={cn(FormClass['radio-btn'])} key={`${index + 1}`}>
								<input
									type='radio'
									name={name}
									id={item.name}
									disabled={item?.disabled}
									onChange={onChange}
									value={item.key}
									checked={item.key == checked} // Compare with the 'checked' prop
								/>
								<span>{item.name}</span>
							</label>
						))}
					</div>
				</>
				{error != undefined && <p className='text-sm error'>{error}</p>}
				{note != undefined && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
			</div>
		</React.Fragment>
	);
};

export default React.memo(RadioButton);
