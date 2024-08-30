import { gql } from '@apollo/client'

export const GET_USER_PROFILE = gql`
  query GetProfile {
    getProfile {
      message
      data {
        uuid
        user_type
        is_course_creator
        is_course_admin
        company_id {
          name
          uuid
        } 
        branch_locations {
          location
          uuid
          city
        }       
          
        first_name
        last_name
        email
        phone_number
        profile_picture
        organization
        preferred_language
        educational_interests
        is_required_reset_password
        introductory_page
        country_code {
          uuid
          phoneCode
          name
          countryCode
        }
        subscriber_id {
          uuid
          first_name
          last_name
          company_name
          address
          logo  
          thumbnail                  
        }
        role_name
      }
    }
  }
`