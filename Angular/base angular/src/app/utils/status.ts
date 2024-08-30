import * as _ from 'lodash';

export const statusClass = {
  Pending: 'badge-secondary',
  Active: 'badge-success',
  Inactive: 'badge-danger',
  Approved: 'badge-success',
  Disapproved: 'badge-danger',
  Blocked: 'badge-danger',
  Accepted: 'badge-success',
  Rejected: 'badge-danger',
  Announced: 'badge-success',
  'In-Progress': 'badge-secondary',
  Sent: 'badge-success',
  Failed: 'badge-danger',
  Yes: 'badge-success',
  No: 'badge-danger',
  Close: 'badge-danger',
  Working: 'badge-warning',
};

export const getStatusClass = (status) => _.get(statusClass, status, 'badge-inactive');
