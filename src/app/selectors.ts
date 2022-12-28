import { AppRootStateType } from "./store"

export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
export const selectAppStatus = (state: AppRootStateType) => state.app.status
export const selectAppError = (state: AppRootStateType) => state.app.error
