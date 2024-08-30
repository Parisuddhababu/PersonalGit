export type RunningGameMatchingActivityDataArr = {
    activityDataId: string;
    simplifiedImage: string;
    simplifiedAudio: string;
    traditionalImage: string;
    traditionalAudio: string;
    traditionalText?: string;
    simplifiedText?: string;
    isImage?: boolean;
};

export type RunningTileData = {
    activityDataId: string;
    simplifiedTitleChinese: string;
    simplifiedAudioUrl: string;
    simplifiedImageUrl: string;
    simplifiedPronunciationText: string;
    traditionalTitleChinese: string;
    traditionalAudioUrl: string;
    traditionalImageUrl: string;
    traditionalPronunciationText: string;
    isImage?: boolean;
    isFlashCardText?: boolean;
    traditionalTitleEnglish: string;
    traditionalTitlePinyin: string;
    simplifiedTitleEnglish: string;
    simplifiedTitlePinyin: string;
    isMarked: boolean;
    simplifiedGameAudioUrl: string;
    traditionalGameImageUrl: string;
    traditionalGameAudioUrl: string;
    simplifiedGameImageUrl: string;
};

export type RunningTileDataArr = RunningTileData[];

export type RunningGameActivitySubmitData = {
    activityTypeId: string;
    levelId?: string;
    topicId: string;
    lessonId: string;
    title: string;
    incorrectAudio: File | string | null;
    activityData?: activityDataArr[];
    isSkippable: boolean;
    isImage?: boolean;
    isFlashCardText?: boolean;
    isForSeasonal?: boolean;
    isMoving: boolean;
};