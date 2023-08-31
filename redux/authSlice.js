import { createSlice } from "@reduxjs/toolkit"





const authSliceInitState = {
    user: { email: "", password: "", userId: " ", displayName: "", },
}

export const authSlice = createSlice({
    name: "auth",
    initialState: authSliceInitState,
    reducers: {
        newUser(state, { payload }) {
            state.user.email = payload.email;
            state.user.password = payload.password;
            state.user.displayName = payload.displayName;
        },
        logedIn(state, { payload }) {
            state.user = {...state.user, userId: payload.userId};
        },
        logedOut(state) {
            state.user = { email: "", password: "", userId: "" };
        }
    }
})


export const { newUser, logedIn, logedOut } = authSlice.actions;
export const authRootReducer = authSlice.reducer;