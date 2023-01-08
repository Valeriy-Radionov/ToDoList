import { Delete } from "@material-ui/icons"
import { Checkbox, IconButton } from "@mui/material"
import React, { ChangeEvent, useCallback } from "react"
import { tasksActions } from "../.."
import { TaskStatuses, TaskType } from "../../../../api/todolists-api"
import { RequestStatusType } from "../../../../app/app-reducer"
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan"
import { useActions } from "../../../../utils/redux-utils"

type TaskPropsType = {
  task: TaskType
  todolistId: string
  entityStatus: RequestStatusType
}

export const Task: React.FC<TaskPropsType> = React.memo(({ task, todolistId, entityStatus }) => {
  const onClickHandler = useCallback(() => removeTask({ taskId: task.id, todolistId }), [task.id, todolistId])
  const { updateTask, removeTask } = useActions(tasksActions)

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({ taskId: task.id, domainModel: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New }, todolistId })
    },
    [task.id, todolistId]
  )

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({ taskId: task.id, domainModel: { title: newValue }, todolistId })
    },
    [task.id, todolistId]
  )

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""} style={{ position: "relative" }}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />
      <EditableSpan value={task.title} onChange={onTitleChangeHandler} disabled={entityStatus === "loading"} />
      <IconButton onClick={onClickHandler} disabled={entityStatus === "loading"} style={{ position: "absolute", top: "1px", right: "1px" }}>
        <Delete fontSize={"small"} />
      </IconButton>
    </div>
  )
})
