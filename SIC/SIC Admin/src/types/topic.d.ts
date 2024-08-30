export type CreateTopic = {
	levelId: string;
	name: string;
	namePinging: string;
	nameTraditionalChinese: string;
	nameSimplifiedChinese: string;
	rewardStars: number | string;
};

export type DeleteTopicProps = {
	onClose: () => void;
	deleteTopic: () => void;
};

export type TopicChangeProps = {
	onClose: () => void;
	changeTopicStatus: () => void;
};

export type FilterTopicProps = {
	name: string;
	status: string;
};

export type TopicProps = {
	onSearchTopic: (value: FilterTopicProps) => void;
};

export type DeleteTopicProps = {
	onClose: () => void;
	deleteTopic: () => void;
};

export type TopicData = {
	status: number;
	message: string;
	data: {
		topics: {
			createdAt: string;
			id: number;
			isActive: boolean;
			levelId: string;
			name: string;
			namePinging: string;
			nameSimplifiedChinese: string;
			nameTraditionalChinese: string;
			order: number;
			updatedAt: string;
			uuid: string;
			rewardStars: number;
		}[];
	};
};

export type TopicDataArr = {
	createdAt: string;
	id: number;
	isActive: boolean;
	levelId: string;
	name: string;
	namePinging: string;
	nameSimplifiedChinese: string;
	nameTraditionalChinese: string;
	order: number;
	updatedAt: string;
	uuid: string;
	rewardStars: number;
};

export type AddEditTopicData = {
	onClose: () => void;
	editData: TopicDataArr | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type DndTopicRowData = {
	dndItemRow: TopicDataArr[];
	showDetails: (data: TopicDataArr) => void;
	editRecord: (data: TopicDataArr) => void;
	setNewOrder: (value: TopicDataArr[]) => void;
	deleteLevelDataModal: (data: TopicDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: TopicDataArr) => void;
	addEditKaraoke: (data: TopicDataArr) => void;
};
export type DndTopicSortableTableItem = {
	item: TopicDataArr;
	index: number;
	showDetails: (data: TopicDataArr) => void;
	editRecord: (data: TopicDataArr) => void;
	deleteLevelDataModal: (data: TopicDataArr) => void;
	onChangeStatus: (data: TopicDataArr) => void;
	addEditKaraoke: (data: TopicDataArr) => void;
	count: number;
};

export type ActivityKaraokeData = {
	onSubmit: () => void;
	onClose: () => void;
	editData?: TopicDataArr | null;
	disabled?: boolean;
	url?: string;
};

export type KaraokeResponse = {
	status: number;
	message: string;
	data: {
		id: number;
		uuid: string;
		topicId: number;
		karaokeTitleEnglish: string;
		duration: string;
		simplifiedKaraokeLyricsFile: string;
		traditionalKaraokeLyricsFile: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
		title: {
			pinyin: string;
			traditional: string;
			simplified: string;
		}[];
	};
};
