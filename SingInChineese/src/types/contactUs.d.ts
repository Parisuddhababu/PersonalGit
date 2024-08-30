export type ImageObj = object;

export type ContactUsData = {
	id: string;
	uuid: string;
	reasonForContact: string;
	description: string;
	phoneNumber: string;
	image: ImageObj;
	isResolved: boolean;
	createdAt: string;
};

export type ContactUsResponse = {
	status: number;
	message: string;
	data: {
		data: ContactUsData[];
		count: number;
	};
};

export type ContactUsStatus = {
	isResolved: boolean;
};
