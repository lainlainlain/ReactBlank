import React, { Component } from 'react'
import { AppStateType } from '../../reducers/store';
import { requestLogin } from '../../actions/authActions';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Login from './Login';
import Preloader from '../common/Preloader';

type MapStateToPropsType = {
    isAuthFetching: boolean
}

type MapDispatchPropsType = {
    doLogin: (login:string, password:string) => void
}

type OwnPropsType = {
}

type PropsType = MapStateToPropsType & MapDispatchPropsType & OwnPropsType


class LoginContainer extends Component<PropsType> {
    

    render() {
        if(this.props.isAuthFetching === true) {
            return <Preloader />
        }

        return (
            <Login doLogin={this.props.doLogin} />
        )
    }
}

let mapStateToProps = (state: AppStateType):MapStateToPropsType => {
    return {
        isAuthFetching: state.auth.isAuthFetching
    }
}

export default compose(
    connect<MapStateToPropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(
        mapStateToProps, {doLogin: requestLogin})
)(LoginContainer)