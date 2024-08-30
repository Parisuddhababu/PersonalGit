import MyAccountSection1 from "@templates/MyAccount/components/Account/my-account-1";

export interface IAccountPageForm {
  name: string;
  company_website: string;
  contact_person: string;
  emails: string;
  mobile: string;
  nature_of_organization: string;
  gst_number: string;
  registration_number: string;
  designation: string;
  selected_designation_name: string;
  business_relationship_period: number;
  nature_of_org_others: string;
  fax: string;
  bank_name: string;
  account_number: string;
  ifsc: string;
  visiting_card: string;
  country: string;
}

export default MyAccountSection1;
