export type LoginInput = {
	email: string;
	password: string;
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
	show: boolean;
	onClick: () => void;
	showHandler:()=>void;
};
export type HeaderProps = {
	setIsActive: (value: boolean) => void;
};
