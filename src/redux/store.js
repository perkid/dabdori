import { createStore, combineReducers, applyMiddleware } from 'redux';
import messagesApp from './messagesApp';
import authentication from './authentication';
import order from './order';
import cart from './cart';
import notice from './notice';
import route from './route';
import qna from './qna';
import ReduxThunk from "redux-thunk";

const appReducer = combineReducers({
    messagesApp, authentication, order, cart, route, notice, qna
})

const store = createStore(appReducer, applyMiddleware(ReduxThunk));

export default store;
