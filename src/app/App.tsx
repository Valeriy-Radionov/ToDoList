import React from 'react'
import './App.css'
import { TodolistsList } from '../features/TodolistsList/TodolistsList'
import {LinearProgress} from "@mui/material";
import {Menu} from "@material-ui/icons";
import {useAppSelector} from "../utils/huks/app-hooks";
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import {ErrorSnackbar} from "../components/errorSnackbar/ErrorSnackbar";


function App() {

    const status = useAppSelector(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color={"secondary"}/>}
            </AppBar>
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    )
}

export default App
