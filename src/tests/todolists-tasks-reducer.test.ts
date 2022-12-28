import { TodolistType } from "../api/todolists-api"
import { tasksReducer, TasksStateType } from "../features/TodolistsList/tasks-reducer"
import { TodolistDomainType, todolistsReducer } from "../features/TodolistsList/todolists-reducer"
import { todolistActions } from "../features/TodolistsList"
test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const statrTodolistsState: TodolistDomainType[] = []

  const todolist: TodolistType = {
    id: "any id",
    title: "New todolist",
    order: 0,
    addedDate: "",
  }
  const action = todolistActions.addTodolist.fulfilled({ todolist: todolist }, "requestId", todolist.title)

  const endTaskState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(statrTodolistsState, action)

  const keys = Object.keys(endTaskState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
