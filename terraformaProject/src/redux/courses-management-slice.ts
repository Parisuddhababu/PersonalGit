/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChaptersProgressData } from '@components/whatIsOrganicWaste/courseLearningProgress/courseContent';
import { PUBLISH_COURSE_TYPES } from '@config/constant';
import { createSlice, } from '@reduxjs/toolkit';
import { ChaptersType, CourseClone, CourseDetailsData, PlanYourCourseDetails, TranformationArrayType } from 'src/types/common';

const initialState: YourStateType = {
  course_id: '',
  test: '',
  activeStep: 0,
  createNewAccountStep: 0,
  planYourCourseDetails: {
    selectCourse: '',
    id: '',
    highlights1_id: '',
    highlights2_id: '',
    highlights3_id: '',
    highlights4_id: '',
    highlights1: '',
    highlights2: '',
    highlights3: '',
    highlights4: '',
    courseSubTitle: '',
    courseTitle: '',
    qualification: '',
    prerequisite: '',
    instructorName: '',
    category: '',
    assessmentCertification: false,
    courseDescription: '',
    addPrerequisite: false,
    categoryName: '',
    subCategoryName: '',
    bannerImageUploadFileName: '',
    instructorImageUploadFileName: '',
    courseImageUploadFileName: '',
  },
  createYourContentDetails: {
    chapterType: 1,
    delete_chapter_ids: [],
    chapters: []
  },
  addYourFAQDetails: [],
  createQuizDetails: [],
  courseDetailsPage: {},
  quizResultData: {},
  selectedOptions: [],
  activeURL: '',
  videoTime: 0,
  playlistData: [],
  learnersData: [],
  highlightsData: [],
  show: false,
  overview: {
    uuid: '',
    title: '',
    subtitle: '',
    description: '',
    estimate_time: 0,
    level: 0,
    reward_point: 0,
    is_certification: false,
    prerequisite: '',
    image: '',
    instructor_profile: '',
    thumbnails: '',
    instructor_name: '',
    instructor_qualification: '',
    is_template: false,
    course_learners_count: '',
    createdAt: '',
    category: {
      name: '',
      uuid: ''
    },
    highlights: [],
	is_assign:false,
  is_draft:false ,
  is_published: false
  },
  stepFourData: {
    is_certification: false,
    estimate_time: 0,
    playlist_ids: [],
    availability: PUBLISH_COURSE_TYPES.AVAILABLE_FOR_ALL,
    is_editable: false,
  },
  is_published: false,
  is_draft: false,
  activeChapter:null,
  template: [],
  percentage:0,
  nextEnable:false,
  courseContent:[],
  chaptersCount:0,
  activeIndex:0,
  isShowDownloadCertificate:false,
  update:false,
  play:true,
  finished:false,
  moveNext:true,
};

const resetInitialState: YourStateType = {
  course_id: '',
  test: '',
  activeStep: 0,
  createNewAccountStep: 0,
  planYourCourseDetails: {
    selectCourse: '',
    id: '',
    highlights1_id: '',
    highlights2_id: '',
    highlights3_id: '',
    highlights4_id: '',
    highlights1: '',
    highlights2: '',
    highlights3: '',
    highlights4: '',
    courseSubTitle: '',
    courseTitle: '',
    prerequisite: '',
    qualification: '',
    instructorName: '',
    category: '',
    assessmentCertification: false,
    addPrerequisite: false,
    courseDescription: '',
    categoryName: '',
    subCategoryName: '',
    courseImageUploadFileName: '',
    bannerImageUploadFileName: '',
    instructorImageUploadFileName: '',
  },
  createYourContentDetails: {
    chapterType: 1,
    delete_chapter_ids: [],
    chapters: []
  },
  addYourFAQDetails: [],
  createQuizDetails: [],
  courseDetailsPage: {},
  selectedOptions: [],
  quizResultData: {},
  activeURL: '',
  videoTime: 0,
  learnersData: [],
  playlistData: [],
  highlightsData: [],
  show: false,
  overview: {
    uuid: '',
    title: '',
    subtitle: '',
    description: '',
    estimate_time: 0,
    reward_point: 0,
    level: 0,
    is_certification: false,
    prerequisite: '',
    image: '',
    thumbnails: '',
    instructor_profile: '',
    instructor_name: '',
    instructor_qualification: '',
    is_template: false,
    createdAt: '',
    course_learners_count: '',
    category: {
      uuid: '',
      name: ''
    },
    highlights: [],
	is_assign:false,
    is_draft:false,
    is_published: false
  },
  stepFourData: {
    is_certification: false,
    estimate_time: 0,
    availability: PUBLISH_COURSE_TYPES.AVAILABLE_FOR_ALL,
    playlist_ids: [],
    is_editable: false,
  },
  is_published: false,
  is_draft: false,
  template: [],
  activeChapter:null,
  percentage:0,
  nextEnable:false,
  chaptersCount:0,
  courseContent:[],
  activeIndex:0,
  isShowDownloadCertificate:false,
  play:true,
  update:false,
  finished:false,
  moveNext:true
};

