import {ActionsTaskType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {ActionsTodosType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {appReducer, CommonAppActionType} from "./app-reducer";
import {AuthActionsType, authReducer} from "../features/Login/auth-reducer";

const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const dispatchAppThunk = store.dispatch as ThunkDispatch<AppRootStateType, unknown, AppActionsType>

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>
export type AppActionsType = ActionsTaskType | ActionsTodosType | CommonAppActionType | AuthActionsType

// @ts-ignore
window.store = store;


