import React from "react";
import JoditReact from "jodit-react-ts";
import "jodit/build/jodit.min.css";
import { JoditEditorProps } from "src/types/component";
const CKEditorComponent: React.FC<JoditEditorProps> = ({ onChange, value }) => {
  const config = {
    readonly: false,
    autofocus: false,
    tabIndex: 1,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    placeholder: "Write something awesome ...",
    beautyHTML: true,
    toolbarButtonSize: "large",
    uploader: {
      insertImageAsBase64URI: true,
    },
  };
  return (
    <div className='App'>
      <JoditReact
        onChange={(editor) => onChange(editor)}
        config={config}
        defaultValue={value}
      />
    </div>
  );
};

export default React.memo(CKEditorComponent);