const coursesManagementSlice = createSlice({
  name: 'coursesManagementDetails',
  initialState,
  reducers: {
    setPlanYourCourseDetails: (state, action) => {
      state.planYourCourseDetails = action.payload
    },
    setCreateYourContentDetails: (state, action) => {
      state.createYourContentDetails = action.payload
    },
    setAddYourFAQDetails: (state, action) => {
      state.addYourFAQDetails = action.payload
    },
    setCreateQuizDetails: (state, action) => {
      state.createQuizDetails = action.payload
    },
    setCourseDetailsPage: (state, action) => {
      state.courseDetailsPage = action.payload
    },
    setActiveStep: (state) => {
      state.activeStep = state.activeStep + 1
    },
    setBackActiveStep: (state) => {
      state.activeStep = state.activeStep - 1
    },
    setResetStep: (state) => {
      state.activeStep = 0
    },
    setCustomStep: (state, action) => {
      state.activeStep = action.payload
    },
    setCreateNewAccountStep: (state) => {
      state.createNewAccountStep = state.createNewAccountStep + 1
    },
    setBackCreateNewAccountStep: (state) => {
      state.createNewAccountStep = state.createNewAccountStep - 1
    },
    setCreateNewAccountStepReset: (state) => {
      state.createNewAccountStep = 0;
    },
    setResetCreateNewAccountStep: (state) => {
      state.createNewAccountStep = 0
    },
    setCustomCreateNewAccountStep: (state, action) => {
      state.createNewAccountStep = action.payload
    },
    setSelectedOptions: (state, action) => {
      state.selectedOptions = action.payload
    },
    setQuizResultData: (state, action) => {
      state.quizResultData = action.payload
    },
    setActiveURL: (state, action) => {
      state.activeURL = action.payload
    },
    setLearnersData: (state, action) => {
      state.learnersData = action.payload
    },
    setPlaylistData: (state, action) => {
      state.playlistData = action.payload
    },
    setHighlightsData: (state, action) => {
      state.highlightsData = action.payload
    },
    setShow: (state, action) => {
      state.show = action.payload
    },
    setVideoTime: (state, action) => {
      state.videoTime = action.payload
    },
    setResetAllData: (state) => {
      state.activeStep = 0;
      state.planYourCourseDetails = {
        selectCourse: '',
        id: '',
        highlights1_id: '',
        highlights2_id: '',
        highlights3_id: '',
        highlights4_id: '',
        highlights1: '',
        highlights2: '',
        highlights3: '',
        highlights4: '',
        courseSubTitle: '',
        courseTitle: '',
        prerequisite: '',
        qualification: '',
        instructorName: '',
        category: '',
        assessmentCertification: false,
        addPrerequisite: false,
        courseDescription: '',
        categoryName: '',
        subCategoryName: '',
        courseImageUploadFileName: '',
        bannerImageUploadFileName: '',
        instructorImageUploadFileName: '',
      };
      state.addYourFAQDetails = [];
      state.createQuizDetails = [];
      state.courseDetailsPage = {};
      state.selectedOptions = [];
      state.quizResultData = {};
      state.highlightsData = [];
    },
    setResetAllCoursesData: () => {
      return resetInitialState;
    },
    setCousreOverView: (state, action) => {
      state.overview = action.payload;
    },
    setCourseId: (state, action) => {
      state.course_id = action.payload
    },
    setSetpFourDetails: (state, action) => {
      state.stepFourData = action.payload;
    },
    setIsPublished: (state, action) => {
      state.is_published = action.payload;
    },
    setIsDraft: (state, action) => {
      state.is_draft = action.payload;
    },
    setTemplateData: (state, action) => {
      state.template = action.payload;
    },
    setActiveChapter: (state, action) => {
      state.activeChapter = action.payload;
    },
    setCoursePercentage:(state,action)=>{
      state.percentage = action.payload;
    },
    setNextEnable:(state,action)=>{
      state.nextEnable=action.payload;
    },
    setChaptersCount:(state,action)=>{
      state.chaptersCount=action.payload;
    },
    setCourseContent:(state,action)=>{
      state.courseContent=action.payload;
    },
    setActiveIndex:(state,action)=>{
      state.activeIndex = action.payload;
    },
    setIsShowDownloadCertificate:(state,action)=>{
      state.isShowDownloadCertificate=action.payload;
    },
    setPlay:(state,action)=>{
      state.play = action.payload;
    },
    setUpdate:(state,action)=>{
      state.update = action.payload;
    },
    setFinished:(state,action)=>{
      state.finished =action.payload;
    },
    setUpdateCourseContent:(state,action)=>{
      const content = state.courseContent ; 
      content.map((data,index:number)=>{
        if(index===action.payload.index){
          return {...data,user_course_progress:{is_chapter_completed:action.payload.is_chapter_completed,video_last_check_time:data?.user_course_progress?.video_last_check_time}};
        }
        return data;
      })
      state.courseContent= content;
    },
    setActive:(state,action)=>{
      state.activeStep= action.payload;
    },
    setMoveNext:(state,action)=>{
      state.moveNext=action.payload;
    }
  },
});

