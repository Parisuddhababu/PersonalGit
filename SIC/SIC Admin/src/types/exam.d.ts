export type CreateLevelData = {
	levelNumber: number | string;
	levelName: string;
	isForSop?: boolean;
};

export type LevelArr = {
	id: number;
	uuid: string;
	levelName: string;
	levelNumber: number;
	order: number;
	isActive: boolean;
	activityCount: number;
};

export type AddEditLevelData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: LevelArr | null;
};

export type LevelData = {
	status: number;
	message: string;
	data: {
		levels: LevelArr[];
		count: number;
	};
};
