import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: null,
	pnr: null,
	password: null,
	type: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, { payload }) {
			state.name = payload.name;
			state.pnr = payload.pnr;
			state.password = payload.password;
			state.type = payload.type;
		},
		removeUser(state) {
			state.name = null;
			state.pnr = null;
			state.password = null;
			state.type = null;
		},
	},
});

export const { setUser, removeUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
