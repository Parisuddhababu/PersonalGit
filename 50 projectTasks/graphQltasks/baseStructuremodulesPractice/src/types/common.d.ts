export type ResetPasswordNavParams = {
	token: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};
export type ChangeStatusProps = {
	onClose: () => void;
	changeStatus: () => void;
};

export type DeleteBannerProps = {
	onClose: () => void;
	deleteHandler: () => void;
};
export type DefaultPropsTypes = {
	showHandler: () => void;
};
export type photoModelProps = {
	onClose: () => void;
	data: string;
};

export type validationProps = {
	params?: number | string | undefined;
};
export type LanguageModelProps = {
	onClick: () => void;
	setState?: (value) => boolean;
};
export type ProfileModelProps = {
	profileHandler: () => void;
	logoutHandler: () => void;
};
export type ForgetModelProps = {
	onClose: () => void;
	onSubmit: () => void;
	show?: boolean;
	warningText?: string;
};
export type LogoutProps = {
	onClose: () => void;
	onSubmit: () => void;
	show?: boolean;
};
