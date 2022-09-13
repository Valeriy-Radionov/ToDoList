import {SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from "../../app/app-reducer";
import {AppThunk} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/authAPI";
import {handleServerAppError, handleServerNetworkError} from "../../components/utils/errors-utils";

const initialState = {
    isLoggedIn: false
}
const SET_IS_LOGGED_IN = "login/SET-IS-LOGGED-IN"

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
export const setIsLoggedInAC = (value: boolean) =>
    ({type: SET_IS_LOGGED_IN, value} as const)

// thunks
export const loginTC = (data: LoginParamsType): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }

}

// types
export type AuthActionsType = setIsLoggedInACType | SetAppStatusACType | SetAppErrorACType
