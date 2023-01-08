import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import thunkMiddleware from "redux-thunk"
import { appReducer } from "."
import { authReducer } from "../features/Auth"
import { tasksReducer, todolistsReducer } from "../features/TodolistsList"

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

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
