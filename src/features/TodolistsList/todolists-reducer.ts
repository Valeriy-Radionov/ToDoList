import {RESULT_CODES, todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../components/utils/errors-utils";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsTodosType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "TODO/REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "TODO/ADD-TODOLIST": {
            return [{...action.todolist, filter: "all", entityStatus: "idle"}, ...state]
        }
        case "TODO/CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case "TODO/CHANGE-TODOLIST-FILTER": {
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        }
        case "TODO/SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
        }
        case "TODO/CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        }
        default:
            return state
    }
}
const REMOVE_TODOLIST = "TODO/REMOVE-TODOLIST"
const ADD_TODOLIST = "TODO/ADD-TODOLIST"
const CHANGE_TODOLIST_TITLE = "TODO/CHANGE-TODOLIST-TITLE"
const CHANGE_TODOLIST_FILTER = "TODO/CHANGE-TODOLIST-FILTER"
const SET_TODOLISTS = "TODO/SET-TODOLISTS"
const CHANGE_TODOLIST_STATUS = "TODO/CHANGE-TODOLIST-ENTITY-STATUS"
// actions
export const removeTodolistAC = (id: string) => ({type: REMOVE_TODOLIST, id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: ADD_TODOLIST, todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: CHANGE_TODOLIST_TITLE,
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: CHANGE_TODOLIST_FILTER,
    id,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: SET_TODOLISTS, todolists} as const)
export const changeTodolistStatusAC = (id: string, status: RequestStatusType) => ({
    type: CHANGE_TODOLIST_STATUS,
    id,
    status

} as const)
// thunks
export const fetchTodolistsTC = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await todolistsAPI.getTodolists()
            dispatch(setTodolistsAC(res.data))
        } catch (e) {
            handleServerNetworkError(e, dispatch)
        } finally {
            dispatch(setAppStatusAC({status: "succeeded"}))
        }
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTodolistStatusAC(todolistId, "loading"))
        try {
            const res = await todolistsAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodolistStatusAC(todolistId, "failed"))
        }
    }
}
export const addTodolistTC = (title: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await todolistsAPI.createTodolist(title)
            dispatch(addTodolistAC(res.data.data.item))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } catch (e) {
            handleServerNetworkError(e, dispatch)
        }
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        try {
            const res = await todolistsAPI.updateTodolist(id, title)
            dispatch(changeTodolistTitleAC(id, title))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodolistStatusAC(id, "loading"))
        }
    }
}

// types
export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>
export type ChangeTodolistStatusACType = ReturnType<typeof changeTodolistStatusAC>


export type ActionsTodosType =
    | RemoveTodolistACType
    | AddTodolistACType
    | ChangeTodolistTitleACType
    | ChangeTodolistFilterACType
    | SetTodolistsACType | ChangeTodolistStatusACType

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
