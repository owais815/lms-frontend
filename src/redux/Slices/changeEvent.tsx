import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    makeupcreated:false,
    classScheduled:false,
    supportSubmitted:false,
    dpChanged:false
  };
  const changeEventSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setMakeupTrigger: (state) => {
        state.makeupcreated = !state.makeupcreated;
      },
      setScheduledTrigger: (state) => {
        state.classScheduled = !state.classScheduled;
      },
      setSupportTrigger: (state) => {
        state.supportSubmitted = !state.supportSubmitted;
      },
      setDpTrigger: (state) => {
        state.dpChanged = !state.dpChanged;
      }
    }
  });

export default changeEventSlice.reducer;
export const changeEventActions = changeEventSlice.actions;