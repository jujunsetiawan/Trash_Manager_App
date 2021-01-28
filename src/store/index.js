import {createStore} from 'redux';
import Data from '../reducer/data';

let store;
export default store = createStore(Data);