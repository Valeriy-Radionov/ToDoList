import { tasksReducer } from "../features/TodolistsList/tasks-reducer"
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer"
import { ActionCreatorsMapObject, bindActionCreators, combineReducers } from "redux"
import thunkMiddleware from "redux-thunk"
import { appReducer } from "./app-reducer"
import { authReducer } from "../features/Auth/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { useMemo } from "react"
import { useAppDispatch } from "../utils/huks/app-hooks"

const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer,
  auth: authReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

export type AppDispatch = typeof store.dispatch
export type AppRootStateType = ReturnType<typeof store.getState>

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  const dispatch = useAppDispatch()
  const boundActions = useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [])
  return boundActions
}
// @ts-ignore
window.store = store
