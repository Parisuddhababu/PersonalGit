export type CreateCMSPage = {
	title: string;
	description: string;
};

export type CMSDataArr = {
	id: number;
	uuid: string;
	title: string;
	description: string;
	slug: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type CMSData = {
	status: number;
	message: string;
	data: {
		pages: CMSDataArr[];
		count: number;
	};
};

export type AddEditCMSData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: CMSDataArr | null;
};
