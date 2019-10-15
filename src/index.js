import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
// import {createLogger} from 'redux-logger';
// import logger from 'redux-logger';
import rootReducer from './reducers/index';
import {loadState, saveState} from './LocalStorage';
require('dotenv').config();

const persistedStore = loadState();

// const ignore = new Set(['CHECKING','CHECKED','CONNECTING','CONNECTED','RETRIEVING','RETRIEVED'])

// const logger = createLogger({
//   predicate: (getState, action) => !ignore.has(action.type)
// })

const store = createStore(
  rootReducer,
  persistedStore,
  applyMiddleware(thunk)
);

store.subscribe(() => saveState(store.getState()));

export default store;

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
