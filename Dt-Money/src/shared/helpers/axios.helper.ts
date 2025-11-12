import { AxiosInstance } from "axios";
import { IAuthenticateResponse } from "../interfaces/https/authenticate-response";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addTokenToRequest = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const userData = await AsyncStorage.getItem('dt-money-user')

    if (userData) {
      const { token } = JSON.parse(userData) as IAuthenticateResponse

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

}