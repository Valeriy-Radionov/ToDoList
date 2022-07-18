import React, {ChangeEvent} from "react";

type PropsType = {
    isDone: boolean
    callBack: (isDone: boolean) => void
}
export const CheckBoxComponent = (props: PropsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.callBack(newIsDoneValue)
    }

    return (
        <input type="checkbox" onChange={onChangeHandler} checked={props.isDone}/>
    )
}