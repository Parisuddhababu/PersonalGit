export type CreateSoundManagement = {
	eventName: string;
	audioFile: File | null;
	isLoop: boolean;
};

export type AddEditSoundManagement = {
	onClose: () => void;
	editData: SoundTypeArr | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type SoundTypeArr = {
	id: number;
	uuid: string;
	eventName: string;
	isActive: boolean;
	eventSoundFile: string;
	isLoop: boolean;
};

export type SoundManagementResponse = {
	status: number;
	message: string;
	data: {
		data: SoundTypeArr[];
		count: number;
	};
};
