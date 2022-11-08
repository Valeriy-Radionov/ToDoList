import { Satellite } from "@material-ui/icons"
import { appReducer, InitialAppStateType, setAppErrorAC, setAppStatusAC } from "../app/app-reducer"

let startState: InitialAppStateType

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  }
})

test("correct error message should be set", () => {
  const error = "some error"
  const action = setAppErrorAC({ error: error })
  const endState = appReducer(startState, action)
  expect(endState.error).toBe(error)
})

test("correct status should be set", () => {
  let action = setAppStatusAC({ status: "loading" })
  const endState = appReducer(startState, action)

  expect(endState.status).toBe("loading")
})
