import React, { useCallback } from 'react';
import JoditReact from 'jodit-react-ts';
import 'jodit/build/jodit.min.css';

interface JoditEditorProps {
	onChange: (content: string) => void;
	value: string;
}

const JoditEditorModule: React.FC<JoditEditorProps> = ({ onChange, value }) => {
	const config = {
		readonly: false,
		autofocus: true,
		tabIndex: 1,
		askBeforePasteHTML: false,
		askBeforePasteFromWord: false,
		defaultActionOnPaste: 'insert_clear_html',
		placeholder: 'Write something awesome ...',
		beautyHTML: true,
		toolbarButtonSize: 'large',
		buttons: 'bold,italic,underline,strikethrough,ul,ol,font,fontsize,paragraph,lineHeight,image,video,hr,table,link,indent,outdent,left,brush,source,preview',
		uploader: {
			insertImageAsBase64URI: true,
		},
	};
	return (
		<div className='App'>
			<JoditReact onChange={useCallback((editor) => onChange(editor), [])} defaultValue={value} config={config} />
		</div>
	);
};

export default React.memo(JoditEditorModule);
