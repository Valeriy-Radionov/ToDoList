import {AppThunk} from "./store";
import {authAPI} from "../api/authAPI";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
const initialState = {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export type InitialStateLoadingType = typeof initialState
const SET_STATUS = "APP/SET-STATUS"
const SET_ERROR = "APP/SET-ERROR"
const SET_INITIALIZED = "APP/SET-INITIALIZED"
export const appReducer = (state: InitialStateLoadingType = initialState, action: CommonAppActionType): InitialStateLoadingType => {
    switch (action.type) {
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "APP/SET-INITIALIZED": {
            return {...state, isInitialized: action.value}
        }
        default:
            return state
    }
}
export type CommonAppActionType = SetAppStatusACType | SetAppErrorACType | SetAppInitializedACType
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export const setAppStatusAC = (status: RequestStatusType) => (
    {
        type: SET_STATUS,
        status
    } as const
)
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export const setAppErrorAC = (error: null | string) => (
    {
        type: SET_ERROR,
        error
    } as const
)

export type SetAppInitializedACType = ReturnType<typeof setAppInitializedAC>
export const setAppInitializedAC = (value: boolean) => (
    {
        type: SET_INITIALIZED,
        value
    } as const
)

//thunks

export const initializeAppTC = (): AppThunk => async (dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppInitializedAC(true))
    }
}
