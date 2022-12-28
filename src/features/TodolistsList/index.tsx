import * as todolistsSelectors from "./selectors"
import { asyncActions as tasksAsyncActions } from "./tasks-reducer"
import { asyncActions as todolistAsyncActions } from "./todolists-reducer"
import { slice } from "./todolists-reducer"
import { TodolistsList } from "./TodolistsList"
const todolistActions = {
  ...todolistAsyncActions,
  ...slice.actions,
}
const tasksActions = {
  ...tasksAsyncActions,
  ...slice.actions,
}
export { todolistsSelectors, todolistActions, tasksActions, TodolistsList }
