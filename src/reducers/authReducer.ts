import { SET_TOKEN, SET_USER_DATA, TOGGLE_IS_AUTH_FETCHING, SET_INITIAL_STATE } from '../actions/authActions'

type InitialStateType = {
    token: string
    id: number | null
    login: string | null
    name: string | null
    isAuthFetching: boolean
    role: string[]
    firstAuth: boolean,
    code: string | null,
    type: string | null
}

let initialState: InitialStateType = {
    token: "",
    id: null,
    login: null,
    name: null,
    isAuthFetching: false,
    role: [],
    firstAuth: false,
    code: null,
    type: null
}

const authReducer = (state = initialState, action: any): InitialStateType => {
    switch(action.type) {
        case SET_INITIAL_STATE:
            return {...initialState}
        case SET_TOKEN:
            return {...state, token: action.token};
        case SET_USER_DATA:
            return {...state, id: action.id, login: action.login, name: action.name, role: action.role, firstAuth: action.firstAuth, code: action.code, type: action.userType}
        case TOGGLE_IS_AUTH_FETCHING:
            return {...state, isAuthFetching: action.isFetching}
        default:
            return state;
    }
}

export default authReducer