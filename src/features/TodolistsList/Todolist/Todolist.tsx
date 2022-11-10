import React, { useCallback, useEffect } from "react"
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm"
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan"
import { Task } from "./Task/Task"
import { TaskStatuses, TaskType } from "../../../api/todolists-api"
import { FilterValuesType } from "../todolists-reducer"
import { fetchTasks } from "../tasks-reducer"
import { Delete } from "@material-ui/icons"
import { useAppDispatch } from "../../../utils/huks/app-hooks"
import { Button, IconButton } from "@mui/material"
import { RequestStatusType } from "../../../app/app-reducer"

type TodolistPropsType = {
  id: string
  title: string
  tasks: Array<TaskType>
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export const Todolist = React.memo(function (props: TodolistPropsType) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const thunk = fetchTasks(props.id)
    dispatch(thunk)
  }, [])

  const addTask = useCallback(
    (title: string) => {
      props.addTask(title, props.id)
    },
    [props.addTask, props.id]
  )

  const removeTodolist = () => {
    props.removeTodolist(props.id)
  }
  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.id, title)
    },
    [props.id, props.changeTodolistTitle]
  )

  const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.id, props.changeFilter])
  const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.id, props.changeFilter])
  const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.id, props.changeFilter])

  let tasksForTodolist = props.tasks
  const isDisabled = props.entityStatus === "loading"

  if (props.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (props.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={changeTodolistTitle} disabled={isDisabled} />
        <IconButton onClick={removeTodolist} disabled={isDisabled}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={isDisabled} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.id}
            removeTask={props.removeTask}
            changeTaskTitle={props.changeTaskTitle}
            changeTaskStatus={props.changeTaskStatus}
            entityStatus={props.entityStatus}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button variant={props.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
          All
        </Button>
        <Button variant={props.filter === "active" ? "outlined" : "text"} onClick={onActiveClickHandler} color={"primary"}>
          Active
        </Button>
        <Button variant={props.filter === "completed" ? "outlined" : "text"} onClick={onCompletedClickHandler} color={"secondary"}>
          Completed
        </Button>
      </div>
    </div>
  )
})
