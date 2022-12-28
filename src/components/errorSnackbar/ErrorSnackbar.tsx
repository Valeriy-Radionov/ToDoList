import Snackbar from "@mui/material/Snackbar"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import React from "react"
import { useAppSelector } from "../../utils/huks/app-hooks"
import { setAppErrorAC } from "../../app/app-reducer"
import { useDispatch } from "react-redux"
import { appSelectors } from "../../app"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const ErrorSnackbar = () => {
  const error = useAppSelector(appSelectors.selectAppError)
  const dispatch = useDispatch()
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(setAppErrorAC({ error: null }))
  }

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
