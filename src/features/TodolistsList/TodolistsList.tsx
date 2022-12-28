import { Grid, Paper } from "@material-ui/core"
import React, { useCallback, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { tasksActions, todolistActions, todolistsSelectors } from "."
import { TaskStatuses } from "../../api/todolists-api"
import { useActions } from "../../app/store"
import { AddItemForm } from "../../components/AddItemForm/AddItemForm"
import { useAppSelector } from "../../utils/huks/app-hooks"
import { authSelectors } from "../Auth"
import { Todolist } from "./Todolist/Todolist"

export const TodolistsList: React.FC = () => {
  const todolists = useAppSelector(todolistsSelectors.selectTodolists)
  const tasks = useAppSelector(todolistsSelectors.selectTasks)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
  const { addTodolist, fetchTodolists } = useActions(todolistActions)

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

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
                <Todolist todolistId={tl.id} todolistTitle={tl.title} tasks={allTodolistTasks} entityStatus={tl.entityStatus} filter={tl.filter} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
