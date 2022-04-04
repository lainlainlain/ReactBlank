import { Button, Col, Row } from 'antd'
import React, { PureComponent } from 'react'

type PropsType = {
    acceptCookies: (accept: string) => void
}
export default class AcceptCookies extends PureComponent<PropsType> {
    btnAccept_onClick = () => {
        this.props.acceptCookies('true')
    }

    render() {
        return (
            <div className='cookies-accept'>
                <div className='wrapper'>
                    <Row gutter={[20, 0]}>
                        <Col flex='1 1'>
                            <div className='cookies-accept-text'>Мы используем cookie. Это позволяет нам анализировать взаимодействие посетителей с сайтом и делать его лучше. Продолжая пользоваться сайтом, вы соглашаетесь с использованием файлов cookie.</div>
                        </Col>
                        <Col flex='0 0'>
                            <Button type='primary' onClick={this.btnAccept_onClick}>Хорошо</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
