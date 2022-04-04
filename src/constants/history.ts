import { basename } from './constants';
import { createBrowserHistory } from 'history'

export default createBrowserHistory({basename: basename})