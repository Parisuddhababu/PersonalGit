import { shallow } from 'enzyme';
import PersonalInfo from '../components/personalInfo';
import React from 'react';

const personalInfoForm = shallow(<PersonalInfo />);
const formValue = {
  first_name: 'Brainvire Info Tech',
  last_name: 'Brainvire',
  job_title: 'Front end Developer',
  phone_number: '+112345678900',
  email: 'brainvire@brainvire.com',
};

const validator = {
  firstName: /^(\D*)$/,
  lastName: /^(\D*)$/,
  jobTitle: /\S/,
  phoneNumber: /^\+(?=.{10})\d{10,15}_{0,5}$/,
  email: null,
};

const checkRegexValue = (
  fieldValue: string,
  fieldRegex: any,
  callback: any
) => {
  callback(expect(fieldValue).toMatch(new RegExp(fieldRegex)));
};

const checkFieldPresent = (field: any, callback: any) => {
  callback(expect(field).toBe(1));
};

describe('Render Personal Info Component Test Cases', () => {
  it('Render Component', () => {
    const personalInfoForm = shallow(<PersonalInfo />);
    expect(personalInfoForm).toMatchSnapshot();
  });

  it('First Name Field Validation', () => {
    const mockCallback = jest.fn();
    const firstName = personalInfoForm.find('#first_name').length;
    checkFieldPresent(firstName, mockCallback);
    checkRegexValue(formValue.first_name, validator.firstName, mockCallback);
  });

  it('Last Name Field Validation', () => {
    const mockCallback = jest.fn();
    const lastName = personalInfoForm.find('#last_name').length;
    checkFieldPresent(lastName, mockCallback);
    checkRegexValue(formValue.last_name, validator.lastName, mockCallback);
  });

  it('Job Title Field Validation', () => {
    const mockCallback = jest.fn();
    const jobTitle = personalInfoForm.find('#job_title').length;
    checkFieldPresent(jobTitle, mockCallback);
    checkRegexValue(formValue.job_title, validator.lastName, mockCallback);
  });

  it('Phone Number Field Validation', () => {
    const mockCallback = jest.fn();
    const phoneNumber = personalInfoForm.find('#phone_number').length;
    checkFieldPresent(phoneNumber, mockCallback);
    checkRegexValue(
      formValue.phone_number,
      validator.phoneNumber,
      mockCallback
    );
  });

  it('Email Field Validation', () => {
    const mockCallback = jest.fn();
    const email = personalInfoForm.find('#email').length;
    checkFieldPresent(email, mockCallback);
  });
});