export const {
  setPlanYourCourseDetails,
  setVideoTime,
  setResetAllCoursesData,
  setCreateNewAccountStepReset,
  setShow,
  setResetAllData,
  setCreateNewAccountStep,
  setHighlightsData,
  setActiveURL,
  setLearnersData,
  setPlaylistData,
  setQuizResultData,
  setSelectedOptions,
  setBackCreateNewAccountStep,
  setResetCreateNewAccountStep,
  setCustomCreateNewAccountStep,
  setActiveStep,
  setBackActiveStep,
  setResetStep,
  setCreateYourContentDetails,
  setAddYourFAQDetails,
  setCreateQuizDetails,
  setCustomStep,
  setCourseDetailsPage,
  setCousreOverView,
  setCourseId,
  setSetpFourDetails,
  setIsPublished,
  setIsDraft,
  setTemplateData,
  setActiveChapter,
  setCoursePercentage,
  setNextEnable,
  setChaptersCount,
  setCourseContent,
  setActiveIndex,
  setIsShowDownloadCertificate,
  setPlay,
  setUpdate,
  setFinished,
  setUpdateCourseContent,
  setActive,
  setMoveNext
} = coursesManagementSlice.actions;
export default coursesManagementSlice.reducer;

export type YourStateType = {
  course_id: string;
  test: string,
  planYourCourseDetails: PlanYourCourseDetails,
  activeStep: number,
  createNewAccountStep: number,
  createYourContentDetails: {
    chapterType: number,
    delete_chapter_ids: string[],
    chapters: ChaptersType[]
  },
  addYourFAQDetails: any,
  createQuizDetails: any,
  courseDetailsPage: CourseDetailsData | object,
  selectedOptions: Array<{ uuid: string; option: string }>,
  quizResultData: object,
  activeURL: string,
  videoTime: number,
  learnersData: [],
  playlistData: [],
  highlightsData: [],
  show: boolean;
  overview: CourseClone;
  stepFourData: {
    is_certification: boolean,
    estimate_time: number,
    availability: number,
    playlist_ids: {
      uuid: string,
      name: string,
      image: string
    }[],
    is_editable: boolean,
  }
  is_published: boolean;
  is_draft: boolean;
  template: { name: string, key: string }[];
  activeChapter: TranformationArrayType|null;
  percentage:number;
  nextEnable:boolean;
  chaptersCount:number;
  courseContent:ChaptersProgressData[];
  activeIndex:number;
  isShowDownloadCertificate:boolean;
  play:boolean;
  update:boolean;
  finished:boolean;
  moveNext:boolean;
}
