import { gql } from '@apollo/client';
export const UPDATE_MANAGE_RULES_SET = gql`
  mutation UpdateSetRule(
    $updateSetRuleId: Int
    $ruleName: String
    $description: String
    $priority: priority
    $onAction: on_action
    $status: Int
  ) {
    updateSetRule(
      id: $updateSetRuleId
      rule_name: $ruleName
      description: $description
      priority: $priority
      on_action: $onAction
      status: $status
    ) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const UPDATE_MANAGE_RULES_SETS_STATUS = gql`
  mutation UpdateRuleStatus($updateRuleStatusId: Int, $status: Int) {
    updateRuleStatus(id: $updateRuleStatusId, status: $status) {
      data {
        id
        uuid
        rule_name
        description
        priority
        on_action
        status
        created_at
        updated_at
      }
      meta {
        message
        messageCode
        statusCode
        status
        type
        errors {
          errorField
          error
        }
        errorType
      }
    }
  }
`;
export const DELETE_MANAGE_RULES_SETS = gql`
  mutation DeleteSetRule($deleteSetRuleId: Int!) {
    deleteSetRule(id: $deleteSetRuleId) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const CREATE_RULES_SET = gql`
  mutation CreateSetRule(
    $ruleName: String!
    $description: String!
    $priority: priority!
    $onAction: on_action!
    $createdBy: Int!
  ) {
    createSetRule(
      rule_name: $ruleName
      description: $description
      priority: $priority
      on_action: $onAction
      created_by: $createdBy
    ) {
      meta {
        message
        messageCode
        statusCode
        status
      }
    }
  }
`;
export const GROUP_DELETE_RULES_SETS = gql`mutation GroupDeleteSetRules($groupDeleteSetRulesId: [Int]) {
  groupDeleteSetRules(id: $groupDeleteSetRulesId) {
    meta {
      message
      messageCode
      statusCode
      status
      type
      errors {
        errorField
        error
      }
      errorType
    }
  }
}`;
