export type CreateSettings = {
	onboardingLoadTime: number;
	retryQuestionDuration: number;
	whyItWorksLoadTime: number;
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
