import { ReactComponentElement } from 'react';

export type LoginInput = {
	email: string;
	password: string;
	isForB2B?: boolean;
};

export type ForgotPasswordInput = {
	email: string;
};

export type ResetPasswordInput = {
	password: string;
	confirmPassword: string;
};
export type SidebarProps = {
	isActive: boolean;
	setIsActive: (value: boolean) => void;
};
export type SidebarMenuItem = {
	id: number;
	title: string;
	path: string;
	icon: ReactComponentElement;
};
export type SidebarMenu = {
	id: number;
	title: string;
	path: string;
	icon: ReactComponentElement;
	permissions?: string[];
}[];

export type HeaderProps = {
	setIsActive: (value: boolean) => void;
	setIsClose: boolean;
};

export type TranslateParams = { q: string; target: string };
