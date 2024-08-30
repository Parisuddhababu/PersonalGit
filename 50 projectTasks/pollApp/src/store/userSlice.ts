import { createSlice } from "@reduxjs/toolkit";

interface Data {
  name: string[];
}
const initialState: Data = {
  name: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { setName } = userSlice.actions;
export default userSlice.reducer;
