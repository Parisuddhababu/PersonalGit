export type MatchingActivityDataArr = {
	activityDataId: string;
	simplifiedImage: string;
	simplifiedAudio: string;
	traditionalImage: string;
	traditionalAudio: string;

	traditionalText?: string;
	simplifiedText?: string;
	simplifiedMatchingImage?: string;
	simplifiedMatchingAudio?: string;
	traditionalMatchingImage?: string;
	traditionalMatchingAudio?: string;

	isImageToImage?: boolean;
};

export type TileData = {
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

export type TileDataArr = TileData[];

export type MatchingActivitySubmitData = {
	activityTypeId: string;
	levelId?: string;
	topicId: string;
	lessonId: string;
	title: string;
	activityData?: activityDataArr[];
	isSkippable: boolean;
	isImageToImage?: boolean;
	isFlashCardText?: boolean;
	isForSeasonal?: boolean;
};
