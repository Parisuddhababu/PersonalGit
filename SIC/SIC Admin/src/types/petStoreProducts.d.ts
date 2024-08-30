export type PetStoreProducts = {
	status: number;
	message: string;
	data: PetProductsArr[];
};

export type PetProductsArr = {
	id: number;
	uuid: string;
	productName: string;
	image: string;
	isForSeasonal: false;
	stars: number;
	isActive: boolean;
	impactOnPet: string;
	createdAt: string;
	updatedAt: string;
	createdBy: number;
	topicId: string;
	level: string;
	levelName: string;
	topicName: string;
	position: number;
};

export type AddEditPetProductsData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: PetProductsArr | null;
	disabled: boolean;
};

export type CreatePetProductData = {
	image: File | null;
	stars: number | string;
	productName: string;
	level?: string;
	topicId?: string;
	isForSeasonal: boolean;
	impactOnPet: number | string;
	position: number | string;
};
