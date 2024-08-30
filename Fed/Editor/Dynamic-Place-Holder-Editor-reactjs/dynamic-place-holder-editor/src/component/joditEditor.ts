import { Jodit } from 'jodit-react';

export interface IJoditEditor {
  id: string; // Editor Unique Identifier
  onChange: (data: string) => void; // Value Change then pass to calling component
  placeholder?: string; // Place holder text
  value?: string; // If already exits value then need to display (edit time generally used)
  availableButtons?: string[]; // If you want customise button then need to pass button name
  initialize: (data: Jodit) => void;
  customButtons?: string[]; // If you want Add Our Extra button then need to pass
  customButtonListData?: MultipleStringTypeDynamicKey[];
  disabled?: boolean;
}

export interface IJoditEditorCustomButtonsControlProps {
  control: {
    args: string[];
    name: string;
    text: string;
    list: MultipleStringTypeDynamicKey;
  };
}
export interface IJoditEditorExtraButtonConfig {
  id: string;
  name: string;
  tooltip: string;
  childTemplate: (editor: Jodit, key: string, value: string) => void;
  exec: (
    editor: Jodit,
    _: string,
    data: IJoditEditorCustomButtonsControlProps
  ) => void;
  list?: Array<any>;
}

export interface MultipleStringTypeDynamicKey {
  [x: string | number]: string;
}
