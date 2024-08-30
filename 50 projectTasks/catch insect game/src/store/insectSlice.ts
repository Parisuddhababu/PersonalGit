import { createSlice } from "@reduxjs/toolkit";

type Data = {
  insectSelect: {
    insectSelected: string;
  }[];
  imagesData: { id: string; url: string; name: string }[];
  userName: { userName: string; duration: number }[];
  result: { score: number }[];
};
const getUserName = JSON.parse(localStorage.getItem("userName") as string);
const getInsectSelect = JSON.parse(
  localStorage.getItem("insectSelect") as string
);
const getResult = JSON.parse(localStorage.getItem("result") as string);
JSON.parse(localStorage.getItem("imagesData") as string);
const initialState: Data = {
  imagesData: [
    {
      id: "1",
      url: "http://pngimg.com/uploads/fly/fly_PNG3946.png",
      name: "fly",
    },
    {
      id: "2",
      url: "http://pngimg.com/uploads/mosquito/mosquito_PNG18175.png",
      name: "masqito",
    },
    {
      id: "3",
      url: "http://pngimg.com/uploads/spider/spider_PNG12.png",
      name: "spider",
    },
    {
      id: "4",
      url: "http://pngimg.com/uploads/roach/roach_PNG12163.png",
      name: "roach",
    },
  ],
  insectSelect: getInsectSelect ? getInsectSelect : [],
  userName: getUserName ? getUserName : [],
  result: getResult
    ? getResult.sort((a: { score: number }, b: { score: number }) =>
        a.score < b.score ? 1 : -1
      )
    : [],
};

const insectSlice = createSlice({
  name: "insectData",
  initialState: initialState,

  reducers: {
    /*for storing username and duration */
    onUser(state, action) {
      state.userName.push({
        userName: action.payload.userName,
        duration: action.payload.duration,
      });
    },
    /*for storing selected insect id */
    onSelected(state, action) {
      state.insectSelect.push({
        insectSelected: action.payload.insectSelect,
      });
    },
    /*for storing score and time */
    onResult(state, action) {
      state.result.push({
        score: action.payload.score,
      });
    },
  },
});

export const { onUser, onSelected, onResult } = insectSlice.actions;
export default insectSlice.reducer;
