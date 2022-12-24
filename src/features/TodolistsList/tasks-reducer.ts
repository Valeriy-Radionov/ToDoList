import { AsyncThunk, createAsyncThunk, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import axios, { AxiosError } from "axios"
import { RESULT_CODES, TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "../../api/todolists-api"
import { setAppStatusAC } from "../../app/app-reducer"
import { AppRootStateType } from "../../app/store"
import { handleServerAppError, handleServerNetworkError } from "../../components/utils/errors-utils"
import { addTodolistTC, changeTodolistStatusAC, fetchTodolistsTC, removeTodolistTC } from "./todolists-reducer"

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkApi) => {
  thunkApi.dispatch(setAppStatusAC({ status: "loading" }))
  try {
    let res = await todolistsAPI.getTasks(todolistId)
    const tasks = res.data.items
    thunkApi.dispatch(setAppStatusAC({ status: "succeeded" }))
    return { tasks, todolistId }
  } catch (e) {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
      const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
      handleServerNetworkError(error, thunkApi.dispatch)
    }
  }
})

export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (param: { taskId: string; todolistId: string }, { dispatch }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      dispatch(setAppStatusAC({ status: "succeeded" }))
      return { taskId: param.taskId, todolistId: param.todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
})

export const addTaskTC = createAsyncThunk("tasks/addTask", async (param: { title: string; todolistId: string }, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  dispatch(changeTodolistStatusAC({ id: param.todolistId, status: "loading" }))
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      const task = res.data.data.item
      dispatch(setAppStatusAC({ status: "succeeded" }))
      dispatch(changeTodolistStatusAC({ id: param.todolistId, status: "idle" }))
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

export const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }, { dispatch, rejectWithValue, getState }) => {
    const { domainModel, todolistId, taskId } = param
    const state = getState() as AppRootStateType
    dispatch(setAppStatusAC({ status: "loading" }))
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
        dispatch(setAppStatusAC({ status: "succeeded" }))
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

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload?.todolistId!] = action.payload?.tasks!
    })
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const task = state[action.payload?.todolistId!]
      const index = task.findIndex((t) => t.id === action.payload?.taskId!)
      if (index > -1) {
        task.splice(index, 1)
      }
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
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
// for redux
// export const fetchTasks = (todolistId: string) => async (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }))
//   try {
//     let res = await todolistsAPI.getTasks(todolistId)
//     const tasks = res.data.items
//     const action = setTasksAC({ tasks, todolistId })
//     dispatch(action)
//     dispatch(setAppStatusAC({ status: "succeeded" }))
//   } catch (e) {
//     const err = e as Error | AxiosError
//     if (axios.isAxiosError(err)) {
//       const error = err.response?.data ? (err.response?.data as { error: string }).error : err.message
//       handleServerNetworkError(error, dispatch)
//     }
//   }
// }
// export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }))
//   try {
//     const res = await todolistsAPI.deleteTask(todolistId, taskId)
//     if (res.data.resultCode === RESULT_CODES.succeeded) {
//       dispatch(removeTaskAC({ taskId, todolistId }))
//       dispatch(setAppStatusAC({ status: "succeeded" }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch)
//   }
// }
// export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: "loading" }))
//   dispatch(changeTodolistStatusAC({ id: todolistId, status: "loading" }))
//   try {
//     const res = await todolistsAPI.createTask(todolistId, title)
//     if (res.data.resultCode === RESULT_CODES.succeeded) {
//       const task = res.data.data.item
//       const action = addTaskAC({ task })
//       dispatch(action)
//       dispatch(setAppStatusAC({ status: "succeeded" }))
//       dispatch(changeTodolistStatusAC({ id: todolistId, status: "idle" }))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch)
//   }
// }
