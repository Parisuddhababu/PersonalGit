export type CreateStrokeOrderActivity = {
	levelId?: string;
	topicId: string;
	lessonId: string;
	activityTypeId: string;
	leftSimplifiedEnglish: string;
	leftSimplifiedPinyin: string;
	leftSimplifiedChinese: string;
	simplifiedFileUrl: string;
	leftTraditionalEnglish: string;
	leftTraditionalPinyin: string;
	leftTraditionalChinese: string;
	rightSimplifiedEnglish: string;
	rightSimplifiedPinyin: string;
	rightSimplifiedChinese: string;
	rightTraditionalEnglish: string;
	rightTraditionalPinyin: string;
	rightTraditionalChinese: string;
	htmlSourceCode: string;
	isSkippable: boolean;
};

export type strokeOrderSubmitList = {
	id: string;
	activityDataId?: string;
	leftSimplifiedTitleEnglish: string;
	leftSimplifiedTitlePinyin: string;
	leftSimplifiedTitleChinese: string;
	simplifiedFileUrl: string;
	leftTraditionalTitleEnglish: string;
	leftTraditionalTitlePinyin: string;
	leftTraditionalTitleChinese: string;
	rightSimplifiedTitleEnglish: string;
	rightSimplifiedTitlePinyin: string;
	rightSimplifiedTitleChinese: string;
	rightTraditionalTitleEnglish: string;
	rightTraditionalTitlePinyin: string;
	rightTraditionalTitleChinese: string;
	htmlSourceCode: string;
};

type activityData = {
	activityDataId: string;
	leftSimplifiedTitleEnglish: string;
	leftSimplifiedTitlePinyin: string;
	leftSimplifiedTitleChinese: string;
	leftTraditionalTitleEnglish: string;
	leftTraditionalTitlePinyin: string;
	leftTraditionalTitleChinese: string;
	simplifiedFileUrl: string;

	rightSimplifiedTitleEnglish: string;
	rightSimplifiedTitlePinyin: string;
	rightSimplifiedTitleChinese: string;
	rightTraditionalTitleEnglish: string;
	rightTraditionalTitlePinyin: string;
	rightTraditionalTitleChinese: string;
	htmlSourceCode: string;
};
export type StrokeOrderSubmitData = {
	levelId?: string;
	topicId: string;
	lessonId: string;
	activityTypeId: string;
	activityData: activityData[];
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isMoving: boolean;
};
