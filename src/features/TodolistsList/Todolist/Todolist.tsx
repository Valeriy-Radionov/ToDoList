import { Paper } from "@material-ui/core"
import { Delete } from "@material-ui/icons"
import { Button, IconButton } from "@mui/material"
import React, { useCallback, useEffect } from "react"
import { TaskStatuses, TaskType } from "../../../api/todolists-api"
import { RequestStatusType } from "../../../app/app-reducer"
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm"
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan"
import { useAppDispatch } from "../../../utils/huks/app-hooks"
import { useActions } from "../../../utils/redux-utils"
import { tasksActions, todolistActions } from "../../TodolistsList"
import { fetchTasks } from "../tasks-reducer"
import { FilterValuesType } from "../todolists-reducer"
import { Task } from "./Task/Task"

type TodolistPropsType = {
  todolistId: string
  todolistTitle: string
  tasks: Array<TaskType>
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const Todolist: React.FC<TodolistPropsType> = React.memo(function ({ todolistId, todolistTitle, tasks, filter, entityStatus }) {
  const dispatch = useAppDispatch()
  const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistActions)
  const { addTask } = useActions(tasksActions)

  useEffect(() => {
    const thunk = fetchTasks(todolistId)
    dispatch(thunk)
  }, [])

  const addNewTask = useCallback(
    async (title: string) => {
      addTask({ title, todolistId })
    },
    [addTask, todolistId]
  )

  const removeTodo = () => {
    removeTodolist(todolistId)
  }
  const changeOldTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolistId, title })
    },
    [todolistId, changeTodolistTitle]
  )

  const onAllFilterButtonHandler = useCallback((filterBtn: FilterValuesType) => changeTodolistFilter({ filter: filterBtn, id: todolistId }), [todolistId])

  let tasksForTodolist = tasks
  const isDisabled = entityStatus === "loading"

  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }
  const renderFilterButton = (buttonFilter: FilterValuesType, color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning", text: string) => {
    return (
      <Button onClick={() => onAllFilterButtonHandler(buttonFilter)} variant={filter === buttonFilter ? "outlined" : "text"} color={color}>
        {text}
      </Button>
    )
  }
  return (
    <Paper
      style={{
        position: "relative",
        padding: "10px",
        backgroundColor: "rgb(238,174,202)",
        background: "radial-gradient(circle, rgba(238,174,202,0.14469537815126055) 0%, rgba(233,191,148,1) 100%)",
        boxShadow: "-20px 20px 0 -17px #eee,20px -20px 0 -17px #eee,20px 20px 0 -20px #f0d734,0 0 0 2px #f0d734",
      }}
    >
      <IconButton onClick={removeTodo} disabled={isDisabled} style={{ position: "absolute", top: "5px", right: "5px" }}>
        <Delete color="error" />
      </IconButton>
      <h3>
        <EditableSpan value={todolistTitle} onChange={changeOldTodolistTitle} disabled={isDisabled} />
      </h3>
      <AddItemForm placeholder="Task title" addItem={addNewTask} disabled={isDisabled} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolistId} entityStatus={entityStatus} />
        ))}
        {!tasksForTodolist.length && <div style={{ padding: "10px", color: "grey" }}>No tasks 🗒</div>}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {renderFilterButton("all", "inherit", "All")}
        {renderFilterButton("active", "primary", "Active")}
        {renderFilterButton("completed", "secondary", "Completed")}
      </div>
    </Paper>
  )
})
