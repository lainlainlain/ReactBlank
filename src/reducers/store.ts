import {createStore, combineReducers, applyMiddleware} from "redux"
import appReducer from './appReducer'
import thunk from "redux-thunk"
import authReducer from "./authReducer"

let rootReducer = combineReducers({
    app: appReducer, 
    auth: authReducer,
})

type RootReducerType = typeof rootReducer

export type AppStateType = ReturnType<RootReducerType>
type PropertiesTypes<T> = T extends {[key: string]: infer U} ? U : never
export type InferActionsTypes<T extends {[key: string]: (...args: any[])=>any}> = ReturnType<PropertiesTypes<T>>

let store = createStore(rootReducer, applyMiddleware(thunk))

export default store