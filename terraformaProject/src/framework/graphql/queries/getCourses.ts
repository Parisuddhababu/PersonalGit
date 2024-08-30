import { gql } from '@apollo/client';



export const GET_COURSES_TEMPLATES = gql`
query GetCourseTemplates($filterData: CourseTemplateListDto!) {
  getCourseTemplates(filterData: $filterData) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        estimate_time
        is_certification
        prerequisite
        course_image
        banner_image
        instructor_profile
        instructor_name
        instructor_qualification
        category {
          uuid
          name
          description
          status
          image_url
        }
        is_editable
        created_by {
          user_type
        }
      }
      count
    }
  }
}
`

export const GET_COURSE = gql`
 query GetCourses($courseData: GetCoursesDto!) {
  getCourses(courseData: $courseData) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        is_certification
        prerequisite
        instructor_profile
        instructor_name
        instructor_qualification
        course_image
        banner_image
        is_template
        is_editable
        estimate_time
        category {
          uuid
          name
          description
          status
          image_url
        }
        created_by {
          user_type
        }
      }
      count
    }
  }
}
`

export const GET_COURSE_BY_CATEGORY = gql`query GetCategoryWiseCourses($filterData: CategoryWiseCourseListDto!) {
  getCategoryWiseCourses(filterData: $filterData) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        estimate_time
        is_certification
        is_editable
        prerequisite
        course_image
        banner_image
        instructor_profile
        instructor_name
        instructor_qualification
        category {
          uuid
          name
          description
          status
          image_url
        }
        created_by{
        user_type
        }
      }
      count
    }
  }
}`

export const GET_COURSE_BY_PLAYLIST = gql`
  query GetPlaylistWiseCourses($filterData: GetCoursesAsPlaylistIdDto!) {
  getPlaylistWiseCourses(filterData: $filterData) {
    message
    data {
      courses {
        uuid
        title
        subtitle
        description
        estimate_time
        is_certification
        is_editable
        prerequisite
        course_image
        banner_image
        instructor_profile
        instructor_name
        instructor_qualification
        category {
          uuid
          name
          description
          status
          image_url
        }
        created_by{
        user_type
        }
      }
      count
    }
  }
}
`

export const GET_ASSIGN_COURSES = gql`
  query GetAssignedUserCoursesList($inputData: GetUserCoursesDto!) {
    getAssignedUserCoursesList(inputData: $inputData) {
      message
      data {
        courses {
          uuid
          title
          subtitle
          description
          total_duration
          reward_point
          level
          is_certification
          prerequisite
          image
          thumbnails
          instructor_profile
          instructor_name
          instructor_qualification
          is_template
          category_uuid
          category_name
        }
        count
      }
    }
  }
`

export const GET_PLAYLIST_DATA = gql`
  query GetPlayList($sortOrder: String!, $sortField: String!, $limit: Float!, $page: Float!, $search: String!) {
    getPlayLists(sortOrder: $sortOrder, sortField: $sortField, limit: $limit, page: $page, search: $search) {
      data {      
        count
        playlists {
          name
          uuid
          image
          course_count
        }
      }
      message
    }
  }
`

export const GET_COURSES_DETAILS = gql`
  query GetCourseDetailOverview($courseId: String!) {
    getCourseDetailOverview(courseId: $courseId) {
      message
      data {
        overview {
          uuid
          title
          subtitle
          description
          total_duration
          reward_point
          level
          is_certification
          prerequisite
          image
          thumbnails
          instructor_profile
          instructor_name
          instructor_qualification
          is_show_certificate_tab
          is_template
          createdAt
          courseLearnersCount
          isAssign
          is_course_completed
          is_quiz_completed
          category {
            uuid
            name
            description
            status
            image_url
          }
          chapters {
            uuid
            name
            order
            lessons {
              uuid
              name
              order
              video_url
              title
              attachment
              image
              url
              video_time
            }
          }
          courseQuiz {
            uuid
            title
            time_limit
            time_type
            passing_mark
            certification_generate
            is_show_correct_ans
            courseQuizQuestions {
              uuid
              question
              courseQuizQuestionOptions {
                uuid
                option
                is_correct
              }
            }
          }
          highlights {
            uuid
            name
          }
        }
        contents {
          uuid
          name
          order
          lessons {
            uuid
            name
            order
            video_url
            title
            attachment
            image
            url
            video_time
            video_last_check_time
            is_lesson_completed
          }
          is_chapter_started
          is_chapter_completed
        }
        faqs {
          uuid
          question
          answer
          order
        }
      }
    }
  }
`

