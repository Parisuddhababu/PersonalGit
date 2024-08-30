import { DefaultTFuncReturn } from 'i18next';

export type TextInputProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	placeholder?: string;
	name?: string;
	type?: 'text' | 'password' | 'date' | 'file' | 'search' | 'number' | 'tel';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string;
	error?: string;
	note?: string;
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	accept?: string;
	required?: boolean;
	maxLength?: number;
	hidden?: boolean;
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
};

export type DropdownOptionType = {
	name: string | number;
	key: string | number;
};
export type JoditEditorProps = {
	onChange: (content: string) => void;
	value?: string;
};
export type ButtonProps = {
	label: string;
	className?: string;
	type?: 'submit' | 'button';
	primary?: boolean;
	secondary?: boolean;
	warning?: boolean;
	children?: ReactNode;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement> | unknown;
};
