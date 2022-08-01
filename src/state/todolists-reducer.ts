import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";

const initialState: TodolistType[] = []

export const todolistsReducer = (state = initialState, action: tsarType): TodolistType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.todolistId1)
        }
        case "ADD-TODOLIST": {
            return [...state, {id: action.todolistId, title: action.newTodolistTitle, filter: "all"}]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(el => el.id === action.todolistId2 ? {
                ...el,
                title: action.newTodolistTitle
            } : el)
        }
        case "CHANGE-TODOLIST-FILTER":{
            return state.map(el=>el.id===action.todolistId2 ? {...el,filter:action.newFilter}: el)
        }
        default:
            return state
    }
}

type tsarType = removeTodolistACType
    | addTodolistACType
    | changeTodolistTitleACType
    | changeFilterACType

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (todolistId1: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        todolistId1
    } as const
}


export type addTodolistACType = ReturnType<typeof addTodolistAC>
export const addTodolistAC = (newTodolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        newTodolistTitle,
        todolistId: v1()
    } as const
}

type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
export const changeTodolistTitleAC = (todolistId2: string, newTodolistTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        todolistId2,
        newTodolistTitle
    } as const
}

type changeFilterACType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (todolistId2: string, newFilter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        todolistId2,
        newFilter
    } as const
}