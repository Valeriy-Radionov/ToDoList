import React, { ChangeEvent, useCallback } from "react"
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan"
import { TaskStatuses, TaskType } from "../../../../api/todolists-api"
import { Delete } from "@material-ui/icons"
import { Checkbox, IconButton } from "@mui/material"
import { RequestStatusType } from "../../../../app/app-reducer"

type TaskPropsType = {
  task: TaskType
  todolistId: string
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (params: { taskId: string; todolistId: string }) => void
  entityStatus: RequestStatusType
}

export const Task: React.FC<TaskPropsType> = React.memo(({ task, todolistId, changeTaskStatus, changeTaskTitle, removeTask, entityStatus }) => {
  const onClickHandler = useCallback(() => removeTask({ taskId: task.id, todolistId }), [task.id, todolistId])

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked
      changeTaskStatus(task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId)
    },
    [task.id, todolistId]
  )

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      changeTaskTitle(task.id, newValue, todolistId)
    },
    [task.id, todolistId]
  )

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={entityStatus === "loading"} />
      <IconButton onClick={onClickHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  )
})
