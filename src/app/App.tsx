import { useEffect } from "react"
import "./App.css"
import { TodolistsList } from "../features/TodolistsList/TodolistsList"
import { Button, LinearProgress, AppBar, Toolbar } from "@mui/material"
import { Menu } from "@material-ui/icons"
import { useAppDispatch, useAppSelector } from "../utils/huks/app-hooks"
import { CircularProgress, Container, IconButton, Typography } from "@material-ui/core"
import { ErrorSnackbar } from "../components/errorSnackbar/ErrorSnackbar"
import { Login } from "../features/Login/Login"
import { Navigate, Route, Routes } from "react-router-dom"
import { initializeAppTC } from "./app-reducer"
import { logoutTC } from "../features/Login/auth-reducer"

function App() {
  const status = useAppSelector((state) => state.app.status)
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector((state) => state.app.isInitialized)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  const logOutHandler = () => {
    dispatch(logoutTC())
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
