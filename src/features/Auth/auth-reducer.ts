import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AxiosError } from "axios"
import { authAPI, LoginParamsType } from "../../api/authAPI"
import { FieldErrorsType } from "../../api/todolists-api"
import { appActions } from "../../CommonActions/App"
import { handleServerAppError, handleServerNetworkError } from "../../utils/errors-utils"

const initialState = {
  isLoggedIn: false,
}
const { setAppStatus } = appActions
const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: string[]; fieldsErrors?: FieldErrorsType[] } }>("auth/login", async (param, thunkApi) => {
  thunkApi.dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.login(param)
    if (res.data.resultCode === 0) {
      thunkApi.dispatch(setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, thunkApi.dispatch)
      return thunkApi.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (e) {
    const error: AxiosError = e as AxiosError
    handleServerNetworkError(e, thunkApi.dispatch)
    return thunkApi.rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

const logoutTC = createAsyncThunk("auth/logout", async (param, thunkApi) => {
  thunkApi.dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      thunkApi.dispatch(setAppStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, thunkApi.dispatch)
      return thunkApi.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (e) {
    handleServerNetworkError(e, thunkApi.dispatch)
    return thunkApi.rejectWithValue(e)
  }
})

export const asyncActions = { loginTC, logoutTC }

export const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true
    })
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false
    })
  },
})

export const authReducer = slice.reducer
