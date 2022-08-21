import React, {useEffect, useState} from 'react'
import axios from "axios";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        axios.get("https://social-network.samuraijs.com/api/1.1/todo-lists", {
                withCredentials: true
            }
        ).then((response) => {
            setState(response.data)
        })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = "Mytodo"
        axios.post("https://social-network.samuraijs.com/api/1.1/todo-lists", {title}, {
            withCredentials: true,
            headers: {
                'API-KEY': "1ca42077-7cf4-467f-8cb0-9dda07038fd9"
            }
        }).then(response => {
            setState(response.data.data.item)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

