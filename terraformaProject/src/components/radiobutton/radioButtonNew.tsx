import React from 'react';
import { IRadioButtonOptions, TRadioButton } from 'src/types/component';
import FormClasses from '@pageStyles/Form.module.scss';
import cn from 'classnames';
import { t } from 'i18next';
import { InfoIcon } from '@components/icons/icons';

const RadioButtonNew = ({ label, error, note, radioOptions, name, IsRadioList, onChange, checked, required }: TRadioButton) => {
	return (
		<React.Fragment>
			<div className={cn(FormClasses['form-group'])}>
				{label != undefined && (
					<label htmlFor='password'>
						{label}
						<span className='text-red-500'>{required === true && ' *'}</span>
					</label>
				)}
				<>
					<div className={ cn(FormClasses['radio-btn-group'], `${IsRadioList ? FormClasses['radio-btn-group-list'] : ''}`)}>
						{radioOptions?.map((item: IRadioButtonOptions, index: number) => (
							<>
							<label className={cn(FormClasses['radio-btn'])} key={`${index + 1}`}>
								<input
									type='radio'
									name={name}
									id={item.name}
									disabled={item?.disabled}
									onChange={onChange}
									value={item.key}
									checked={item.key == checked} // Compare with the 'checked' prop
								/>
								<span className='ml-2 font-normal'>{t(item.name)}</span>
							{
								item.info ? 
								<div className='ml-1.5 mr-[18px] relative group'>
									<InfoIcon className='text-base md:text-lg cursor-pointer fill-orange'/>
									<p className='absolute w-52 md:w-[360px] shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl -left-36 md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{item.info}</p>
								</div>: null
							}
							</label>
							</>
						))}
					</div>
				</>
				{error != undefined && <p className='text-sm error'>{t(error)}</p>}
				{note != undefined && <p className='my-1 text-sm font-medium text-black'>{note}</p>}
			</div>
		</React.Fragment>
	);
};

export default React.memo(RadioButtonNew);
