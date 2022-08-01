import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {

    let todolistId1 = v1();
    let todolistId2 = v1();
const todolists = useSelector<AppRootStateType,Array<TodolistType>>(state => state.todolists)
const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
const dispatch = useDispatch()
    function removeTask(id: string, todolistId: string) {
        let action = removeTaskAC(id, todolistId)
        dispatch(action);
    }

    function addTask(title: string, todolistId: string) {
        let action = addTaskAC(title, todolistId)
        dispatch(action);
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        dispatch(changeTaskStatusAC(id, isDone, todolistId));
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleAC(id,newTitle,todolistId));
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        dispatch(changeFilterAC(todolistId,value))
    }

    function removeTodolist(id: string) {
        let action = removeTodolistAC(id)
        dispatch (action);
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatch(changeTodolistTitleAC(id, title));
    }

    function addTodolist(title: string) {
        let action = addTodolistAC(title)
        dispatch(action)
    }

    return (
        <div className="App">
            <AddItemForm addItem={addTodolist} />
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    if (tl.filter === "active") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                    }
                    if (tl.filter === "completed") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                    }

                    return <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                })
            }

        </div>
    );
}

export default AppWithRedux;
