import { createSlice } from "@reduxjs/toolkit";
import { perDetailsValues } from "../components/personalDetails";
import { contactDetailsValues } from "../components/contactDetails";

export type Data = {
  personalDetails: perDetailsValues[];
  contactDetails: contactDetailsValues[];
  uploads: {
    image: { name: string; url: string };
    tc: { name: string; url: string };
    income: { name: string; url: string };
  }[];
  isPersonalDetail: boolean;
  isContactDetail: boolean;
  isUploads: boolean;
  isPreview: boolean;
  showIncome: boolean;
};
/*getting personal details data from local storage*/
const personalDetailsStore = JSON.parse(
  localStorage.getItem("perDetLocStorage") as string
);
/*getting contact details data from local storage*/
const contactDetails = JSON.parse(
  localStorage.getItem("conDetLocStorage") as string
);
/*getting uploads data from local storage*/
const uploads = JSON.parse(localStorage.getItem("uploadLocStorage") as string);
const showIncomeValue = JSON.parse(localStorage.getItem("showIncome")!);

/*initial state data*/
const initialState: Data = {
  personalDetails: personalDetailsStore ? [personalDetailsStore] : [],
  contactDetails: contactDetails ? [contactDetails] : [],
  uploads: uploads ? [uploads] : [],
  isPersonalDetail: false,
  isContactDetail: false,
  isUploads: false,
  isPreview: false,
  showIncome: showIncomeValue ? showIncomeValue : false,
};

const regFormSlice = createSlice({
  name: "USER",
  initialState: initialState,
  reducers: {
    /*for personal details */
    onPerDetails(state, action) {
      state.personalDetails.push(action.payload);
    },
    /*for contact details */
    onContactDetails(state, action) {
      state.contactDetails.push(action.payload);
    },
    /*for upload details*/
    onUploads(state, action) {
      state.uploads.push(action.payload);
    },
    /*for side bar*/
    setSideBar(state, action) {
      if (action.payload === "personal") {
        state.isPersonalDetail = true;
      } else {
        state.isPersonalDetail = false;
      }
      if (action.payload === "contact") {
        state.isContactDetail = true;
      } else {
        state.isContactDetail = false;
      }
      if (action.payload === "upload") {
        state.isUploads = true;
      } else {
        state.isUploads = false;
      }
      if (action.payload === "preview") {
        state.isPreview = true;
      } else {
        state.isPreview = false;
      }
    },
    setShowIncome(state, action) {
      state.showIncome = action.payload;
    },
  },
});
export const {
  onPerDetails,
  onContactDetails,
  onUploads,
  setSideBar,
  setShowIncome,
} = regFormSlice.actions;
export default regFormSlice.reducer;
