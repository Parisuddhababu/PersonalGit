import { createSlice } from "@reduxjs/toolkit";

interface Data {
  questionData: {
    question: string;
    answers: { questionId: number; option: string }[];
    questionId: number;
    votes: {
      userName: string;
      option: string;
      questionId: number;
    }[];
  }[];
}
/*get local storage data*/

const initialState: Data = {
  questionData: [],
};

const pollSlice = createSlice({
  name: "poll",
  initialState: initialState,
  reducers: {
    /*to add qquestion data */
    addQuestion(state, action) {
      state.questionData.push({
        question: action.payload.question,
        answers: action.payload.answers,
        questionId: action.payload.questionId,
        votes: [],
      });
    },
    /*to add vote details */
    vote(state, action) {
      const { userName, option, questionId } = action.payload;
      if (state.questionData) {
        state.questionData = state.questionData.map((item) => {
          if (item.questionId === action.payload.questionId) {
            return {
              ...item,
              votes: [...item.votes, { userName, questionId, option }],
            };
          } else {
            return item;
          }
        });
      }
    },
    onData(state, action) {
      state.questionData = action.payload;
    },
  },
});

export const { addQuestion, vote, onData } = pollSlice.actions;
export default pollSlice.reducer;
