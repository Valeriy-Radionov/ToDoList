import { CircularProgress, Container, IconButton, Typography } from "@material-ui/core"
import { Menu } from "@material-ui/icons"
import { AppBar, Button, LinearProgress, Toolbar } from "@mui/material"
import { useEffect } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { appActions } from "."
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar"
import { authActions, authSelectors, Login } from "../features/Auth"
import { TodolistsList } from "../features/TodolistsList"
import { useAppDispatch, useAppSelector } from "../utils/huks/app-hooks"
import "./App.css"
import { selectAppStatus, selectIsInitialized } from "./selectors"
import { useActions } from "./store"

function App() {
  const status = useAppSelector(selectAppStatus)
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
  const { initializeApp } = useActions(appActions)
  const { logoutTC } = useActions(authActions)

  useEffect(() => {
    initializeApp()
  }, [])

  const logOutHandler = () => {
    logoutTC()
  }
  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }
  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static" sx={{ background: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">Notes</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logOutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress color={"secondary"} />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
