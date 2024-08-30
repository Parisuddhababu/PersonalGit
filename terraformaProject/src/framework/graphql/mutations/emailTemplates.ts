import { gql } from '@apollo/client';

export const DELETE_EMAIL_TEMPLATE = gql`
  mutation DeleteTemplate($templateId: String!) {
    deleteTemplate(templateId: $templateId) {
      message
    }
  }
`

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($templateData: CreateTemplatesDto!) {
    createTemplate(templateData: $templateData) {
      message
      data {
        uuid
        title
        description
        status
      }
    }
  }
`

export const SEND_ANNOUNCEMENT = gql`
  mutation SendAnnouncements($announcementData: SendAnnouncementDto!) {
    sendAnnouncements(announcementData: $announcementData) {
      message
      data {
        title
        description
        users {
          email
          uuid
          first_name
          last_name
          phone_number
        }
      }
    }
  }
`

export const EMAIL_TEMPLATE_CHANGE_STATUS = gql`
  mutation ActivateDeActivateTemplate($templateId: String!) {
    activateDeActivateTemplate(templateId: $templateId) {
      message
    }
  }
`

export const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($templateData: UpdateTemplatesDto!) {
    updateTemplate(templateData: $templateData) {
      message
      data {
        uuid
        title
        description
        status
      }
    }
  }
`
export const DELETE_SYSTEM_EMAIL_TEMPLATE = gql`
  mutation DeleteSystemEmailTemplate($systemEmailTemplateId: String!) {
    deleteSystemEmailTemplate(systemEmailTemplateId: $systemEmailTemplateId) {
      message
    }
  }
`
export const EMAIL_SYSTEM_TEMPLATE_CHANGE_STATUS = gql`
  mutation ActivateDeActivateSystemEmailTemplate($systemEmailTemplateId: String!) {
    activateDeActivateSystemEmailTemplate(systemEmailTemplateId: $systemEmailTemplateId) {
      message
    }
  }
`
export const UPDATE_SYSTEM_TEMPLATE = gql`
  mutation UpdateSystemEmailTemplate($systemEmailTemplateData: UpdateTemplateDto!) {
    updateSystemEmailTemplate(systemEmailTemplateData: $systemEmailTemplateData) {
      message
      data {
        uuid
        name
        title
        description
        status
      }
    }
  }
`