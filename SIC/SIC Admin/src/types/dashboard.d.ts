export type planListType = {
	id: number;
	planName: string;
    value: string | null;
};

export type kidsAgeType = {
	name:string;
    data:number[]
};

type gaRequestType = {
	name: string
}
type gaResponseType = {
	value: string
}
type gaRequestDateType = {
	startDate: string
	endDate: string
}
export type googleAnalyticsType = {
	dateRanges: gaRequestDateType[]
	dimensions:gaRequestType[]
    metrics:gaRequestType[]
};
export type googleAnalyticsResponse = {
	dimensionValues: gaResponseType[]
	metricValues:gaResponseType[]
};