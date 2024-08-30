export type CheckBoxTreeProps = {
	nodes: {
		value: string;
		label: string;
		id: string;
		children: {
			value: string;
			label: string;
		}[];
	}[];
	checkedChild: string[];
	onChangeCheckedChildHandler: (value) => void;
	columns?: number;
	disable?: boolean;
};

export type TextInputProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	type?: 'text' | 'password' | 'file' | 'date' | 'number';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string | number;
	error?: string;
	note?: string;
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	required?: boolean;
	accept?: string;
	min?: number | string;
	max?: number | string;
	maxLength?: number;
	step?: string;
	hidden?: boolean;
	keyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export type ButtonProps = {
	onClick?: () => void;
	className?: string;
	title?: string;
	type?: 'submit' | 'button';
	primary?: boolean;
	secondary?: boolean;
	warning?: boolean;
	children?: ReactNode;
	disabled?: boolean;
};

export type DropdownProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	value?: number | string;
	error?: string;
	options: StatusOptionType[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	note?: string;
	className?: string;
	required?: boolean;
	disableOption?: string | number;
};

export type DropdownOptionType = {
	name: string | number;
	key: string | number;
};

export type RadioButtonProps = {
	value: string;
	label: string;
	checked: boolean;
	classList?: string;
	onChange: (value: string) => void;
};

export type SelectBoxProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name?: string;
	type?: 'text' | 'password';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string;
	error?: string;
	note?: string;
	options?: ISelectBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
};
export type ISelectBoxOption = {
	label: string;
	value: string;
	disabled?: boolean;
};

export type TRadioButton = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name: string;
	error?: string;
	note?: string;
	label?: string;
	radioOptions: IRadioButtonOptions[];
	IsRadioList?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	checked?: string | number;
	required?: boolean;
};

export type IRadioButtonOptions = {
	name: string;
	key: string | number;
	disabled?: boolean;
};
export type TCheckBox = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	value?: string;
	classList?: string;
	error?: string;
	note?: string;
	option?: CheckBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	IsCheckList?: boolean;
	disabled?: boolean;
};
export type CheckBoxOption = {
	id?: string;
	name?: string;
	value?: string;
	checked?: boolean;
	onChange?: (e) => void;
	onClick?: () => void;
};

export type TDatePicker = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name?: string;
	type?: 'date';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: date;
	error?: string;
	note?: string;
	min?: string;
	max?: string;
	inputIcon?: React.JSXElementConstructor;
};

export type ShowEntriesOption = {
	onChange: (e: string) => void;
	value: number;
};
export type PaginationProps = {
	length: number;
	onSelect: (event) => void;
	limit: number;
	page?: number;
};

export type SwitchProps = {
	onChange: () => void;
	status: number | string;
	checked: boolean;
	disabled?: boolean;
};

export type TotalRecordProps = {
	length: number;
};

export type TextAreaInputProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	type?: 'text' | 'password' | 'file' | 'date' | 'number';
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	value?: string | number;
	error?: string;
	note?: string;
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	required?: boolean;
	maxLength?: number;
};

export type FileUploadProps = {
	labelName: string;
	imageSource: string;
	name: string;
	disabled?: boolean;
	acceptNote: string;
	accepts: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	error: string;
	id: string;
	uploadType?: string;
	isRequired?: boolean;
	small?: boolean;
	uploadNote?: boolean;
};
