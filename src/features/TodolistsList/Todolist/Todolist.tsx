import { Delete } from "@material-ui/icons"
import { Button, IconButton } from "@mui/material"
import React, { useCallback, useEffect } from "react"
import { TaskStatuses, TaskType } from "../../../api/todolists-api"
import { RequestStatusType } from "../../../app/app-reducer"
import { useActions } from "../../../app/store"
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm"
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan"
import { useAppDispatch } from "../../../utils/huks/app-hooks"
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
  const { addTask, updateTask, removeTask } = useActions(tasksActions)
  useEffect(() => {
    const thunk = fetchTasks(todolistId)
    dispatch(thunk)
  }, [])

  const addNewTask = useCallback(
    (title: string) => {
      addTask({ title, todolistId })
    },
    [addTask, todolistId]
  )
  const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId: id, domainModel: { status }, todolistId })
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    updateTask({ taskId: id, domainModel: { title: newTitle }, todolistId })
  }, [])
  const removeTodo = () => {
    removeTodolist(todolistId)
  }
  const changeOldTodolistTitle = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolistId, title })
    },
    [todolistId, changeTodolistTitle]
  )

  const onAllClickHandler = useCallback(() => changeTodolistFilter({ filter: "all", id: todolistId }), [todolistId])
  const onActiveClickHandler = useCallback(() => changeTodolistFilter({ filter: "active", id: todolistId }), [todolistId])
  const onCompletedClickHandler = useCallback(() => changeTodolistFilter({ filter: "completed", id: todolistId }), [todolistId])

  let tasksForTodolist = tasks
  const isDisabled = entityStatus === "loading"

  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolistTitle} onChange={changeOldTodolistTitle} disabled={isDisabled} />
        <IconButton onClick={removeTodo} disabled={isDisabled}>
          <Delete color="error" />
        </IconButton>
      </h3>
      <AddItemForm placeholder="Task title" addItem={addNewTask} disabled={isDisabled} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolistId} removeTask={removeTask} changeTaskTitle={changeTaskTitle} changeTaskStatus={changeTaskStatus} entityStatus={entityStatus} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button variant={filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button variant={filter === "active" ? "outlined" : "text"} onClick={onActiveClickHandler} color={"primary"}>
          Active
        </Button>
        <Button variant={filter === "completed" ? "outlined" : "text"} onClick={onCompletedClickHandler} color={"secondary"}>
          Completed
        </Button>
      </div>
    </div>
  )
})
