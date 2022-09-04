import {Dispatch} from "redux";
import {AppActionsType} from "../../app/store";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {ResponseType} from "../../api/todolists-api";
import axios, {AxiosError} from "axios";

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch<AppActionsType>) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
        dispatch(setAppErrorAC(error))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<AppActionsType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC("Some error occurred"))
    }
    dispatch(setAppStatusAC("failed"))
}