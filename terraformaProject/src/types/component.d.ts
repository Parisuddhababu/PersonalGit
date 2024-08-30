/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultTFuncReturn } from 'i18next';
import React, { ReactNode } from 'react';
export type HeaderProps = {
	// onClick?: React.MouseEventHandler<HTMLDivElement>;
	onClick: React.Dispatch<React.SetStateAction<boolean>>;
	// setIsShowLogoutModel?: (value: boolean) => void;
	logoutConformation: () => void;
};
export type SideBarProps = {
	show: boolean;
	menuHandler: React.Dispatch<React.SetStateAction<boolean>>;
	setToggleImage: React.Dispatch<React.SetStateAction<boolean>>;
	toggleHeaderImage?: boolean;
	logoutConformation: () => void;
};

export type Tab = {
    label: string;
    content: React.ReactNode;
    id: number
}

export type DynamicTabsProps = {
    tabs: Tab[];
	containerMinimize: boolean;
}

export type TextInputProps = {
	id?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	type?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	value?: string | number;
	error?: string | any;
	note?: string;
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	hidden?: boolean;
	loginInput?: boolean;
	max?: string;
	maxLength?: number | undefined;
	disabled: boolean;
	min?: string;
	className?: string;
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
	title?: string;
};

export type DropdownProps = {
	id?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder?: string | null;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	value?: number | string;
	error?: string;
	options: StatusOptionType[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	note?: string;
	className?: string;
};

export type DropdownOptionType = {
	name?: string | number;
	key?: number | string;
	code?: number | string;
	uuid?: string
};

export type RadioButtonProps = {
	value?: string | number;
	label?: string;
	checked?: boolean;
	id?: string;
	name?: string;
	className?: string;
	onChange: (value: string | number | boolean | any) => void;
	radioOptions?: IRadioButtonOptions[];
	IsRadioList?: boolean;
	error?: string;
	note?: string;
};

export type IRadioButtonOptions = {
	name: any;
	key: string | number;
	disabled?: boolean;
	info?: string;
};

export type SelectBoxProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name?: string;
	type?: 'text' | 'password';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string | number;
	error?: string;
	note?: string;
	option?: ISelectBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	placeholder?: string;
};
export type PermissionCheckBoxesProps = {
	parent?: any,
	parentPermissionUpdate?: any,
	parentIndex?: number
	childIndex?: any,
	child?: any,
	childPermissionUpdate?: any,
};
export type ISelectBoxOption = {
	name: string | number;
	key: number | string;
	disabled?: boolean;
};

export type TRadioButton = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name: string;
	error?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;
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
	error?: string;
	note?: string;
	option?: CheckBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	IsCheckList?: boolean;
};
export type CheckBoxOption = {
	id?: string;
	name: string;
	value: string;
	checked?: boolean;
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
export type NotificationIconProps = {
	onOpen: () => void;
};
export type JoditEditorProps = {
	onChange: (content: string) => void;
	value?: string;
};

export type EditorProps = {
	id: string;
	onChange: (content: string) => void;
	value?: string;
	config?: {
		readonly?: boolean;
		autofocus?: boolean;
		tabIndex?: number;
		askBeforePasteHTML?: boolean;
		askBeforePasteFromWord?: boolean;
		defaultActionOnPaste?: 'insert_clear_html' | 'insert_as_text' | 'insert_only_text';
		placeholder?: string;
		beautyHTML?: boolean;
		toolbarButtonSize?: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
		uploader: {
			insertImageAsBase64URI?: boolean;
		};
		limitChars?:number
	};
	error?: string;
	note?: string;
	label: string;
	required?: boolean;
	className?: string;
};

export type TextAreaInputProps = {
	id?: string;
	className?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
	value?: string | number;
	error?: string | string[] | null;
	note?: string;
	disabled?: boolean;
	hidden?: boolean;
	rows?: number;
	disabled: boolean;
	cols?: number;
	maxLength?: number;
	minLength?: number;
};