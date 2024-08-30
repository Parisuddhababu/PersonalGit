export interface CourseData {
	uuid: string,
	is_certification: string;
	prerequisite: string;
	course_image: string;
	banner_image: string;
	instructor_profile: string;
	instructor_name: string;
	instructor_qualification: string;
	category: {
		uuid: string
		name: string,
		description: string;
		image_url: string;
		status: boolean;
	},
	estimate_time:number;
	title: string,
	description: string
	is_editable: boolean;
	created_by: {
		user_type:number
	  }
}

export type PagenationParamsCousreTemplate={ 
    search? : string
    limit: number;
    page: number;
    sortField: string;
    sortOrder: string;
    category?: string[];}