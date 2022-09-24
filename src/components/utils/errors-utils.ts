import {Dispatch} from "redux";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {ResponseType} from "../../api/todolists-api";
import axios, {AxiosError} from "axios";

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
        dispatch(setAppErrorAC({error: error}))
    }
    dispatch(setAppStatusAC({status: "failed"}))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: "Some error occurred"}))
    }
    dispatch(setAppStatusAC({status: "failed"}))
}