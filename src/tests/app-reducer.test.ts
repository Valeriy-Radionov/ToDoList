import { appReducer } from "../app"
import { InitialAppStateType } from "../app/app-reducer"
import { appActions } from "../CommonActions/App"

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
  const action = appActions.setAppError({ error: error })
  const endState = appReducer(startState, action)
  expect(endState.error).toBe(error)
})

test("correct status should be set", () => {
  let action = appActions.setAppStatus({ status: "loading" })
  const endState = appReducer(startState, action)

  expect(endState.status).toBe("loading")
})
