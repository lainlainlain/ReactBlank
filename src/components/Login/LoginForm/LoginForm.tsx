import { Button, TextBox, ValidationSummary, Validator } from 'devextreme-react'
import { RequiredRule } from 'devextreme-react/form'
import React, { Component } from 'react'

type PropsType = {
    doLogin: (login: string, password: string) => void
}

type StateType = {
    login: string | undefined
    password: string | undefined
    modalForgotPswVisible: boolean
    forgotEmail: string | undefined
    showPreloader: boolean
}

export default class LoginForm extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)

        this.state = {
            login: undefined,
            password: undefined,
            modalForgotPswVisible: false,
            forgotEmail: undefined,
            showPreloader: false,
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
        this.setState({login: e.value})
    }

    password_onValueChanged = (e: any) => {
        this.setState({password: e.value})
    }


    render() {
        return (
            <div className='main-signin'>
                <div className='m-b-20'>
                    <div className='main-signin-subtitle'>Для продолжения</div>
                    <div className='main-signin-title'>войдите</div>
                    <form id='form_login' onSubmit={this.form_onSubmit} className='m-b-10'>
                        <div className='main-signin-field'>
                            <div className='main-signin-field_caption'>Логин:</div>
                            <TextBox className='main-signin-field_textbox' value={this.state.login} onValueChanged={this.login_onValueChanged}
                            stylingMode='underlined' placeholder='Адрес электронной почты'>
                                <Validator>
                                    <RequiredRule message="Введите адрес электронной почты" />
                                </Validator>
                            </TextBox>
                        </div>
                        <div className='main-signin-field'>
                            <div className='main-signin-field_caption'>Пароль:</div>
                            <TextBox className='main-signin-field_textbox' value={this.state.password} onValueChanged={this.password_onValueChanged}
                            mode='password' stylingMode='underlined' placeholder='Пароль'>
                                <Validator>
                                    <RequiredRule message="Введите пароль" />
                                </Validator>
                            </TextBox>
                        </div>
                        <ValidationSummary id="summary" className='m-b-10'></ValidationSummary>
                        <div className='ta-c'>
                                <Button
                                    id="button"
                                    text="Войти"
                                    stylingMode='outlined'
                                    className='main-signin-submit_button'
                                    useSubmitBehavior={true} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
