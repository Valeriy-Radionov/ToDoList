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
  const addTodolistCallback = useCallback(async (title: string) => {
    addTodolist(title)
  }, [])
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }
  return (
    <>
      <Grid container style={{ padding: "20px 20px 20px 0px" }}>
        <AddItemForm placeholder="Todolist title" addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3} style={{ flexWrap: "nowrap", overflow: "scroll" }}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]
          return (
            <Grid item key={tl.id}>
              <div
                style={{
                  width: "300px",
                }}
              >
                <Todolist todolistId={tl.id} todolistTitle={tl.title} tasks={allTodolistTasks} entityStatus={tl.entityStatus} filter={tl.filter} />
              </div>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
