import {ActionsTaskType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {ActionsTodosType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer
})

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(thunkMiddleware)
})

export const dispatchAppThunk = store.dispatch as ThunkDispatch<AppRootStateType, unknown, AppActionsType>

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>
export type AppActionsType = ActionsTaskType | ActionsTodosType

// @ts-ignore
window.store = store;


