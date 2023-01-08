import axios, { AxiosError } from "axios"
import { Dispatch } from "redux"
import { ResponseType } from "../api/todolists-api"
import { appActions } from "../CommonActions/App"
const { setAppError, setAppStatus } = appActions

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
  const err = e as Error | AxiosError
  if (axios.isAxiosError(err)) {
    const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
    dispatch(setAppError({ error: error }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: "Some error occurred" }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}
