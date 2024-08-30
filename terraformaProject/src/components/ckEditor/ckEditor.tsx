import React, { useCallback } from 'react';
import { JoditEditorProps } from 'src/types/component';

import JoditReact from 'jodit-react-ts';
import 'jodit/build/jodit.min.css';

const CKEditorComponent: React.FC<JoditEditorProps> = ({ onChange, value='' }) => {
	const config = {
		readonly: false,
		autofocus: false,
		tabIndex: 1,
		askBeforePasteHTML: false,
		askBeforePasteFromWord: false,
		defaultActionOnPaste: 'insert_clear_html',
		placeholder: 'Write something awesome ...',
		beautyHTML: true,
		toolbarButtonSize: 'large',
		uploader: {
			insertImageAsBase64URI: true,
		},
		height: 596
	};
	const handleEditorChange = useCallback((editor: string) => {
		onChange(editor);
	}, []);
	return (
		<div className='App'>
			<JoditReact onChange={handleEditorChange} config={config} defaultValue={value} />
		</div>
	);
};

export default React.memo(CKEditorComponent);
