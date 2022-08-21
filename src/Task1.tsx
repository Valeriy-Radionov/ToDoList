import React, {ChangeEvent, useCallback} from 'react';
import {TaskType} from "./Todolist";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type TaskPropsType = {
    task: TaskType
    todolistId: string

}

export const Task1 = React.memo(({task, todolistId}: TaskPropsType) => {
    const dispatch  = useDispatch()
    const onClickHandler = () => dispatch(removeTaskAC(task.id, todolistId))
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked
            dispatch(changeTaskStatusAC(task.id, newIsDoneValue, todolistId))
        }
        const onTitleChangeHandler = useCallback((newValue: string) => {
            dispatch(changeTaskTitleAC(task.id, newValue, todolistId))
        }, [dispatch])
    return (
    <div key={task.id} className={task.isDone ? "is-done" : ""}>
        <Checkbox
            checked={task.isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
        <IconButton onClick={onClickHandler}>
            <Delete />
        </IconButton>
    </div>
    )
})