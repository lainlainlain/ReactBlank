import { ThunkAction } from "redux-thunk"
import { AppStateType, InferActionsTypes } from "../reducers/store"
import { api } from "../api/api"
import { IAuth } from "../entities/Auth"
import cookie from 'js-cookie'
import { message } from "antd"

export const DO_AUTH = 'DO_AUTH'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_USER_DATA = 'SET_USER_DATA'
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE'
export const TOGGLE_IS_AUTH_FETCHING = 'TOGGLE_IS_AUTH_FETCHING'

type ActionsTypes = InferActionsTypes<typeof authActions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const authActions = {
    setToken: (token: string) => ({type: SET_TOKEN, token}),
    setUserData: (id: number, login: string, name: string, role: string[], firstAuth: boolean, code: string, userType: string) => ({type: SET_USER_DATA, id, login, name, role, firstAuth, code, userType }),
    setInitialState: () => ({type: SET_INITIAL_STATE}),
    toggleIsAuthFetching: (isFetching: boolean) => ({type: TOGGLE_IS_AUTH_FETCHING, isFetching})
}

export const requestLogin = (login: string, password: string):ThunkType => async (dispatch, getState) => {
    dispatch(authActions.toggleIsAuthFetching(true))
    const response: IAuth = await api.login(login, password)
    
    if (response !== undefined) {
        window.location.href = '/'
        cookie.set('login', login)
        cookie.set('password', password)
        cookie.set('token', response.token)
        cookie.set('userData', {id: response.user.id, name: response.user.name, role: response.user.role, firstAuth: response.user.first_auth, code: response.user.code, type: response.user.type })
        dispatch(authActions.setUserData(response.user.id, response.user.login, response.user.name, response.user.role, response.user.first_auth, response.user.code, response.user.type))
        dispatch(authActions.setToken(response.token))
    } else {
        message.warning('Не удалось войти. Проверьте введенный логин или пароль')
    }
    dispatch(authActions.toggleIsAuthFetching(false))
}

export const readUserDataFromCookies = ():ThunkType => async (dispatch, getState) => {
    if (cookie.get('userData') !== undefined) {
    const userData: any = JSON.parse(cookie.get('userData')!)
        if (userData) {
            const login = cookie.get('login')!
            dispatch(authActions.setUserData(userData.id, login, userData.name, userData.role, userData.firstAuth, userData.code, userData.type))
            dispatch(authActions.setToken(cookie.get('token')!))
        }
    }
}

export const doLogout = ():ThunkType => async (dispatch, getState) => {
    cookie.remove('login')
    cookie.remove('password')
    cookie.remove('token')
    cookie.remove('userData')
    dispatch(authActions.setInitialState())
}
