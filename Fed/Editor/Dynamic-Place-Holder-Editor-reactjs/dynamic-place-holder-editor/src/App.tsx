import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import JoditEditor from './component';
import { Jodit } from 'jodit-react';

function App() {
  const [values,setValues] = useState<any>('');
  const [editor, setEditor] = useState<Jodit | null>(null);
  const [editorCustomData, setEditorCustomData] = useState({});
  useEffect(() => {
        console.log(editor);  
        setEditorCustomData({});
        setEditorCustomData({ 'select Placeholder': 'select placeholder' });
  }, []);
  const handleEditorValue = useCallback((data:string) => {
    setValues(data);
  }, [])
  const handleInitializeEditor = useCallback((editorInitialize: Jodit) => {
    setEditor(editorInitialize);
    editorInitialize?.setEditorValue(
      values
    );
  }, []);
  return (
    <div className="App">
       {Object.keys(editorCustomData)?.length > 0 && (
       <JoditEditor
          id='editor'
          value={values}
          onChange={handleEditorValue}
          initialize={handleInitializeEditor}
        customButtons={['selectPlaceholder']}
        customButtonListData={[editorCustomData ?? {}]}
      />
      )}
    </div>
  );
}

export default App;
