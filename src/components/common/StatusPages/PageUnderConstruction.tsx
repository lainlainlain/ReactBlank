import React, { Component } from 'react'
import { Result } from 'antd'

export default class PageUnderConstruction extends Component {
    render() {
        return (
            <div style={{padding: '40px 0'}}>
                <Result
                    status="404"
                    title="Страница в разработке"
                    subTitle="Попробуйте посетить эту страницу позже"
                />
            </div>
        )
    }
}
