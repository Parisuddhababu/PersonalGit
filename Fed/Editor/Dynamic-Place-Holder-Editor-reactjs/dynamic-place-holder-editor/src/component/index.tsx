import React, { useEffect, useState } from 'react';
import { Jodit } from 'jodit-react';
import {
  IJoditEditor,
  IJoditEditorCustomButtonsControlProps,
  IJoditEditorExtraButtonConfig,
} from './joditEditor';
import './jodit.css';

const JoditEditor = ({
  id,
  placeholder,
  onChange,
  initialize,
  availableButtons,
  customButtons,
  disabled,
}: IJoditEditor) => {
  let editor: Jodit;
  const buttons = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'eraser',
    'ul',
    'ol',
    'font',
    'fontsize',
    'paragraph',
    'lineHeight',
    'superscript',
    'subscript',
    // 'image',
    'spellcheck',
    'cut',
    'copy',
    'paste',
    'selectall',
    'hr',
    'table',
    'link',
    'indent',
    'outdent',
    'brush',
    'undo',
    'redo',
    'source',
    'align',
    // 'preview',
    // 'print',
  ];
  const [editorButtons] = useState<string[]>(availableButtons ?? buttons);
  const [extraButtons] = useState<string[] | []>(customButtons ?? []);
  const customButtonListData:any = {'Emp ID': "{{emp_id}}", 'Name': "{{emp_name}}",'Document':"{{document}}",'Subject':"{{subject}}",'Topic':"{{topic}}",'Position':"{{position}}"}
  const customButtonsConfig: IJoditEditorExtraButtonConfig[] = [];

  /**
   * Custom Editor Button configuration
   */
  const extraButtonsConfig: IJoditEditorExtraButtonConfig[] = [
    {
      id: 'selectPlaceholder',
      name: 'Select Placeholder',
      tooltip: 'Select Placeholder',
      list: customButtonListData,
      childTemplate: (editor: Jodit, key: string) => {
        return `<span class="${key}">${editor.i18n(key)}</span>`;
      },
      exec(
        editor: Jodit,
        _: string,
        { control }: IJoditEditorCustomButtonsControlProps
      ) {
        if (control?.text) {
          const value = control.text;
          editor.s.insertHTML(`<span>${value}</span>`);
          return true;
        } else {
          editor.execCommand('mceOpenDropdown', true, 'Select Placeholder');
          return false;
        }
      },
    },
  ];

  /**
   * Compare extra button need to display then adding that button in editor
   */
  const extraButtonAddInEditor = () => {
    extraButtons.forEach((eb) => {
      const index = extraButtonsConfig.findIndex((ebc) => ebc.id === eb);
      if (index !== -1) {
        customButtonsConfig.push(extraButtonsConfig[index]);
      }
    });
  };

  useEffect(() => {
    extraButtonAddInEditor();
  }, [extraButtons]);

  /**
   * Editor Config option refrence given below link
   * Available Options Link: https://xdan.github.io/jodit/examples/
   * Demo Link: https://xdsoft.net/jodit/
   */
  const config = {
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg'],
    },
    // If You customise screen wise button then toolbarAdaptive need to make true
    toolbarAdaptive: false,
    // You can customize button if you want to customize
    buttons: [...editorButtons],
    extraButtons: customButtonsConfig,
    enterBlock: 'DIV',
    enter: 'DIV',
    toolbarSticky: false,
    addNewLine: false,
    placeholder: placeholder ?? 'Enter Text',
    className: 'editor-area',
    tabIndex: 0,
    disabled: disabled,
  };

  const setEditorData = () => {
    editor = Jodit.make(`#${id}`, {
      ...config,
    });
    editor.e.on('change', (description) => onChange(description));
    initialize(editor);
  };

  useEffect(() => {
    setEditorData();
  }, []);

  return <textarea id={id} className='editor-area'/>;
};

export default JoditEditor;
