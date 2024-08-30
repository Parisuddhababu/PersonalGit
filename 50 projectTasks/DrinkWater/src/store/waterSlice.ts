import { createSlice } from "@reduxjs/toolkit";
/*type defining for initial data */
type Data = {
  totalMl: number;
  selectedGlass: string;
  data: {
    id: number;
    bottleInMl: string;
    showBottle: boolean;
    classList: string;
  }[];
  totalCupsFilled: string[];
  totalCups: number;
  showDropdownlist: boolean;
  dropDownListValue: number | string;
  duration: number;
};

/*creating state values required */
const initialState: Data = {
  totalMl: 2000,
  selectedGlass: "100",
  data: [],
  totalCupsFilled: [],
  totalCups: 0,
  showDropdownlist: false,
  dropDownListValue: 0,
  duration: 0,
};

const glassSlice = createSlice({
  name: "bottleData",
  initialState: initialState,
  /*reducers */
  reducers: {
    /*changing bottles based on user selection */
    onBottleChange(state, action) {
      state.totalCupsFilled = [];
      state.data = [];
      state.totalCups = 0;
      state.duration = 0;
      state.selectedGlass = action.payload;
      state.showDropdownlist = false;
      state.dropDownListValue = 0;
      for (let i = 0; i < state.totalMl / +state.selectedGlass; i++) {
        state.data.push({
          id: i,
          showBottle: false,
          bottleInMl: state.selectedGlass + " ml",
          classList: "",
        });
      }
      state.totalCups = state.totalMl / action.payload;
    },

    /*showing filled cups when user click on bottle */
    onBottleClick(state, action) {
      state.dropDownListValue = 0;
      state.totalCupsFilled = [];
      state.showDropdownlist = false;
      state.data = state.data.map((item) => {
        if (item.id <= action.payload) {
          return { ...item, showBottle: true };
        }
        if (item.id > action.payload) {
          return { ...item, showBottle: false };
        }
        return item;
      });
      state.data.forEach((item) => {
        if (item.showBottle) {
          state.totalCupsFilled.push(`${item.id}`);
        }
        return item;
      });
    },

    /*for auto mode when using on toggle */
    onAutoOn(state) {
      state.totalCupsFilled = [];
      state.data = state.data.map((item) => {
        return { ...item, showBottle: false };
      });
      state.dropDownListValue = "";
      state.showDropdownlist = !state.showDropdownlist;
    },
    /*after select auto mode dropdown for selecting glass */
    onDropDownSelected(state, action) {
      state.dropDownListValue = "";
      state.dropDownListValue = action.payload;
    },

    /*showing filled bottles in auto mode with specific  duration */
    onBottle(state, action) {
      state.totalCupsFilled = [];
      state.data = state.data.map((item) => {
        if (item.id < action.payload) {
          return { ...item, showBottle: true };
        }

        if (item.id >= action.payload) {
          return { ...item, showBottle: false };
        }
        return item;
      });
      state.data.forEach((item) => {
        if (item.showBottle) {
          state.totalCupsFilled.push(`${item.id}`);
        }
        return item;
      });
    },
    /*for specific duration */
    onDuration(state, action) {
      state.duration = 0;
      state.duration = action.payload;
    },
  },
});

/*actions for reducer */
export const {
  onBottleClick,
  onBottleChange,
  onAutoOn,
  onDropDownSelected,
  onBottle,
  onDuration,
} = glassSlice.actions;
export default glassSlice.reducer;
