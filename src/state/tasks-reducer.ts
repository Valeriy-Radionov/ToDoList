import {FilterValuesType, TasksStateType, TodolistType} from "../App";
import {v1} from "uuid";
import {TaskType} from "../Todolist";
import {addTodolistACType, removeTodolistAC, removeTodolistACType} from "./todolists-reducer";
type removeTaskActionType = ReturnType<typeof removeTaskAC>
type addTaskActionType = ReturnType<typeof addTaskAC>
type changeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
type changeTaskTitleType = ReturnType<typeof changeTaskTitleAC>
type ActionType = removeTaskActionType | addTaskActionType | changeTaskStatusType | changeTaskTitleType | addTodolistACType | removeTodolistACType

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {...state,[action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)}
        }
        case "ADD-TASK": {
            return {...state, [action.todolistId]:[{ id: v1(), title: action.title, isDone: false },...state[action.todolistId]]}
        }
            case "CHANGE-TASK-STATUS": {
                return {...state,[action.todolistId] : state[action.todolistId].map(task => task.id === action.taskId ? {...task, isDone: action.isDone} : task)}
            }
        case "CHANGE-TASK-TITLE": {
            return {...state, [action.todolistId] : state[action.todolistId].map(task => task.id === action.taskId ? {...task, title: action.title} : task)}
        }
        case "ADD-TODOLIST" : {
            return {...state, [action.payload.todolistId] : []}
        }
        case "REMOVE-TODOLIST" : {
            let copyState = {...state}
            delete copyState[action.payload.todolistId1]
            return copyState
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: "REMOVE-TASK",
        taskId: taskId,
        todolistId: todolistId
    } as const
}

export const addTaskAC = (title: string,todolistId: string) => {
    return {
        type: "ADD-TASK",
        title, todolistId

    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean,todolistId: string) => {
    return {
        type: "CHANGE-TASK-STATUS",
        taskId, isDone, todolistId
    } as const
}
export const changeTaskTitleAC = (taskId: string,title: string, todolistId: string)=> {
    return {
        type: "CHANGE-TASK-TITLE",
        taskId, title, todolistId
    } as const
}
