import React, { Component } from 'react'
import { Result } from 'antd'

export default class Page404 extends Component {
    render() {
        return (
            <div style={{padding: '40px 0'}}>
                <Result
                    status="404"
                    title="Страница не найдена"
                    subTitle="Возможно страница не существует"
                />
            </div>
        )
    }
}
