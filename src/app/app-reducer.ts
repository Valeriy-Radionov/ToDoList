import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authAPI } from "../api/authAPI"
import { appActions } from "../CommonActions/App"
import { handleServerAppError, handleServerNetworkError } from "../utils/errors-utils"
import { authActions } from "../features/Auth"

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

export const initializeApp = createAsyncThunk("app/initializeApp", async (param, { dispatch, rejectWithValue }) => {
  try {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ value: true }))
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(e)
  }
})
export const asyncActions = { initializeApp }
export const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isInitialized = true
      })
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error
      })
  },
})

// const setAppStatusAC = slice.actions.setAppStatusAC
// const setAppErrorAC = slice.actions.setAppErrorAC
// const setAppInitializedAC = slice.actions.setAppInitializedAC