export const GET_COURSE_BY_ID = gql`
  query GetCourseById($courseId: String!) {
    getCourseById(courseId: $courseId) {
      message
      data {
        language
        category {
          description
          image_url
          name
          status
          uuid
        }
        chapters {
          uuid
          name
          description
          order
          lessons {
            uuid
            name
            description
            order
            video_url
            title
            attachment
            video_time
            image
            url
          }
        }
        courseQuiz {
          uuid
          title
          time_limit
          time_type
          passing_mark
          certification_generate
          is_show_correct_ans
          courseQuizQuestions {
            uuid
            question
            order
            courseQuizQuestionOptions {
              uuid
              option
              is_correct
              order
            }
          }
        }
        description
        faqs {
          uuid
          question
          answer
          order
        }
        highlights {
          uuid
          name
        }
        image
        instructor_name
        instructor_profile
        instructor_qualification
        is_certification
        is_template
        learners {
          uuid
          role {
            uuid
            name
            description
            status
          }
        }
        level
        prerequisite
        subCategory {
          uuid
          name
          description
          status
          image_url
        }
        course_playlists {
          uuid
          playlist {
            uuid
            name
          }
        }
        subtitle
        thumbnails
        title
        total_duration
        uuid
      }
    }
  }
`;

export const GET_COURSES_DETAILS_BY_ID_NEW = gql`query GetCourseDetailsById($courseId: String!) {
  getCourseDetailsById(courseId: $courseId) {
    message
    data {
      id
      uuid
      title
      description
      category {
        uuid
        name
        description
        status
        image_url
      }
      prerequisite
      course_image
      banner_image
      instructor_profile
      estimate_time
      is_certification
      instructor_name
      course_learner_count
      instructor_qualification
      is_template
      is_draft
      createdAt
      highlights {
        id
        uuid
        name
      }
      is_published
      playlists {
        uuid
        name
        image
      }
      is_editable
      availability
      is_assign
      template_uuid
    }
  }
}`;

export const GET_COURSE_CHAPTER_DETAILS = gql`query FindCourseChaptersDetails($courseId: String!) {
  findCourseChaptersDetails(courseId: $courseId) {
    message
    data {
      courseChapters {
        uuid
        title
        type
        order
        user_course_progress {
          uuid
          video_last_check_time
          is_chapter_completed
        }
        chapter_content {
          uuid
          image
          description
          youtube_url
          pdf_url
        }
        chapter_quiz {
          uuid
          question
          order
          type
          quiz_question {
            uuid
            option
            is_correct
            order
          }
        }
      }
      template_uuid
      course_uuid
    }
  }
}`;

export const GET_FAQS_COURSE_DETAILS = gql`query GetFaqsByCourseDetails($courseId: String!) {
  getFaqsByCourseDetails(courseId: $courseId) {
    message
    data{
      faqData {
      uuid
      question
      answer
      order
    }
    template_uuid
    course_uuid
    }
  }
}`;

export const GET_COURSE_PERMISSIONS = gql`query GetCoursePermissions($courseId: String!) {
  getCoursePermissions(courseId: $courseId) {
    message
    data {
      is_delete
      is_edit
      is_archive
    }
  }
}`

export const GET_CHAPTER_BY_COURSE_ID = gql`query GetChapterByCourseId($chapterId: String!, $courseId: String!) {
  getChapterByCourseId(chapterId: $chapterId, courseId: $courseId) {
    message
    data {
      uuid
      title
      type
      order
      user_course_progress {
        uuid
        video_last_check_time
        is_chapter_completed
      }
      chapter_content {
        uuid
        image
        description
        youtube_url
        pdf_url
      }
      chapter_quiz {
        uuid
        question
        order
        type
        quiz_question {
          uuid
          option
          is_correct
          order
        }
      }
    }
  }
}`