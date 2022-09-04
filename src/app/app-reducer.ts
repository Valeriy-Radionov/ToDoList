export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
const initialState = {
    status: "loading" as RequestStatusType,
    error: null as null | string
}

export type InitialStateLoadingType = typeof initialState
const SET_STATUS = "APP/SET-STATUS"
const SET_ERROR = "APP/SET-ERROR"
export const appReducer = (state: InitialStateLoadingType = initialState, action: CommonAppActionType): InitialStateLoadingType => {
    switch (action.type) {
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        default:
            return state
    }
}
export type CommonAppActionType = SetAppStatusACType | SetAppErrorACType
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
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
