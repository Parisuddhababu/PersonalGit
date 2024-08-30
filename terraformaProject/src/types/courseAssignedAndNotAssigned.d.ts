export interface CourseData {
	uuid: string,
	category: {
		name: string,
		uuid: string
	},
	total_duration: number,
	title: string,
	is_certification: string,
	prerequisite: string,
	description: string,
	instructor_name: string,
	instructor_profile: string,
	percentage?: number | null,
	instructor_qualification: string,
	course_image: string,
	banner_image: string,
	is_template: boolean,
	is_editable: boolean,
	estimate_time: number,
	created_by: {
		user_type: number
	}
	totalChapters?: number
	chaptersCompleted?: number
}

export type AssignedCoursesProps = {
	slider: boolean
};

export type CoursesInProgressProps = {
	slider: boolean;
};