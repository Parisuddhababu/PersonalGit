export type CreateCountryData = {
	countryCode: string;
	phoneCode: string | number;
	countryName: string;
};

export type CountryArr = {
	id: number;
	uuid: string;
	countryCode: string;
	phoneCode: string | number;
	countryName: string;
	isActive: boolean;
};

export type AddEditCountryData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: CountryArr | null;
	disabled: boolean;
};

export type CountryData = {
	status: number;
	message: string;
	data: {
		data: {
			id: number;
			uuid: string;
			countryCode: string;
			phoneCode: string | number;
			countryName: string;
			isActive: boolean;
		}[];
		count: number;
	};
};
