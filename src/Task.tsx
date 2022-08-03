import React, {ChangeEvent, memo} from 'react';
import {TaskType} from "./Todolist";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";

export type TaskPropsType = {
    task: TaskType
    removeTask: (taskId: string) => void
    changeTaskStatus: (id: string, isDone: boolean) => void
    changeTaskTitle: (id: string, newTitle: string) => void

}

export const Task = React.memo(({task, removeTask, changeTaskStatus, changeTaskTitle}: TaskPropsType) => {
    const onClickHandler = () => removeTask(task.id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            changeTaskStatus(task.id, newIsDoneValue);
        }
        const onTitleChangeHandler = (newValue: string) => {
            changeTaskTitle(task.id, newValue);
        }
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
}
)