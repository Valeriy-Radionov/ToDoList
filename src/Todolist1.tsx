import React from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {CheckBoxComponent} from "./components/CheckBoxComponent";
import {TasksStateType, TodolistType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export function Todolist1({todolist}: PropsType) {
    const {title, id, filter} = todolist
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[id])
    const dispatch = useDispatch()

    const addTask = (title: string) => {
        // props.addTask(title, props.id);
        dispatch(addTaskAC(title,id))
    }

    const removeTodolist = () => {
        // props.removeTodolist(props.id);
        dispatch(removeTodolistAC(id))
    }
    const changeTodolistTitle = (title: string) => {
        // props.changeTodolistTitle(props.id, title);
        dispatch(changeTodolistTitleAC(id, title))
    }

    const onAllClickHandler = () => dispatch(changeFilterAC(id, "all"))
    const onActiveClickHandler = () => dispatch(changeFilterAC(id, "active"))
    const onCompletedClickHandler = () => dispatch(changeFilterAC(id, "completed"))
    const changeTaskStatusHandler = (taskId: string, isDone: boolean) => dispatch(changeTaskStatusAC(taskId, isDone, id))
    return <div>
        <h3> <EditableSpan value={title} onChange={changeTodolistTitle} />
            <button onClick={removeTodolist}>x</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, id))
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, id))
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <CheckBoxComponent callBack={(isDone) => changeTaskStatusHandler(t.id, isDone)} isDone={t.isDone}/>
                        <EditableSpan value={t.title} onChange={onTitleChangeHandler} />
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}


