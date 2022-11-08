import { RESULT_CODES, todolistsAPI, TodolistType } from "../../api/todolists-api";
import { RequestStatusType, setAppStatusAC } from "../../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../components/utils/errors-utils";
import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string; title: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    },
    changeTodolistStatusAC(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
});
export const todolistsReducer = slice.reducer;
export const setTodolistsAC = slice.actions.setTodolistsAC;
export const changeTodolistStatusAC = slice.actions.changeTodolistStatusAC;
export const changeTodolistTitleAC = slice.actions.changeTodolistTitleAC;
export const changeTodolistFilterAC = slice.actions.changeTodolistFilterAC;
export const removeTodolistAC = slice.actions.removeTodolistAC;
export const addTodolistAC = slice.actions.addTodolistAC;

export const fetchTodolistsTC = () => {
  return async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistsAPI.getTodolists();
      dispatch(setTodolistsAC({ todolists: res.data }));
    } catch (e) {
      handleServerNetworkError(e, dispatch);
    } finally {
      dispatch(setAppStatusAC({ status: "succeeded" }));
    }
  };
};

export const removeTodolistTC = (todolistId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(changeTodolistStatusAC({ id: todolistId, status: "loading" }));
    try {
      const res = await todolistsAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === RESULT_CODES.succeeded) {
        dispatch(removeTodolistAC({ id: todolistId }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTodolistStatusAC({ id: todolistId, status: "failed" }));
    }
  };
};

export const addTodolistTC = (title: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistsAPI.createTodolist(title);
      dispatch(addTodolistAC({ todolist: res.data.data.item }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (e) {
      handleServerNetworkError(e, dispatch);
    }
  };
};

export const changeTodolistTitleTC = (id: string, title: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await todolistsAPI.updateTodolist(id, title);
      dispatch(changeTodolistTitleAC({ id: id, title: title }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(changeTodolistStatusAC({ id: id, status: "loading" }));
    }
  };
};

// types
export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodolistsAC>;
