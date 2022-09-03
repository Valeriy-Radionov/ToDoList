export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
    status: "loading" as RequestStatusType
}

export type InitialStateLoadingType = typeof initialState

export const appReducer = (state: InitialStateLoadingType = initialState, action: CommonAppActionType): InitialStateLoadingType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        default:
            return state
    }
}
export type CommonAppActionType = SetAppStatusACType
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export const setAppStatusAC = (status: RequestStatusType) => (
    {
        type: "APP/SET-STATUS",
        status
    } as const
)

