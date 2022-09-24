import {authAPI} from "../api/authAPI";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
const initialState = {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}
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
        }
    }
})

export const appReducer = slice.reducer
export const setAppInitializedAC = slice.actions.setAppInitializedAC
export const setAppStatusAC = slice.actions.setAppStatusAC
export const setAppErrorAC = slice.actions.setAppErrorAC
//thunks

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setAppInitializedAC({value: true}))
    }
}
