import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "1ca42077-7cf4-467f-8cb0-9dda07038fd9"
    }
})
export type TodoType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
}

export type CommonResponseType<T = {}> = {
    messages: string[];
    fieldsErrors: string[];
    resultCode: number;
    data: T;
}

export const todolistApi = {
    getTodos() {
        return instance.get<TodoType[]>("todo-lists")
    },

    createTodo(title: string) {
        return instance.post<CommonResponseType<{item: TodoType}>>("todo-lists", {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<CommonResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodoTitle(payload: {todolistId: string, newTitle: string}) {
        return instance.put<CommonResponseType>(`todo-lists/${payload.todolistId}`,{
            title: payload.newTitle
        })
    }
}