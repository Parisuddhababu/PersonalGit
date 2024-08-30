import { LessonTitleTranslate } from './lessons';

export type MyArrayHelpers = {
	remove: (value: number) => void;
};

// Karaoke Activity
export type CreateKaraokeActivity = {
	karaokeTitleEnglish: string;
	title: [LessonTitleTranslate];
	simplifiedKaraokeLyricsFile?: string;
	traditionalKaraokeLyricsFile?: string;
	topicId: string;
	duration: number;
	isForSeasonal?: boolean;
	isTeacherTraditionalFile: boolean;
	isTeacherSimplifiedFile: boolean;
};

export type AddEditActivitiesData = {
	onSubmit: () => void;
	onClose: () => void;
	url: string;
	activityUuid: string;
	toggleActivity: (previousActivityUUID: string, previousActivityTypeUUID: string, nextActivityUUID: string, nextActivityTypeUUID: string) => void;
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	isMoving: boolean;
};

export type ActivityDataArr = {
	id: number;
	uuid: string;
	order: number;
	activityTypeId: string;
	title: string;
	activityTypeName: string;
	isActive: boolean;
};

export type ActivityItems = {
	id: number;
	uuid: string;
	name: string;
	slug: string;
};

export type AddEditActivity = {
	onSubmit: () => void;
	onClose: () => void;
	editData: ActivityDataArr | null;
	disableData: boolean;
};

export type ActivityData = {
	status: number;
	message: string;
	data: {
		record: number;
		data: ActivityDataArr[];
	};
};

export type DndActivityRowData = {
	dndItemRow: ActivityDataArr[];
	editRecord: (data: ActivityDataArr) => void;
	setNewOrder: (value: ActivityDataArr[]) => void;
	deleteActivityDataModal: (data: ActivityDataArr) => void;
	copyRecord: (data: string) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: ActivityDataArr) => void;
	onSelect: (data: string) => void;
	selectedActivities: string[];
};

export type DndActivitySortableTableItem = {
	item: ActivityDataArr;
	index: number;
	editRecord: (data: ActivityDataArr) => void;
	copyRecord: (data: string) => void;
	deleteActivityDataModal: (data: ActivityDataArr) => void;
	onChangeStatus: (data: ActivityDataArr) => void;
	count: number;
	onSelect: (data: string) => void;
	selectedActivities: string[];
};
export type MultiDelete = {
	activityIds: string[];
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	activityType: string;
};

export type CopyActivity = {
	activityId: string;
	isForSop: boolean;
	isForSeasonal: boolean;
};

export type fileUploadResponse = {
	fileName: string;
	fileUrl: string;
};

export type fileValues = {
	fileSize: number;
	fileTypes: string[];
};

export type InitializeMultipartUpload = {
	name: string;
};
export type GetPreSignedUrls = {
	fileKey: string;
	fileId: string;
	parts: number;
};

export type FinalGetPreSignedUrls = {
	fileKey: string;
	fileId: string;
	parts: {
		PartNumber: number;
	}[];
};

export type GetPreSignedUrlsArr = {
	PartNumber: number;
	signedUrl: string;
};

export type DNDStrokeOrderSort = {
	dndItemRow: strokeOrderSubmitList[];
	editRecord: (data: string) => void;
	setNewOrder: (value: strokeOrderSubmitList[]) => void;
	deleteStrokeOrder: (data: string) => void;
	editDisable: boolean;
};
export type DndStrokeOrderSortableTableItem = {
	item: strokeOrderSubmitList;
	index: number;
	editRecord: (data: string) => void;
	deleteStrokeOrder: (data: string) => void;
	editDisable: boolean;
};

export type ToggleId = {
	previousActivityUUID: string;
	previousActivityTypeUUID: string;
	nextActivityUUID: string;
	nextActivityTypeUUID: string;
};
