import Button from '@components/button/Button';
import { Cross } from '@components/icons';
import React, { useEffect, useRef } from 'react';

interface IframeProps {
	content: string;
	onClose: () => void;
}

const Iframe: React.FC<IframeProps> = ({ content, onClose }) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		const frame = iframeRef.current;

		if (frame) {
			frame.srcdoc = content;
		}
	}, [content]);

	return (
		<div id='deleteDataModel' className={'fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full grid place-content-center bg-black bg-opacity-30'}>
			<div className='relative w-full min-w-[30vw] max-w-2xl shadow-lg'>
				<div className='relative bg-white rounded-lg shadow  h-[550px] w-full overflow-auto'>
					<Button className='btn btn-large absolute right-0 top-2' onClick={onClose}>
						<Cross />
					</Button>
					<h3 className='text-xl font-semibold text-gray-900 text-center pt-8'>HTML Source code (Traditional)</h3>
					<iframe id='original_iframe' title='iframe' ref={iframeRef} className=' h-full w-full overflow-hidden' />
					<div className='flex items-end justify-end p-4 pb-8 space-x-4 rounded-b'>
						<Button className='btn btn-default min-w-[100px] justify-center' onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Iframe;
