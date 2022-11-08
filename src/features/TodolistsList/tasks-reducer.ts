import { addTodolistAC, changeTodolistStatusAC, removeTodolistAC, setTodolistsAC } from "./todolists-reducer"
import { RESULT_CODES, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "../../api/todolists-api"
import { AppRootStateType } from "../../app/store"
import { setAppStatusAC } from "../../app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../components/utils/errors-utils"
import axios, { AxiosError } from "axios"
import { Dispatch } from "redux"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: TasksStateType = {}
const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string; todolistId: string }>) {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string
        model: UpdateDomainTaskModelType
        todolistId: string
      }>
    ) {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task[index] = { ...task[index], ...action.payload.model }
      }
    },
    setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
  },
})
export const tasksReducer = slice.reducer

// actions
export const setTasksAC = slice.actions.setTasksAC
export const updateTaskAC = slice.actions.updateTaskAC
export const addTaskAC = slice.actions.addTaskAC
export const removeTaskAC = slice.actions.removeTaskAC

// thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  try {
    let res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    const action = setTasksAC({ tasks, todolistId })
    dispatch(action)
    dispatch(setAppStatusAC({ status: "succeeded" }))
  } catch (e) {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
      const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
      handleServerNetworkError(error, dispatch)
    }
  }
}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await todolistsAPI.deleteTask(todolistId, taskId)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      dispatch(removeTaskAC({ taskId, todolistId }))
      dispatch(setAppStatusAC({ status: "succeeded" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
}

export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  dispatch(changeTodolistStatusAC({ id: todolistId, status: "loading" }))
  try {
    const res = await todolistsAPI.createTask(todolistId, title)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      const task = res.data.data.item
      const action = addTaskAC({ task })
      dispatch(action)
      dispatch(setAppStatusAC({ status: "succeeded" }))
      dispatch(changeTodolistStatusAC({ id: todolistId, status: "idle" }))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  const state = getState()
  const task = state.tasks[todolistId].find((t) => t.id === taskId)
  if (!task) {
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
    ...domainModel,
  }
  try {
    const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      const action = updateTaskAC({
        taskId: taskId,
        model: domainModel,
        todolistId: todolistId,
      })
      dispatch(action)
      dispatch(setAppStatusAC({ status: "succeeded" }))
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
