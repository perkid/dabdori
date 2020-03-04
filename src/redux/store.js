import { createStore, combineReducers, applyMiddleware } from 'redux';
import messagesApp from './messagesApp';
import authentication from './authentication';
import orderManagement from './orderManagement';
import ReduxThunk from "redux-thunk";

const appReducer = combineReducers({
    messagesApp, authentication, orderManagement
})

const store = createStore(appReducer, applyMiddleware(ReduxThunk));

export default store;
