import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ILoginGet } from '../interfaces/interfaceApiLogin'
import type { RootState } from './index'

// Define a type for the slice state
interface AuthState {
	value?: ILoginGet
}

// Define the initial state using that type
const initialState: AuthState = {
	value: undefined,
}

export const authSlice = createSlice({
	name: 'auth',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<ILoginGet | undefined>) => {
			state.value = action.payload
		},
	},
})

export const { setValue } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const AuthState = (state: RootState) => state.main.auth.value

export default authSlice.reducer
