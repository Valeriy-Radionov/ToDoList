import { Grid, Paper } from "@material-ui/core"
import React, { useCallback, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { TaskStatuses } from "../../api/todolists-api"
import { AddItemForm } from "../../components/AddItemForm/AddItemForm"
import { useAppDispatch, useAppSelector } from "../../utils/huks/app-hooks"
import { addTaskTC, removeTaskTC, updateTaskTC } from "./tasks-reducer"
import { Todolist } from "./Todolist/Todolist"
import { addTodolistTC, changeTodolistFilterAC, changeTodolistTitleTC, fetchTodolistsTC, FilterValuesType, removeTodolistTC } from "./todolists-reducer"

export const TodolistsList: React.FC = () => {
  const todolists = useAppSelector((state) => state.todolists)
  const tasks = useAppSelector((state) => state.tasks)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    const thunk = fetchTodolistsTC()
    dispatch(thunk)
  }, [])

  const removeTask = useCallback(function (id: string, todolistId: string) {
    const thunk = removeTaskTC({ taskId: id, todolistId: todolistId })
    dispatch(thunk)
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = addTaskTC({ title: title, todolistId: todolistId })
    dispatch(thunk)
  }, [])

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    const thunk = updateTaskTC({ taskId: id, domainModel: { status }, todolistId })
    dispatch(thunk)
  }, [])

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    const thunk = updateTaskTC({ taskId: id, domainModel: { title: newTitle }, todolistId })
    dispatch(thunk)
  }, [])

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = changeTodolistFilterAC({ id: todolistId, filter: value })
    dispatch(action)
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    const thunk = removeTodolistTC(id)
    dispatch(thunk)
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    const thunk = changeTodolistTitleTC({ id, title })
    dispatch(thunk)
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title)
      dispatch(thunk)
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }
  return (
    <>
      <Grid container style={{ padding: "20px 20px 20px 0px" }}>
        <AddItemForm placeholder="Todolist title" addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]
          return (
            <Grid item key={tl.id}>
              <Paper
                style={{
                  padding: "10px",
                  backgroundColor: "rgb(238,174,202)",
                  background: "radial-gradient(circle, rgba(238,174,202,0.14469537815126055) 0%, rgba(233,191,148,1) 100%)",
                  boxShadow: "-20px 20px 0 -17px #eee,20px -20px 0 -17px #eee,20px 20px 0 -20px #f0d734,0 0 0 2px #f0d734",
                }}
              >
                <Todolist
                  id={tl.id}
                  title={tl.title}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  entityStatus={tl.entityStatus}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
