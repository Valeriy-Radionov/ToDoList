import React, {useEffect, useState} from 'react'
import {todolistApi} from "../API/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
            todolistApi.getTodos().then((response) => {
            setState(response.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = "Mytodolist"
        todolistApi.createTodo(title).then(response => {
            setState(response.data.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "fed6d36d-c350-4098-ad88-95517611d76a"
        todolistApi.deleteTodolist(todolistId).then(response => {
            setState(response.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "25d9dbd9-9411-400b-8733-f3f6d2057506"
        let newTitle = "New Title Value!!!"
        todolistApi.updateTodoTitle({todolistId, newTitle}).then(response => {
            setState(response.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

