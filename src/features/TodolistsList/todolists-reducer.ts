import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RESULT_CODES, todolistsAPI, TodolistType } from "../../api/todolists-api"
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../components/utils/errors-utils"
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (params, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await todolistsAPI.getTodolists()
    return { todolists: res.data }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue("Can not fetch todolists")
  } finally {
    dispatch(setAppStatusAC({ status: "succeeded" }))
  }
})

export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (todolistId: string, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  dispatch(changeTodolistStatusAC({ id: todolistId, status: "loading" }))
  try {
    const res = await todolistsAPI.deleteTodolist(todolistId)
    if (res.data.resultCode === RESULT_CODES.succeeded) {
      dispatch(setAppStatusAC({ status: "succeeded" }))
      return { id: todolistId }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue("Error: failed to delete todolist")
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    dispatch(changeTodolistStatusAC({ id: todolistId, status: "failed" }))
    return rejectWithValue(e)
  }
})

export const addTodolistTC = createAsyncThunk("todolists/addTodolists", async (title: string, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  try {
    const res = await todolistsAPI.createTodolist(title)
    dispatch(setAppStatusAC({ status: "succeeded" }))
    return { todolist: res.data.data.item }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(e)
  }
})

export const changeTodolistTitleTC = createAsyncThunk("", async (param: { id: string; title: string }, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatusAC({ status: "loading" }))
  const { id, title } = param
  try {
    await todolistsAPI.updateTodolist(id, title)
    dispatch(setAppStatusAC({ status: "succeeded" }))
    return { id: id, title: title }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    dispatch(changeTodolistStatusAC({ id: id, status: "loading" }))
    rejectWithValue(e)
  }
})

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistStatusAC(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }))
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      })
    })
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      if (action.payload) {
        const index = state.findIndex((tl) => tl.id === action.payload?.id)
        state[index].title = action.payload.title
      }
    })
  },
})
export const todolistsReducer = slice.reducer
export const changeTodolistStatusAC = slice.actions.changeTodolistStatusAC
export const changeTodolistFilterAC = slice.actions.changeTodolistFilterAC
