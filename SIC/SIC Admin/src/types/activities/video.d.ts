type videoTitleArr = {
	chinese: string;
	pinyin: string;
};

export type CreateVideoActivityForm = {
	levelId?: string;
	topicId: string;
	lessonId: string;
	activityTypeId: string;
	title: string;
	simplifiedTitle: videoTitleArr[];
	traditionalTitle: videoTitleArr[];
	simplifiedFile: string;
	simplifiedAudio?: File | null;
	traditionalFile: string;
	traditionalAudio?: File | null;
	isSkippable: boolean;
	isForSeasonal?: boolean;
};

export type VideoActivitySubmitData = {
	activityTypeId: string;
	levelId?: string;
	topicId: string;
	lessonId: string;
	title: string;
	activityData: {
		traditionalTitle: videoTitleArr[];
		traditionalFile: string;
		simplifiedTitle: videoTitleArr[];
		simplifiedFile: string;
	};
	isSkippable: boolean;
	isForSeasonal?: boolean;
};
