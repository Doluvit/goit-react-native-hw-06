import { createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

const postsInitialState = {
  posts: [],
};
export const userPostsSlice = createSlice({
  name: "posts",
  initialState: postsInitialState,
  reducers: {
    addPost: {
      reducer(state, { payload }) {
        state.posts.push(payload);
      },
      prepare({ photoTitle, locationTitle, photoUri, comment = 0, location })
      {
        return {
          payload: {
            id: uuid.v4(),
            name: photoTitle,
            imageUrl: photoUri,
            location: locationTitle,
            comment,
            coords: location,
          },
        };
      },
    },
  },
});

export const { addPost } = userPostsSlice.actions;
export const postsRootReducer = userPostsSlice.reducer;
