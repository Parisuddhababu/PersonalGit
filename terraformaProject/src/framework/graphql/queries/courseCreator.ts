import { gql } from '@apollo/client';

export const FETCH_COURSE_CREATORS = gql`query FindAllCourseCreator($filterData: CourseCreatorListDto!) {
  findAllCourseCreator(filterData: $filterData) {
    message
    data {
      data {
        user_uuid
        full_name
        locations {
          location
          uuid
        }
      }
      count
    }
  }
}`;

export const GET_ALL_LOCATIONS = gql`query GetLocations {
  getLocations {
    message
    data {
      uuid
      location      
    }
  }
}`;

export const GET_ALL_EMPLOYEES=gql`query GetAllSubscriberUsers($userType: GetUserDto!) {
  getAllSubscriberUsers(userType: $userType) {
    message
    data {
      email
      uuid
      status
      pronounce
      first_name
      last_name
    }
  }
}`;

export const GET_COURSE_CREATOR_BY_ID = gql`query GetCourseCreatorById($userUuid: String!) {
  getCourseCreatorById(userUUID: $userUuid) {
    message
    data {
      uuid
      user {
        first_name 
        last_name
        email
        uuid
      }
      location {
        uuid
        location
      }
    }
  }
}`;

export const DELETE_COURSE_CREATOR_LOCATIONS=gql`mutation DeleteCourseCreator($courseCreatorIds: [String!]!) {
  deleteCourseCreator(courseCreatorIds: $courseCreatorIds) {
    message
  }
}`;






