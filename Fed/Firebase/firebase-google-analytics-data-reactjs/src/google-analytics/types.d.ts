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