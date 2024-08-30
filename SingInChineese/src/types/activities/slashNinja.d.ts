export type DndSlashNinjaOrderSortableTableItem = {
    item: SlashNinjaActivityList;
    index: number;
};

export type DNDSlashNinjaOrderSort = {
    dndItemRow: SlashNinjaActivityList[];
    setNewOrder: (value: flashCardActivityList[]) => void;

};

export type SlashNinjaActivityList = { id: string, image: string };

export type DndSlashNinjaActivityList = {
    activityDataId?: string;
    id: string;
    simplifiedPhrases: [];
    traditionalPhrases: [];
}


export type SlashNinjaMatchingActivityDataArr = {
    activityDataId: string;
    simplifiedImage: string;
    simplifiedAudio: string;
    traditionalImage: string;
    traditionalAudio: string;
    traditionalText?: string;
    simplifiedText?: string;
    isImage?: boolean;
    order: number;
};

export type SlashNinjaTileData = {
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
    order: number;
    traditionalGameImageUrl: string;
    simplifiedGameImageUrl: string;
    traditionalGameAudioUrl: string;
    simplifiedGameAudioUrl: string;
};

export type SlashNinjaTileDataArr = SlashNinjaTileData[];

export type SlashNinjaActivitySubmitData = {
    activityTypeId: string;
    levelId?: string;
    topicId: string;
    lessonId: string;
    title: string;
    activityData?: activityDataArr[];
    isSkippable: boolean;
    isImage?: boolean;
    isFlashCardText?: boolean;
    isForSeasonal?: boolean;
    isMoving: boolean;

};