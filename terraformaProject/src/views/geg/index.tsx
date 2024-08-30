import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@components/button/button';
import GEGClasses from './geg.module.scss';
import cn from 'classnames';
import { UserIcon, Email } from '@components/icons/icons';
import SelectBox from '@components/selectbox/SelectBox';
import RadioButton from '@components/radiobutton/radioButtonNew';
import CheckBox from '@components/checkbox/checkBox';
import DatePicker from '@components/datapicker/datePicker';
import TextInput from '@components/textInput/TextInput';

const GEG = () => {
	const { t } = useTranslation();

	const SelectBoxOptionsList = [
		{ name: 'Select', key: 1 },
		{ name: 'Option 1', key: 2 },
		{ name: 'Option 2', key: 3 },
		{ name: 'Option 3', key: 4 },
		{ name: 'Option 4', key: 5 },
		{ name: 'Option 5', key: 6, disabled: true },
	];

	const radioOptions = [
		{ name: 'Male', key: 'male' },
		{ name: 'Female', key: 'female' },
	];
	const CheckBoxOptionsList = [
		{ id: 'id1', name: 'Car1', value: 'Car1' },
		{ id: 'id2', name: 'Car2', value: 'Car2' },
	];
	return (
		<div>
			<section>
				<h6 className={cn(GEGClasses['section-heading'])}> Font Family: </h6>
				<p>
					{' '}
					<strong>Primary Font:</strong> Noto Sans, sans-serif{' '}
				</p>
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Headings List:</h6>
				<h1>H1 Heading</h1>
				<h2>H2 Heading</h2>
				<h3>H3 Heading</h3>
				<h4>H4 Heading</h4>
				<h5>H5 Heading</h5>
				<h6>H6 Heading</h6>
				<br />
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Body font:</h6>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
					eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
				</p>
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>List Style:</h6>
				<h6>Un-ordered List (ul)</h6>
				<ul className='py-5 list-inside unordered-list'>
					<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
					<li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
					<li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
				</ul>
				<h6>Ordered List (ol)</h6>
				<div>
					<ol className='py-5 list-inside ordered-list'>
						<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
						<li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
						<li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
					</ol>
				</div>
			</section>
			<div className='flex justify-center'>
				<span className='mt-2 font-medium text-blue-600 dark:text-blue-500 hover:underline'>
					<label className='relative inline-flex items-center cursor-pointer'>
						<input type='checkbox' className='sr-only peer' />
						<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-primary'}></div>
					</label>
				</span>
			</div>
			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Buttons:</h6>
				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Default Buttons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal' label={''}  title={`${t('Primary')}`} >
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-secondary' label={''}  title={`${t('Secondary')}`} >
							{t('Secondary')}
						</Button>
						<Button type='submit' className='btn btn-warning' label={''}  title={`${t('Warning')}`} >
							{t('Warning')}
						</Button>
						<Button type='submit' className='btn btn-info' label={''}  title={`${t('Info')}`} >
							{t('Info')}
						</Button>
						<Button type='submit' className='btn btn-success' label={''}  title={`${t('Success')}`} >
							{t('Success')}
						</Button>
						<Button type='submit' className='btn btn-danger' label={''}  title={`${t('Danger')}`} >
							{t('Danger')}
						</Button>
					</div>
				</div>

				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Outline Buttons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal-outline' label={''}   title={`${t('Primary')}`} >
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-secondary-outline' label={''}  title={`${t('Secondary')}`} >
							{t('Secondary')}
						</Button>
						<Button type='submit' className='btn btn-warning-outline' label={''}  title={`${t('Warning')}`} >
							{t('Warning')}
						</Button>
						<Button type='submit' className='btn btn-info-outline' label={''}  title={`${t('Info')}`} >
							{t('Info')}
						</Button>
						<Button type='submit' className='btn btn-success-outline' label={''}  title={`${t('Success')}`} >
							{t('Success')}
						</Button>
						<Button type='submit' className='btn btn-danger-outline' label={''}  title={`${t('Danger')}`} >
							{t('Danger')}
						</Button>
					</div>
				</div>

				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Disabled Buttons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal disabled' label={''}  title={`${t('Primary')}`} >
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-secondary disabled' label={''}  title={`${t('Secondary')}`} >
							{t('Secondary')}
						</Button>
						<Button type='submit' className='btn btn-warning disabled' label={''}  title={`${t('Warning')}`} >
							{t('Warning')}
						</Button>
						<Button type='submit' className='btn btn-info disabled' label={''}  title={`${t('Info')}`} >
							{t('Info')}
						</Button>
						<Button type='submit' className='btn btn-success disabled' label={''}  title={`${t('Success')}`} >
							{t('Success')}
						</Button>
						<Button type='submit' className='btn btn-danger disabled' label={''}  title={`${t('Danger')}`} >
							{t('Danger')}
						</Button>
					</div>
				</div>

				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Buttons with icons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal btn-icon' label={''}  title={`${t('Primary')}`} >
							<span className='mr-0.5'>
								<Email />
							</span>
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-primary btn-normal btn-icon' label={''}  title={`${t('Primary')}`} >
							{t('Primary')}
							<span className='ml-0.5'>
								<Email />
							</span>
						</Button>
						<Button type='submit' className='btn btn-primary btn-normal btn-icon' label={''}  title={`${t('')}`} >
							<span className=''>
								<Email />
							</span>
						</Button>
					</div>
				</div>

				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Small Buttons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal btn-small' label={''}  title={`${t('Primary')}`} >
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-secondary btn-small' label={''}  title={`${t('Secondary')}`} >
							{t('Secondary')}
						</Button>
						<Button type='submit' className='btn btn-warning btn-small' label={''}  title={`${t('Warning')}`} >
							{t('Warning')}
						</Button>
						<Button type='submit' className='btn btn-info btn-small' label={''}  title={`${t('Info')}`} >
							{t('Info')}
						</Button>
						<Button type='submit' className='btn btn-success btn-small' label={''}  title={`${t('Success')}`} >
							{t('Success')}
						</Button>
						<Button type='submit' className='btn btn-danger btn-small' label={''}  title={`${t('Danger')}`} >
							{t('Danger')}
						</Button>
					</div>
				</div>

				<div className='mb-3'>
					<h6 className='mb-1 text-sm'>Large Buttons:</h6>
					<div className='btn-group'>
						<Button type='submit' className='btn btn-primary btn-normal btn-large' label={''}  title={`${t('Primary')}`} >
							{t('Primary')}
						</Button>
						<Button type='submit' className='btn btn-secondary btn-large' label={''}  title={`${t('Secondary')}`} >
							{t('Secondary')}
						</Button>
						<Button type='submit' className='btn btn-warning btn-large' label={''}  title={`${t('Warning')}`} >
							{t('Warning')}
						</Button>
						<Button type='submit' className='btn btn-info btn-large' label={''}  title={`${t('Info')}`} >
							{t('Info')}
						</Button>
						<Button type='submit' className='btn btn-success btn-large' label={''}  title={`${t('Success')}`} >
							{t('Success')}
						</Button>
						<Button type='submit' className='btn btn-danger btn-large' label={''}  title={`${t('Danger')}`} >
							{t('Danger')}
						</Button>
					</div>
				</div>
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Links:</h6>
				<div>
					<div>
						<Link to='#' className='link'>
							Default Link
						</Link>
					</div>
					<div>
						<Link to='#' className='link disabled'>
							Disabled Link
						</Link>
					</div>
				</div>
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Badges:</h6>
				<div>
					<div className='badge-group'>
						<span className='badge'>Default</span>
						<span className='badge badge-primary'>Primary</span>
						<span className='badge badge-secondary'>Secondary</span>
						<span className='badge badge-warning'>Warning</span>
						<span className='badge badge-info'>Info</span>
						<span className='badge badge-success'>Success</span>
						<span className='badge badge-danger'>Danger</span>
					</div>
				</div>
			</section>

			<section>
				<h6 className={cn(GEGClasses['section-heading'])}>Forms controls:</h6>

				<div className='grid gap-4 mt-4 lg:grid-cols-2'>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Input box:</h6>
						<TextInput
							placeholder={t('Input text')}
							name='Input text'
						// error="Error"
						/>
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Input box with icon:</h6>
						<TextInput
							placeholder={t('Input text')}
							name='Input text'
							inputIcon={<UserIcon />}
						/>
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Input box with label:</h6>
						<TextInput placeholder={t('Input text')} name='Input text' label='Input text' />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Input box with Error message:</h6>
						<TextInput placeholder={t('Input text')} name='Input text' error='Error message here' />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Input box with Notes:</h6>
						<TextInput placeholder={t('Input text')} name='Input text' note='Note message here' />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Password Input:</h6>
						<TextInput placeholder='Enter your password' name='password' type='password' />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Disabled Input:</h6>
						<TextInput placeholder='Disabled input text' name='Input text' type='text' disabled />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Date picker:</h6>
						<DatePicker
							// label={'DatePicker'}
							name={'datepicker'}
						/>
					</div>
					<div className='mb-5'>
						{/* <h6 className="mb-2 text-sm text-slate-900">Select box:</h6> */}
						<SelectBox label={'Select Box'} option={SelectBoxOptionsList} name={'Cars'} />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Radio Button:</h6>
						<RadioButton label='Gender' radioOptions={radioOptions} name='gender' />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Radio Button List:</h6>
						<RadioButton label='Gender' radioOptions={radioOptions} name='gender' IsRadioList={true} />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Checkbox:</h6>
						<CheckBox label={'Label here'} option={CheckBoxOptionsList} />
					</div>
					<div className='mb-5'>
						<h6 className='mb-2 text-sm text-slate-900'>Checkbox Listing:</h6>
						<CheckBox label={'Label here'} option={CheckBoxOptionsList} IsCheckList={true} />
					</div>
				</div>
			</section>
		</div>
	);
};
export default GEG;
