import React, { Component } from 'react'
import LoginForm from './LoginForm/LoginForm';

type PropsType = {
    doLogin: (login: string, password: string) => void
}

type StateType = {
    login: string | undefined
    password: string | undefined
}

export default class Login extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)

        this.state = {
            login: undefined,
            password: undefined
        }
    }

    form_onSubmit = async (e: any) => {
        e.preventDefault()
        debugger
        if (this.state.login && this.state.password) {
            this.props.doLogin(this.state.login!, this.state.password!)
        }
    }

    login_onValueChanged = (e: any) => {
        this.setState({ login: e.value })
    }

    password_onValueChanged = (e: any) => {
        this.setState({ password: e.value })
    }

    render() {
        return (
            <div className='login'>
                <div className='login-container'>
                    <div className='login-form'>
                        <LoginForm doLogin={this.props.doLogin} key={'login'} />
                    </div>
                </div>
            </div>
        )
    }
}
