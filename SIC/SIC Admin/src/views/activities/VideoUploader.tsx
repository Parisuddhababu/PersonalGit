import { FILE_TYPE } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { APIService } from '@framework/services/api';
import React from 'react';

interface Props {
	onUploadSuccess: () => void;
}

const VideoUploader: React.FC<Props> = ({ onUploadSuccess }) => {
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const chunkSize = 1024 * 1024 * 5;
			const chunks: Blob[] = [];

			for (let offset = 0; offset < file.size; offset += chunkSize) {
				const chunk = file.slice(offset, offset + chunkSize);
				chunks.push(chunk);
			}

			try {
				for (let i = 0; i < chunks.length; i++) {
					const formData = new FormData();
					formData.append('chunk', chunks[i]);
					console.log('formData: ', formData);

					await APIService.postData(URL_PATHS.uploadMultiPart, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});

					console.log(`Chunk ${i + 1} uploaded successfully.`);
				}

				console.log('File uploaded successfully.');
				onUploadSuccess();
			} catch (error) {
				console.error('Error uploading chunks:', error);
			}
		}
	};

	return (
		<div className='border rounded w-full mb-4 p-3 bg-gray-100'>
			<input type='file' onChange={handleFileUpload} className='w-full' accept={FILE_TYPE.videoType} />
		</div>
	);
};

export default VideoUploader;
