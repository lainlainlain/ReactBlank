import React, { Component } from 'react'
import { Spin } from 'antd'

type PropsType = {
    transparent?: boolean
}

export default class Preloader extends Component<PropsType> {
    render() {
        return (
        <div className={'preloader' + (this.props.transparent? ' preloader__transparent' : '')}>
            <div className='preloader_spinner'>
                <Spin />
            </div>
        </div>
        )
    }   
}
