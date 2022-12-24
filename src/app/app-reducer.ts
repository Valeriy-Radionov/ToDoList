import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authAPI } from "../api/authAPI"
import { handleServerAppError, handleServerNetworkError } from "../components/utils/errors-utils"
import { setIsLoggedInAC } from "../features/Login/auth-reducer"

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialAppStateType = {
  status: RequestStatusType
  error: null | string
  isInitialized: boolean
}
const initialState: InitialAppStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
}

export const initializeAppTC = createAsyncThunk("app/initializeApp", async (param, { dispatch }) => {
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }))
      dispatch(setAppInitializedAC({ value: true }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
})

const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error
    },
    setAppInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value
    },
  },
})

export const appReducer = slice.reducer
export const setAppStatusAC = slice.actions.setAppStatusAC
export const setAppErrorAC = slice.actions.setAppErrorAC
export const setAppInitializedAC = slice.actions.setAppInitializedAC
