import React, { ChangeEvent, KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import { AddBox } from "@material-ui/icons"
import { IconButton } from "@mui/material"

type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
  placeholder: string
}

export const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
  console.log("AddItemForm called")

  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const addItem = () => {
    if (title.trim() !== "" && title.length < 100) {
      props.addItem(title)
      setTitle("")
    } else {
      setError("Title length must be 1...100 symbols")
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.charCode === 13) {
      addItem()
    }
  }

  return (
    <div>
      <TextField variant="outlined" error={!!error} value={title} onChange={onChangeHandler} onKeyPress={onKeyPressHandler} label={props.placeholder} helperText={error} disabled={!!props.disabled} />
      <IconButton onClick={addItem} disabled={props.disabled}>
        <AddBox style={{ color: "#28a12c" }} />
      </IconButton>
    </div>
  )
})
