import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: "no-one",
    isAuthenticated: false,
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state) =>{
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
        }
    }
});

export const {
    login,
    logout
} = userSlice.actions;


export default userSlice.reducer;