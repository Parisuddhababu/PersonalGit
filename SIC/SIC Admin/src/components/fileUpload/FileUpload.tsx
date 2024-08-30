import { Document } from '@components/icons';
import TextInput from '@components/textInput/TextInput';
import { FILE_TYPE } from '@config/constant';
import React, { useEffect, useState } from 'react';
import { FileUploadProps } from 'src/types/component';

const FileUpload = ({ labelName, imageSource, name, disabled, onChange, error, acceptNote, accepts, id, uploadType, isRequired = true, small = false, uploadNote = true }: FileUploadProps) => {
	const [showImage, setShowImage] = useState(false);
	const [showVideo, setShowVideo] = useState(false);
	const [showAudio, setShowAudio] = useState(false);
	const [showHtml, setShowHtml] = useState(false);
	const [showText, setShowText] = useState(false);
	useEffect(() => {
		if (imageSource !== '') {
			uploadType === FILE_TYPE.videoType || uploadType === FILE_TYPE.movVideoType ? setShowVideo(true) : setShowVideo(false);
			uploadType === FILE_TYPE.audioType || uploadType === FILE_TYPE.wavType ? setShowAudio(true) : setShowAudio(false);
			uploadType === FILE_TYPE.htmlType ? setShowHtml(true) : setShowHtml(false);
			uploadType === FILE_TYPE.textType ? setShowText(true) : setShowText(false);
			uploadType !== FILE_TYPE.audioType && uploadType !== FILE_TYPE.videoType && uploadType !== FILE_TYPE.movVideoType && uploadType !== FILE_TYPE.movVideoType && uploadType !== FILE_TYPE.htmlType && uploadType !== FILE_TYPE.textType && uploadType !== FILE_TYPE.wavType ? setShowImage(true) : setShowImage(false);
		}
		if (!uploadType) {
			setShowImage(false);
			setShowVideo(false);
			setShowAudio(false);
			setShowHtml(false);
			setShowText(false);
		}
	}, [uploadType, showVideo, imageSource]);

	return (
		<div className='file-upload-with-preview'>
			<p className='block text-gray-700 text-sm font-bold mb-0.5'>
				{labelName} {isRequired && <span className='text-error'>*</span>}
			</p>
			<label htmlFor={id} className={`flex flex-col items-center justify-center w-full px-1 ${small ? 'py-1' : 'py-3'} border rounded  border-dashed  ${uploadNote ? 'cursor-pointer' : 'cursor-not-allowed'} hover:bg-gray-100 h-full ${error ? 'bg-red-100 border-error' : 'bg-gray-50 border-gray-300'}`}>
				{showImage && imageSource !== '' && <img src={imageSource} alt='Image preview' className='bg-gray-100 object-cover w-full max-h-80 mb-3 rounded' />}
				{showVideo && imageSource !== '' && <video controls className='bg-gray-100 object-cover w-full max-h-80 mb-3 rounded' src={imageSource}></video>}
				{showAudio && imageSource !== '' && <audio src={imageSource} controls className={small ? 'w-full h-8 mb-1' : 'w-full mb-3'}></audio>}
				{(showHtml || showText) && imageSource !== '' && <Document className='text-3xl text-primary mb-3' />}
				{uploadNote ? (
					<>
						<p className={`${!small && 'mb-1'} text-sm text-gray-500`}>Click to upload</p>
						<p className='text-xs text-gray-500'>{acceptNote}</p>
					</>
				) : (
					<p className={`${!small && 'mb-1'} text-sm text-gray-500`}>Correct audio</p>
				)}
			</label>
			<TextInput type='file' hidden={true} accept={accepts} id={id} name={name} disabled={disabled} onChange={onChange} error={error} placeholder='' />
		</div>
	);
};

export default FileUpload;
