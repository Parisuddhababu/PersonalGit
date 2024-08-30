import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/button/Button';
import GEGClasses from './geg.module.scss';
import cn from 'classnames';
import TextInput from '@components/textInput/TextInput';
import SelectBox from '@components/selectbox/SelectBox';
import CheckBox from '@components/checkbox/CheckBox';
import DatePicker from '@components/datapicker/DatePicker';
import { PlusCircle, AngleLeft, AngleRight, UsersAlt, Users, UserAdd, User, Trash, Star, ShoppingCart, Share, SettingsSliders, Setting, Search, Refresh, Picture, PhoneCall, Pencil, MenuBurger, Megaphone, Marker, Lock, ListCheck, Key, Info, Home, Heart, Globe, EyeCrossed, Eye, Exit, Edit, Download, Document, CrossCircle, Cross, CreditCard, Clock, Checkbox, Check, ChartHistogram, Calendar, Bulb, Briefcase, Bell, ArrowSmallLeft, AngleSmallDown, Email, Man, Woman, Pet, Question, Child, Exclamation, Interrogation, Plus, Drag, Subscribe, UserPermission, Flag, Result, Placement, Copy, Translate } from '@components/icons';
import RadioButton from '@components/radiobutton/RadioButton';
import { DndListItem } from 'src/types/lesson';
import DndList from '@components/dnd/DndList';
import { generateUuid, getDateFromUTCstamp, getDateTimeFromUTCstamp } from '@utils/helpers';

