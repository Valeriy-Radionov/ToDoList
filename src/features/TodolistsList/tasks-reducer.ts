import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { RESULT_CODES, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "../../api/todolists-api"
import { AppRootStateType } from "../../app/store"
import { appActions } from "../../CommonActions/App"
import { handleServerAppError, handleServerNetworkError } from "../../utils/errors-utils"
import { asyncActions as asyncTodolistsActions, changeTodolistStatus } from "./todolists-reducer"

const initialState: TasksStateType = {}
const { setAppStatus } = appActions
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkApi) => {
  thunkApi.dispatch(setAppStatus({ status: "loading" }))
  try {
    let res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkApi.dispatch(setAppStatus({ status: "succeeded" }))
    return { tasks, todolistId }
  } catch (e) {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
      const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
      handleServerNetworkError(error, thunkApi.dispatch)
    }
  }
})

export const removeTask = createAsyncThunk("tasks/removeTask", async (params: { taskId: string; todolistId: string }, { dispatch }) => {
  dispatch(setAppStatus({ status: "loading" }))
  try {
    const res = await todolistsAPI.deleteTask(params.todolistId, params.taskId)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { taskId: params.taskId, todolistId: params.todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
})

export const addTask = createAsyncThunk("tasks/addTask", async (params: { title: string; todolistId: string }, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: "loading" }))
  dispatch(changeTodolistStatus({ id: params.todolistId, status: "loading" }))
  try {
    const res = await todolistsAPI.createTask(params.todolistId, params.title)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      const task = res.data.data.item
      dispatch(setAppStatus({ status: "succeeded" }))
      dispatch(changeTodolistStatus({ id: params.todolistId, status: "idle" }))
      return task
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({})
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue({})
  }
})

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }, { dispatch, rejectWithValue, getState }) => {
    const { domainModel, todolistId, taskId } = param
    const state = getState() as AppRootStateType
    dispatch(setAppStatus({ status: "loading" }))
    const task = state.tasks[param.todolistId].find((t) => t.id === taskId)
    if (!task) {
      return rejectWithValue("task not found in the state")
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
        dispatch(setAppStatus({ status: "succeeded" }))
        return {
          taskId: taskId,
          model: domainModel,
          todolistId: todolistId,
        }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue({})
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue({})
    }
  }
)
export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
}
export const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncTodolistsActions.addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(asyncTodolistsActions.removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(asyncTodolistsActions.fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload?.todolistId!] = action.payload?.tasks!
    })
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const task = state[action.payload?.todolistId!]
      const index = task.findIndex((t) => t.id === action.payload?.taskId!)
      if (index > -1) {
        task.splice(index, 1)
      }
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId]
      const index = task.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        task[index] = { ...task[index], ...action.payload.model }
      }
    })
  },
})
export const tasksReducer = slice.reducer

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
