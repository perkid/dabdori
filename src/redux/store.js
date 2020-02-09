import { createStore } from 'redux';
import messagesReducer from './messagesApp';

const store = createStore(messagesReducer);

export default store;
