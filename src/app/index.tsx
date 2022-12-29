import * as appSelectors from "./selectors"
import { slice, asyncActions } from "./app-reducer"
const appActions = {
  ...slice.actions,
  ...asyncActions,
}
export { appSelectors, appActions }
