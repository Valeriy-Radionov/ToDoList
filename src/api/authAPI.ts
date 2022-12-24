import { instance, ResponseType } from "./todolists-api"
import { AxiosResponse } from "axios"

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: string }>>>("auth/login", data)
  },
  me() {
    return instance.get<ResponseType<AuthMeType>>("auth/me")
  },
  logout() {
    return instance.delete<ResponseType>("auth/login")
  },
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export type AuthMeType = {
  id: number
  email: string
  login: string
}
