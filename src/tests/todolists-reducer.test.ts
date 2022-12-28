import { text } from "stream/consumers"
import { v1 } from "uuid"
import { RequestStatusType } from "../app/app-reducer"
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistStatusAC,
  changeTodolistTitleTC,
  fetchTodolistsTC,
  FilterValuesType,
  removeTodolistTC,
  TodolistDomainType,
  todolistsReducer,
} from "../features/TodolistsList/todolists-reducer"

let todolistId1: string
let todolistId2: string
let startState: TodolistDomainType[] = []

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
    { id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
  ]
})

test("correct todolist should be removed", () => {
  const data = { id: todolistId1 }
  const action = removeTodolistTC.fulfilled(data, "requestId", todolistId1)
  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  const data = {
    id: todolistId1,
    title: "New todo",
    addedDate: "",
    order: 0,
  }
  const action = addTodolistTC.fulfilled({ todolist: data }, "requestId", data.title)

  const endState = todolistsReducer(startState, action)
  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("New todo")
  expect(endState[0].filter).toBe("all")
})

test("correct todolist should change it's name", () => {
  const newTodolistTitle = "New todolist title"
  const data = { id: todolistId2, title: newTodolistTitle }
  const action = changeTodolistTitleTC.fulfilled(data, "requestId", data)
  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  const newFilter: FilterValuesType = "completed"
  const action = changeTodolistFilterAC({ id: todolistId1, filter: newFilter })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].filter).toBe(newFilter)
  expect(endState[1].filter).toBe("all")
})

test("todolist should be added", () => {
  const title = "New todo"
  const data = { todolists: startState }
  const action = fetchTodolistsTC.fulfilled(data, "requestId")
  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(2)
})

test("correct entity status of todolist should be change", () => {
  let newStatus: RequestStatusType = "loading"
  let action = changeTodolistStatusAC({ id: todolistId2, status: newStatus })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe("idle")
  expect(endState[1].entityStatus).toBe(newStatus)
})