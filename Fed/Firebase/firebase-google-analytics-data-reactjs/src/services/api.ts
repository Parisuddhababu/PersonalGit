import axios from "axios";
import { googleAnalyticsType } from "../google-analytics/types";

type APIMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';
type APIData = googleAnalyticsType | undefined;
export const APIService = {
	request: (method: APIMethods, url: string, data: APIData = undefined, headers = {}) => {
		const config = {
			method,
			url,
			data,
			headers
		};
		return axios.request(config);
	},
	getData: (url: string) => {
		return APIService.request('get', url);
	},
	postData: (url: string, data: APIData, headers = {}) => {
		return APIService.request('post', url, data, headers);
	}
};