const GEG = () => {
	const [vocabularyList, setVocabularyList] = useState<Array<DndListItem>>([]);
	const [vocabularyEnglish, setVocabularyEnglish] = useState('');
	const [vocabularyChinese, setVocabularyChinese] = useState('');

	const SelectBoxOptionsList = [
		{ label: 'Select', value: '' },
		{ label: 'Option 1', value: 'Option 1' },
		{ label: 'Option 2', value: 'Option 2' },
		{ label: 'Option 3', value: 'Option 3' },
		{ label: 'Option 4', value: 'Option 4' },
		{ label: 'Option 5', value: 'Option 5', disabled: true },
	];

	const CheckBoxOptionsList = [
		{ id: 'id1', name: 'Car1', value: 'Car1' },
		{ id: 'id2', name: 'Car2', value: 'Car2' },
	];

	/**
	 *
	 * @returns Method used for Add vocabulary
	 */
	const addVocabulary = useCallback(() => {
		if (vocabularyEnglish.length) {
			const data = vocabularyList;
			setVocabularyList([...data, { english: vocabularyEnglish, chinese: vocabularyChinese, id: `item-${generateUuid()}` }]);
			setVocabularyEnglish('');
			setVocabularyChinese('');
		}
	}, []);

	/**
	 *
	 * @returns Method used for remove vocabulary
	 */
	const removeVocabulary = useCallback((id: string) => {
		setVocabularyList(vocabularyList?.filter((vocabularyListItem) => vocabularyListItem.id !== id));
	}, []);

	return (
		<React.Fragment>
			<div className={cn(GEGClasses['global-element-guide'], 'container', 'mx-auto', 'md:px-5')}>
				<section className='py-5'>
					<h1 className='text-center text-2xl'>Global Element Guide</h1>
				</section>

				<section>
					<h6 className={cn(GEGClasses['section-heading'])}> Font Family: </h6>
					<p>
						<strong>Primary Font:</strong> Roboto, sans-serif
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
					<ul className='unordered-list py-5 list-inside'>
						<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
						<li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
						<li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
					</ul>
					<h6>Ordered List (ol)</h6>
					<div>
						<ol className='ordered-list py-5 list-inside'>
							<li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
							<li>Assumenda, quia temporibus eveniet a libero incidunt suscipit</li>
							<li>Quidem, ipsam illum quis sed voluptatum quae eum fugit earum</li>
						</ol>
					</div>
				</section>

				<section>
					<h6 className={cn(GEGClasses['section-heading'])}>Buttons:</h6>
					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Default Buttons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary'>
								Primary
							</Button>
							<Button type='submit' className='btn btn-secondary'>
								Secondary
							</Button>
							<Button type='submit' className='btn btn-warning'>
								Warning
							</Button>
							<Button type='submit' className='btn btn-info'>
								Info
							</Button>
							<Button type='submit' className='btn btn-success'>
								Success
							</Button>
							<Button type='submit' className='btn btn-danger'>
								Danger
							</Button>
						</div>
					</div>

					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Outline Buttons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary-outline'>
								Primary
							</Button>
							<Button type='submit' className='btn btn-secondary-outline'>
								Secondary
							</Button>
							<Button type='submit' className='btn btn-warning-outline'>
								Warning
							</Button>
							<Button type='submit' className='btn btn-info-outline'>
								Info
							</Button>
							<Button type='submit' className='btn btn-success-outline'>
								Success
							</Button>
							<Button type='submit' className='btn btn-danger-outline'>
								Danger
							</Button>
						</div>
					</div>

					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Disabled Buttons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary disabled'>
								Primary
							</Button>
							<Button type='submit' className='btn btn-secondary disabled'>
								Secondary
							</Button>
							<Button type='submit' className='btn btn-warning disabled'>
								Warning
							</Button>
							<Button type='submit' className='btn btn-info disabled'>
								Info
							</Button>
							<Button type='submit' className='btn btn-success disabled'>
								Success
							</Button>
							<Button type='submit' className='btn btn-danger disabled'>
								Danger
							</Button>
						</div>
					</div>

					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Buttons with icons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary btn-icon'>
								<span className='mr-0.5'>
									<Email />
								</span>
								Primary
							</Button>
							<Button type='submit' className='btn btn-primary btn-icon'>
								Primary
								<span className='ml-0.5'>
									<Email />
								</span>
							</Button>
							<Button type='submit' className='btn btn-primary btn-icon'>
								<span className=''>
									<Email />
								</span>
							</Button>
						</div>
					</div>

					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Small Buttons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary btn-small'>
								Primary
							</Button>
							<Button type='submit' className='btn btn-secondary btn-small'>
								Secondary
							</Button>
							<Button type='submit' className='btn btn-warning btn-small'>
								Warning
							</Button>
							<Button type='submit' className='btn btn-info btn-small'>
								Info
							</Button>
							<Button type='submit' className='btn btn-success btn-small'>
								Success
							</Button>
							<Button type='submit' className='btn btn-danger btn-small'>
								Danger
							</Button>
						</div>
					</div>

					<div className='mb-3'>
						<h6 className='text-sm mb-1'>Large Buttons:</h6>
						<div className='btn-group'>
							<Button type='submit' className='btn btn-primary btn-large'>
								Primary
							</Button>
							<Button type='submit' className='btn btn-secondary btn-large'>
								Secondary
							</Button>
							<Button type='submit' className='btn btn-warning btn-large'>
								Warning
							</Button>
							<Button type='submit' className='btn btn-info btn-large'>
								Info
							</Button>
							<Button type='submit' className='btn btn-success btn-large'>
								Success
							</Button>
							<Button type='submit' className='btn btn-danger btn-large'>
								Danger
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

					<div className='grid lg:grid-cols-2 gap-4 mt-4'>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Input box:</h6>
							<TextInput placeholder='Input text' name='Input text' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Input box with icon:</h6>
							<TextInput
								placeholder='Input text'
								name='Input text'
								inputIcon={<User />}
								// inputIcon={<i>Icons</i>}
							/>
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Input box with label:</h6>
							<TextInput placeholder='Input text' name='Input text' label='Input text' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Input box with Error message:</h6>
							<TextInput placeholder='Input text' name='Input text' error='Error message here' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Input box with Notes:</h6>
							<TextInput placeholder='Input text' name='Input text' note='Note message here' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Password Input:</h6>
							<TextInput placeholder='Enter your password' name='password' type='password' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Disabled Input:</h6>
							<TextInput placeholder='Disabled input text' name='Input text' type='text' disabled />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>File Input:</h6>
							<TextInput placeholder='Select a file' name='file picket' type='file' />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Date picker:</h6>
							<DatePicker name='datepicker' />
						</div>
						<div className='mb-5'>
							{/* <h6 className="text-sm mb-2 text-slate-900">Select box:</h6> */}
							<SelectBox label='Select Box' options={SelectBoxOptionsList} name={'Cars'} />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Radio Button:</h6>
							<RadioButton
								id='gender'
								required={false}
								checked={0}
								name={'gender'}
								radioOptions={[
									{ name: 'Male', key: 0 },
									{ name: 'Female', key: 1 },
								]}
								label={'Gender'}
							/>
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Radio Button List:</h6>
							<RadioButton
								id='genderList'
								required={false}
								checked={0}
								name={'genderList'}
								radioOptions={[
									{ name: 'Male', key: 0 },
									{ name: 'Female', key: 1 },
								]}
								label={'Gender'}
								IsRadioList={true}
							/>
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Checkbox:</h6>
							<CheckBox label='Label here' option={CheckBoxOptionsList} />
						</div>
						<div className='mb-5'>
							<h6 className='text-sm mb-2 text-slate-900'>Checkbox Listing:</h6>
							<CheckBox label='Label here' option={CheckBoxOptionsList} IsCheckList={true} />
						</div>
					</div>
				</section>
				<section>
					<h6 className={cn(GEGClasses['section-heading'])}>DND list:</h6>
					<div className='p-4 rounded border bg-gray-50'>
						<div className='mb-4'>
							<label className='font-medium'>Vocabulary</label>
							<div className='flex space-x-3'>
								<div className='w-full'>
									<TextInput placeholder='Vocabulary in English' value={vocabularyEnglish} onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setVocabularyEnglish(e.target.value), [])} />
								</div>
								<div className='w-full'>
									<TextInput placeholder='Vocabulary in Chinese' value={vocabularyChinese} onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => setVocabularyChinese(e.target.value), [])} />
								</div>
								<Button className='btn-primary' onClick={addVocabulary}>
									<Plus />
								</Button>
							</div>
							<DndList dndItemList={vocabularyList} removeItem={removeVocabulary} />
						</div>
					</div>
				</section>
				<section>
					<h6 className={cn(GEGClasses['section-heading'])}>Icons:</h6>
					<div className='grid grid-cols-8 gap-3 mt-5 text-md'>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Plus className='mb-3 text-lg' /> Plus
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<PlusCircle className='mb-3 text-lg' /> PlusCircle
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<AngleLeft className='mb-3 text-lg' /> AngleLeft
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<AngleRight className='mb-3 text-lg' /> AngleRight
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<UsersAlt className='mb-3 text-lg' /> UsersAlt
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Users className='mb-3 text-lg' /> Users
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<UserAdd className='mb-3 text-lg' /> UserAdd
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<User className='mb-3 text-lg' /> User
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Trash className='mb-3 text-lg' /> Trash
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Star className='mb-3 text-lg' /> Star
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<ShoppingCart className='mb-3 text-lg' /> ShoppingCart
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Share className='mb-3 text-lg' /> Share
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<SettingsSliders className='mb-3 text-lg' />
							SettingsSliders
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Setting className='mb-3 text-lg' /> Setting
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Search className='mb-3 text-lg' /> Search
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Refresh className='mb-3 text-lg' /> Refresh
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Picture className='mb-3 text-lg' /> Picture
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<PhoneCall className='mb-3 text-lg' /> PhoneCall
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Pencil className='mb-3 text-lg' /> Pencil
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<MenuBurger className='mb-3 text-lg' /> MenuBurger
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Megaphone className='mb-3 text-lg' /> Megaphone
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Marker className='mb-3 text-lg' /> Marker
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Lock className='mb-3 text-lg' /> Lock
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<ListCheck className='mb-3 text-lg' /> ListCheck
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Key className='mb-3 text-lg' /> Key
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Info className='mb-3 text-lg' /> Info
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Home className='mb-3 text-lg' /> Home
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Heart className='mb-3 text-lg' /> Heart
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Globe className='mb-3 text-lg' /> Globe
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<EyeCrossed className='mb-3 text-lg' /> EyeCrossed
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Eye className='mb-3 text-lg' /> Eye
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Exit className='mb-3 text-lg' /> Exit
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Edit className='mb-3 text-lg' /> Edit
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Download className='mb-3 text-lg' /> Download
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Document className='mb-3 text-lg' /> Document
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<CrossCircle className='mb-3 text-lg' /> CrossCircle
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Cross className='mb-3 text-lg' /> Cross
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<CreditCard className='mb-3 text-lg' /> CreditCard
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Clock className='mb-3 text-lg' /> Clock
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Checkbox className='mb-3 text-lg' /> Checkbox
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Check className='mb-3 text-lg' /> Check
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<ChartHistogram className='mb-3 text-lg' /> ChartHistogram
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Calendar className='mb-3 text-lg' /> Calendar
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Bulb className='mb-3 text-lg' /> Bulb
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Briefcase className='mb-3 text-lg' /> Briefcase
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Bell className='mb-3 text-lg' /> Bell
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<ArrowSmallLeft className='mb-3 text-lg' /> ArrowSmallLeft
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<AngleSmallDown className='mb-3 text-lg' /> AngleSmallDown
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Email className='mb-3 text-lg' /> Email
						</div>

						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Man className='mb-3 text-lg' /> Man
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Woman className='mb-3 text-lg' /> Woman
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Pet className='mb-3 text-lg' /> Pet
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Question className='mb-3 text-lg' /> Question
						</div>

						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Child className='mb-3 text-lg' /> Child
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Exclamation className='mb-3 text-lg' /> Exclamation
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Interrogation className='mb-3 text-lg' /> Interrogation
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Drag className='mb-3 text-lg' /> Drag
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Subscribe className='mb-3 text-lg' /> Subscription
						</div>

						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<UserPermission className='mb-3 text-lg' /> UserPermission
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Flag className='mb-3 text-lg' /> Flag
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Result className='mb-3 text-lg' /> Result
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Placement className='mb-3 text-lg' /> Placement
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Copy className='mb-3 text-lg' /> Copy
						</div>
						<div className='border border-gray-300-rounded p-5 flex flex-col hover:bg-primary hover:text-white items-center shadow-md bg-white'>
							<Translate className='mb-3 text-lg' /> Translate
						</div>
					</div>
				</section>
				<br />
				<h4>
					{getDateFromUTCstamp('2023-08-29T11:15:20.537Z')}
					<br />
					{getDateTimeFromUTCstamp('2023-08-29T11:15:20.537Z')}
				</h4>
			</div>
		</React.Fragment>
	);
};
export default GEG;
