import { createStore, combineReducers, applyMiddleware } from 'redux';
import messagesApp from './messagesApp';
import authentication from './authentication';
import orderManagement from './orderManagement';
import cartManagement from './cartManagement';
import ReduxThunk from "redux-thunk";

const appReducer = combineReducers({
    messagesApp, authentication, orderManagement, cartManagement
})

const store = createStore(appReducer, applyMiddleware(ReduxThunk));

export default store;
