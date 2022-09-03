import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppRootStateType, dispatchAppThunk} from "../../app/store";

export const useAppDispatch: () => typeof dispatchAppThunk = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector