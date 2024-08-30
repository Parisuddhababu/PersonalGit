import { gql } from '@apollo/client';

export const GET_CHAPTERS_BY_COURSE_ID = gql`query GetChapterByCourseId($chapterId: String!, $courseId: String!) {
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

export const GET_COURSE_DETAIL = gql`
query GetCourseDetailOverview($courseId: String!) {
  getCourseDetailOverview(courseId: $courseId) {
    message
    data {
      overview {
        id
        uuid
        title
        subtitle
        description
        total_duration
        reward_point
        level
        isAssign
        category {
          uuid
          name
          description
          status
          image_url
        }
        subCategory {
          uuid
          name
          description
          status
          image_url
        }
        is_certification
        prerequisite
        image
        thumbnails
        instructor_profile
        instructor_name
        instructor_qualification
        is_template
        createdAt
        highlights {
          id
          uuid
          name
        }
        learners {
          id
          uuid
        }
        chapters {
          id
          uuid
          name
          description
          order
        }
        lessons {
          id
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
        courseQuiz {
          id
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
              id
              uuid
              option
              is_correct
            }
          }
        }
        courseLearnersCount
      }
      contents {
        id
        uuid
        name
        description
        order
      }
      faqs {
        id
        uuid
        question
        answer
        order
      }
    }
  }
}`