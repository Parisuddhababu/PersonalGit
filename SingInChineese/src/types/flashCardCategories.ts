export type CreateFlashCardCategory = {
	categoryName: string;
};

export type categoryDataArr = {
	id: number;
	uuid: string;
	categoryName: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type AddEditCategory = {
	onClose: () => void;
	editData: categoryDataArr | null;
	onSubmit: () => void;
};

export type CategoryResponse = {
	status: number;
	message: string;
	data: {
		categories: categoryDataArr[];
		count: number;
	};
};

type TileData = {
	activityDataId: string;
	simplifiedTitleChinese: string;
	simplifiedAudioUrl: string;
	simplifiedImageUrl: string;
	simplifiedPronunciationText: string;
	traditionalTitleChinese: string;
	traditionalAudioUrl: string;
	traditionalImageUrl: string;
	traditionalPronunciationText: string;
	isTextToSpeech: boolean;
	isImageToImage?: boolean;
	isFlashCardText?: boolean;
	traditionalTitleEnglish: string;
	traditionalTitlePinyin: string;
	simplifiedTitleEnglish: string;
	simplifiedTitlePinyin: string;
};

export type AddFlashCard = {
	categoryId?: string;
	title: string;
	activityData?: TileData[] | UpdateFlashcard;
};

export type UpdateFlashcard = {
	activityDataId: string;
	traditionalImageUrl: string;
	simplifiedImageUrl: string;
	traditionalAudioUrl: string;
	simplifiedAudioUrl: string;
	traditionalTitleChinese: string;
	simplifiedTitleChinese: string;
	isTextToSpeech: boolean;
	simplifiedTitleEnglish: string;
	traditionalTitleEnglish: string;
	traditionalPronunciationText: string;
	simplifiedPronunciationText: string;
};

export type FlashCardArr = {
	id: number;
	uuid: string;
	topicId: string;
	title: string;
	titleTraditionalChinese: string;
	titleSimplifiedChinese: string;
	imageTraditionalChinese: string;
	imageSimplifiedChinese: string;
	audioTraditionalChinese: string;
	audioSimplifiedChinese: string;
	textTraditionalChinese: string;
	textSimplifiedChinese: string;
	isTextToSpeech: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type AddEditFlashCardData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: FlashCardArr | null;
	disableData: boolean;
};

export type FlashCardResponse = {
	status: number;
	message: string;
	data: {
		flashcards: FlashCardArr[];
		count: number;
	};
};

export type FlashCardEdit = {
	audioSimplifiedChinese: string;
	audioTraditionalChinese: string;
	createdAt: string;
	id: number;
	imageSimplifiedChinese: string;
	imageTraditionalChinese: string;
	isActive: boolean;
	isTextToSpeech: boolean;
	textSimplifiedChinese: string;
	textTraditionalChinese: string;
	title: string;
	titleSimplifiedChinese: string;
	titleTraditionalChinese: string;
	topicId: string;
	updatedAt: string;
	uuid: string;
	activityDataId: string;
};
