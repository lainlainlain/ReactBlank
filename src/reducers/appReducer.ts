import { ACCEPT_COOKIES } from "../actions/appActions"

type InitialStateType = {
    isCookiesAccepted: boolean
}

let initialState: InitialStateType = {
    isCookiesAccepted: false
}

const appReducer = (state = initialState, action: any): InitialStateType => {
    switch(action.type) {
        case ACCEPT_COOKIES:
            return {...state, isCookiesAccepted: action.accept}
        default:
            return state
    }
}

export default appReducer