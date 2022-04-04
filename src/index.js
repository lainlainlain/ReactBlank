import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import store from './reducers/store'
import 'antd/dist/antd.css'
import './styles/style.scss'
import { BrowserRouter } from 'react-router-dom'
import { basename } from './constants/constants'
import ruRU from 'antd/es/locale/ru_RU'
import { ConfigProvider } from 'antd'

ReactDOM.render(
    <BrowserRouter basename={basename}>
        <Provider store={store}>
            <ConfigProvider locale={ruRU}>
                <App/>
            </ConfigProvider>
        </Provider>
    </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
