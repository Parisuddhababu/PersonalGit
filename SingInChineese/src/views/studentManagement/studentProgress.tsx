import React, { useEffect, useState } from 'react';
import row1 from '@assets/images/row1.png';
import row2 from '@assets/images/row2.png';
import row3 from '@assets/images/row3.png';
import row4 from '@assets/images/row4.png';
import row5 from '@assets/images/row5.png';
import girlWithLogo from '@assets/images/girlWithLogo.png';
import star from '@assets/images/star.png';
import profileImage from '@assets/images/profileImage.png';
import pet from '@assets/images/pet.png';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import Button from '@components/button/Button';
import { Cross } from '@components/icons';
import { useParams } from 'react-router-dom';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import moment from 'moment';
import { Loader } from '@components/index';
import { ChildDataProps, StudentProgressData } from 'src/types/student';

const ChildProgressModal = ({ onClose, childId }: ChildDataProps) => {
	const params = useParams();
	const [loadingData, setLoadingData] = useState<boolean>(false);
	const [studentProgressData, setStudentProgressData] = useState<StudentProgressData | null>(null);

	/**
	 * Method to handle title singular and plural based on value
	 * @param value
	 * @param name
	 * @returns
	 */
	const titleHandler = (value: number, name: string) => {
		return value === 1 ? `${value} ${name}` : `${value} ${name}s`;
	};

	useEffect(() => {
		setLoadingData(true);
		if (params?.viewId) {
			APIService.getData(`${URL_PATHS.student}/${childId}/statistics`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						setStudentProgressData(response.data.data);
					}
				})
				.catch((err) => toast.error(err?.response?.data?.message))
				.finally(() => setLoadingData(false));
		}
	}, []);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			{loadingData && <Loader />}
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					<h4 className='font-medium'>Child Progress</h4>
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				<div className='p-3 m-0 box-border bg-white text-black' style={{ fontFamily: 'Open Sans, sans-serif' }}>
					<div className='p-0 m-0 box-border'>
						<div className='w-full mx-auto bg-white p-0'>
							<table className='w-[1000px] border-collapse mx-auto border-none bg-white align-top p-0 box-border border-spacing-0'>
								<tr className='p-0 m-0 box-border'>
									<td className='px-[20px] py-0 m-0 box-border'>
										<table className='p-0 m-0 box-border w-full h-full align-top'>
											<tr className='p-0 m-0 box-border'>
												<td className='py-[10px] px-0 pr-[10px] m-0 box-border'>
													<table className='p-0 m-0 box-border h-full'>
														<tr className='p-0 m-0 box-border'>
															<td className='p-2 m-0 box-border h-full border-[6.4px] border-solid border-[#e1318f] bg-white'>
																<table className='p-0 m-0 box-border w-full h-full align-top'>
																	<tr className='p-0 m-0 box-border'>
																		<td className='p-2 m-0 box-border h-full border-[6.4px] border-solid border-[#469c97] bg-white'>
																			<table className='p-0 mx-auto box-border w-full h-full'>
																				<tr className='p-0 m-0 box-border'>
																					<td className='p-0 m-0 box-border'>
																						<h2 className='text-xl text-black p-0 m-0 box-border font-semibold max-w-48 overflow-hidden text-ellipsis whitespace-nowrap' title={studentProgressData?.name} style={{ fontFamily: 'Open Sans, sans-serif' }}>
																							{studentProgressData?.name}
																						</h2>
																						<p className='text-[#055f6c] text-sm font-semibold p-0 m-0 box-border' style={{ fontFamily: 'Open Sans, sans-serif' }}>
																							{studentProgressData?.dateOfBirth ? moment(studentProgressData?.dateOfBirth, 'YYYY-MM-DD').format('MMMM D YYYY') : ''}
																						</p>
																					</td>
																				</tr>
																				<tr className='p-0 m-0 box-border'>
																					<td className='p-0 m-0 box-border'>
																						<picture className='p-0 mx-auto box-border'>
																							<source srcSet={studentProgressData?.avatar ? studentProgressData?.avatar : profileImage} className='p-0 m-0 box-border' />
																							<img className='mx-auto border-none outline-none block p-0 box-border' src={studentProgressData?.avatar ? studentProgressData?.avatar : profileImage} alt='imagePreview' title='Avatar' width='166' height='166' />
																						</picture>
																					</td>
																				</tr>
																				<tr className='p-0 m-0 box-border'>
																					<td className='text-center p-0 m-0 box-border' style={{ fontFamily: 'Baloo 2, sans-serif' }}>
																						<p className='text-xl leading-[84px] text-black h-[84px] w-[84px] font-bold' style={{ backgroundImage: `url(${star})`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center', display: 'inline-block' }}>
																							{studentProgressData?.starCount ?? 0}
																						</p>
																					</td>
																				</tr>
																				<tr className='p-0 m-0 box-border'>
																					<td className='p-0 m-0 box-border w-[170px] h-[120px]'>
																						<picture className='p-0 m-0 box-border w-full'>
																							<source srcSet={studentProgressData?.pet ? studentProgressData?.pet : pet} className='p-0 m-0 box-border' />
																							<img className='mx-auto border-none outline-none block p-0 box-border max-w-full max-h-full' src={studentProgressData?.pet ? studentProgressData?.pet : pet} alt='imagePreview' title='Pet' />
																						</picture>
																					</td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
												<td className='pr-5 pl-[10px] m-0 box-border'>
													<table className='p-0 m-0 box-border w-[508px]'>
														<tr className='p-0 m-0 box-border'>
															<td className='p-0 m-0 box-border pb-5'>
																<table className='p-0 m-0 box-border w-full'>
																	<tr className='p-0 m-0 box-border'>
																		<td
																			className='p-0 m-0 box-border'
																			style={{
																				backgroundImage: `url(${row1})`,
																				backgroundRepeat: 'no-repeat',
																			}}
																		>
																			<table className='w-full h-full border-collapse border-none align-top p-0 m-0 box-border'>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border h-[30px] pl-[94px] pt-[6px]'>
																						<h3 className='text-xl text-white uppercase inline-block p-0 m-0 box-border font-bold'>{`Level ${studentProgressData?.currentLevel ?? 0}`}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] box-border'>Total {titleHandler(studentProgressData?.currentLevelLessons ?? 0, 'Lesson')}</h4>
																					</td>
																					<td className='text-right text-lg text-black font-semibold pt-[6px] pr-[10px] m-0 box-border h-[30px]'>{titleHandler(studentProgressData?.currentLevelLeftLessons ?? 0, 'Lesson')} Left!</td>
																				</tr>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td colSpan={2} className='p-0 m-0 box-border pl-[94px]'></td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>

														<tr className='p-0 m-0 box-border'>
															<td className='p-0 m-0 box-border pb-5'>
																<table className='p-0 m-0 box-border w-full'>
																	<tr className='p-0 m-0 box-border'>
																		<td
																			className='p-0 m-0 box-border h-[88px]'
																			style={{
																				backgroundImage: `url(${row2})`,
																				backgroundRepeat: 'no-repeat',
																				backgroundSize: 'cover',
																			}}
																		>
																			<table className='w-full h-full border-collapse border-none align-top p-0 m-0 box-border'>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border pl-[94px] pt-[6px]'>
																						<h3 className='text-xl text-white capitalize inline-block p-0 m-0 box-border font-bold'>{titleHandler(studentProgressData?.totalCompletedLessons ?? 0, 'Lesson')}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] m-0 box-border'>Completed</h4>
																					</td>
																					<td className='pr-[10px] m-0 box-border'></td>
																				</tr>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td colSpan={2} className='p-0 m-0 box-border pl-[94px]'></td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>

														<tr className='p-0 m-0 box-border'>
															<td className='p-0 m-0 box-border pb-[20px]'>
																<table className='p-0 m-0 box-border w-full'>
																	<tr className='p-0 m-0 box-border'>
																		<td
																			className='p-0 m-0 box-border h-[88px]'
																			style={{
																				backgroundImage: `url(${row3})`,
																				backgroundRepeat: 'no-repeat',
																				backgroundSize: 'cover',
																			}}
																		>
																			<table className='w-full h-full border-collapse border-none align-top p-0 m-0 box-border'>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border pl-[94px] pt-[6px]'>
																						<h3 className='text-xl text-white capitalize inline-block p-0 m-0 box-border font-bold'>
																							{studentProgressData?.totalVocabulary ?? 0} Vocabulary + {titleHandler(studentProgressData?.totalSentence ?? 0, 'Sentence')}
																						</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] m-0 box-border'>Learned</h4>
																					</td>
																					<td className='p-[10px] m-0 box-border'></td>
																				</tr>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td colSpan={2} className='p-0 m-0 box-border pl-[94px] pb-[6px]'>
																						<h3 className='text-xl text-white capitalize inline-block p-0 m-0 box-border font-bold'>{titleHandler(studentProgressData?.totalCharacters ?? 0, 'Character')}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] m-0 box-border'>Written</h4>
																					</td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>

														<tr className='p-0 m-0 box-border'>
															<td style={{ padding: 0, margin: 0, boxSizing: 'border-box', paddingBottom: '20px' }}>
																<table style={{ padding: 0, margin: 0, boxSizing: 'border-box', width: '100%' }}>
																	<tr className='p-0 m-0 box-border'>
																		<td
																			className='p-0 m-0 box-border h-[88px]'
																			style={{
																				backgroundImage: `url(${row4})`,
																				backgroundRepeat: 'no-repeat',
																				backgroundSize: 'cover',
																			}}
																		>
																			<table className='w-full h-full border-collapse align-top p-0 m-0 box-border'>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border pl-[94px] pt-[6px]'>
																						<h3 className='text-xl text-white capitalize inline-block p-0 m-0 box-border font-bold'>{studentProgressData?.weeklySpentHours ?? 0} Hours</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] m-0 box-border'>Spent this Week</h4>
																					</td>
																					<td className='pr-[10px] m-0 box-border'></td>
																				</tr>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border pl-[94px] pb-[6px]'>
																						<h3 className='text-xl text-white capitalize inline-block p-0 m-0 box-border font-bold'>{titleHandler(studentProgressData?.totalSpentDays ?? 0, 'Day')}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold pl-[6px] m-0 box-border'>Spent in Total</h4>
																					</td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>

														<tr className='p-0 m-0 box-border'>
															<td className='p-0 m-0 box-border'>
																<table className='p-0 m-0 box-border w-full'>
																	<tr className='p-0 m-0 box-border'>
																		<td
																			className='p-0 m-0 box-border h-[88px]'
																			style={{
																				backgroundImage: `url(${row5})`,
																				backgroundRepeat: 'no-repeat',
																				backgroundSize: 'cover',
																			}}
																		>
																			<table className='w-full h-full border-collapse border-none align-top p-0 m-0 box-border'>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td className='p-0 m-0 box-border pl-[94px] pt-[6px]'>
																						<h4 className='text-lg text-black inline-block font-semibold p-0 m-0 box-border'>You have</h4>
																						<h3 className='text-xl text-white capitalize inline-block px-[6px] m-0 box-border font-bold'>{titleHandler(studentProgressData?.starCount ?? 0, 'Star')}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold p-0 m-0 box-border'>in the Pet Store</h4>
																					</td>
																					<td className='pr-[10px] m-0 box-border'></td>
																				</tr>
																				<tr className='p-0 m-0 box-border h-11'>
																					<td colSpan={2} className='p-0 m-0 box-border pl-[94px] pb-[6px]'>
																						<h4 className='text-lg text-black inline-block font-semibold p-0 m-0 box-border'>You earned</h4>
																						<h3 className='text-xl text-white capitalize inline-block px-[6px] m-0 box-border font-bold'>{titleHandler(studentProgressData?.totalStarCount ?? 0, 'Star')}</h3>
																						<h4 className='text-lg text-black inline-block font-semibold p-0 m-0 box-border'>in Total</h4>
																					</td>
																				</tr>
																			</table>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
												<td className='py-5 m-0 box-border w-[152px] pt-[14px] pb-[5px] h-full'>
													<picture className='p-0 m-0 box-border inline-block'>
														<source srcSet={`${girlWithLogo}`} className='p-0 m-0 box-border' />
														<img src={`${girlWithLogo}`} alt='imagePreview' title='image' className='p-0 m-0 box-border' width='152px' />
													</picture>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChildProgressModal;
