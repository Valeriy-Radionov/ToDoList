import {AddTodolistACType, changeTodolistStatusAC, RemoveTodolistACType, SetTodolistsACType} from './todolists-reducer'
import {
    RESULT_CODES,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {AppRootStateType, AppThunk} from '../../app/store'
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../components/utils/errors-utils";
import axios, {AxiosError} from "axios";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsTaskType): TasksStateType => {
    switch (action.type) {
        case "TASK/REMOVE-TASK": {
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        }
        case "TASK/ADD-TASK": {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case "TASK/UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case "TODO/ADD-TODOLIST": {
            return {...state, [action.todolist.id]: []}
        }
        case "TODO/REMOVE-TODOLIST": {
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        }
        case "TODO/SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "TASK/SET-TASKS": {
            return {...state, [action.todolistId]: action.tasks}
        }
        default:
            return state
    }
}

const REMOVE_TASK = "TASK/REMOVE-TASK"
const ADD_TASK = "TASK/ADD-TASK"
const UPDATE_TASK = "TASK/UPDATE-TASK"
const SET_TASKS = "TASK/SET-TASKS"
// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: REMOVE_TASK, taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: ADD_TASK, task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: UPDATE_TASK, model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: SET_TASKS, tasks, todolistId} as const)

// thunks
export const fetchTasksTC = (todolistId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        let res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        const action = setTasksAC(tasks, todolistId)
        dispatch(action)
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }
}
export const removeTaskTC = (taskId: string, todolistId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await todolistsAPI.deleteTask(todolistId, taskId)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const addTaskTC = (title: string, todolistId: string): AppThunk => async (dispatch) => {

    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistStatusAC(todolistId, "loading"))
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            const task = res.data.data.item
            const action = addTaskAC(task)
            dispatch(action)
            dispatch(setAppStatusAC("succeeded"))
            dispatch(changeTodolistStatusAC(todolistId, "idle"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk => async (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"))
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        //throw new Error("task not found in the state");
        console.warn("task not found in the state")
        return
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel
    }
    try {
        const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            const action = updateTaskAC(taskId, domainModel, todolistId)
            dispatch(action)
            dispatch(setAppStatusAC("succeeded"))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
    }
}

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type ActionsTaskType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsACType
    | ReturnType<typeof setTasksAC>
