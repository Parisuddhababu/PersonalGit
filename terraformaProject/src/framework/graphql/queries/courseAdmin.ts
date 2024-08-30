import { gql } from '@apollo/client';

export const FETCH_COURSE_ADMINS=gql`query FindAllCourseAdministrator($filterData: CourseCreateAdministratorListDto!) {
  findAllCourseAdministrator(filterData: $filterData) {
    message
    data {
      data {
        full_name
        user_type
        user_uuid
        locations {
          uuid
          location
        }

      }
      count
    }
  }
}`;

export const GET_COURSE_ADMIN_BY_ID=gql`query GetCourseAdministratorById($userUuid: String!) {
  getCourseAdministratorById(userUUID: $userUuid) {
    message
    data {
      uuid
      user {
        id
        email
        uuid
      }
      location {
        uuid
        location
        city
      }
    }
  }
}`;
