import * as todolistsSelectors from "./selectors"
import { asyncActions as tasksAsyncActions, slice as sliceTask } from "./tasks-reducer"
import { asyncActions as todolistAsyncActions, slice } from "./todolists-reducer"
import { TodolistsList } from "./TodolistsList"
const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions,
}
const tasksActions = {
  ...tasksAsyncActions,
  ...slice.actions,
}
const todolistsReducer = slice.reducer
const tasksReducer = sliceTask.reducer
export { todolistsSelectors, todolistActions, tasksActions, TodolistsList, todolistsReducer, tasksReducer }
