export type CreateSettings = {
	onboardingLoadTime: number;
	retryQuestionDuration: number;
	whyItWorksLoadTime: number;
	ios: string;
	android: string;
	iosB2B: string;
	androidB2B: string;
};

export type FileDataProps = {
	name: string;
};

export type CreateStarManagement = {
	moduleUUID?: string;
	moduleName: string;
	starCount: number;
	isActive?: boolean;
};

export type StarObj = {
	uuid: string;
	moduleName: string;
	starCount: number;
	moduleKey: string;
	isActive: boolean;
};
export type AdAndStarResponse = {
	status: number;
	message: string;
	moduleList: StarObj[];
	count: number;
};

export type StartEditProps = {
	onClose: () => void;
	editData: StarObj | null;
	disableData: boolean;
	onSubmit: () => void;
};
