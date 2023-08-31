export const selectAuthState = (state) => state.auth.user.userId;

export const selectUserName = (state) => state.auth.user.displayName;

export const selectPosts = (state) => state.posts.posts;


