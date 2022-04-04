import { ThunkAction } from "redux-thunk"
import { AppStateType, InferActionsTypes } from "../reducers/store"
import cookie from 'js-cookie'

const actionPre = 'APP_'
export const ACCEPT_COOKIES = actionPre + 'ACCEPT_COOKIES'

type ActionsTypes = InferActionsTypes<typeof authActions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const authActions = {
    acceptCookies: (accept: boolean) => ({type: ACCEPT_COOKIES, accept})
}

export const acceptCookies = (accept: string):ThunkType => async (dispatch, getState) => {
    cookie.set('acceptCookies', accept, {expires: 365})
    dispatch(authActions.acceptCookies(true))
}