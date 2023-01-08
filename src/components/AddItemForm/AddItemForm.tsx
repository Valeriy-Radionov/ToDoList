import { AddBox } from "@material-ui/icons"
import { IconButton } from "@mui/material"
import TextField from "@mui/material/TextField"
import React, { ChangeEvent, KeyboardEvent, useState } from "react"

type AddItemFormPropsType = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
  placeholder: string
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(function ({ addItem, disabled, placeholder }) {
  console.log("AddItemForm called")

  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const addNewItem = async () => {
    if (title.trim() !== "" && title.length < 100) {
      try {
        await addItem(title)
        setTitle("")
      } catch (e) {
        setError(e as string)
      }
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
      addNewItem()
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField variant="outlined" error={!!error} value={title} onChange={onChangeHandler} onKeyPress={onKeyPressHandler} label={placeholder} helperText={error} disabled={!!disabled} />
      <IconButton onClick={addNewItem} disabled={disabled} style={{ marginLeft: "5px" }}>
        <AddBox style={{ color: "#28a12c" }} />
      </IconButton>
    </div>
  )
})
