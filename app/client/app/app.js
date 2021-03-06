'use strict'

import React from 'react'
import ReactDom from 'react-dom'
import { createHistory } from 'history'
import { useRouterHistory } from "react-router"
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store/configureStore';
import './css'

const browserHistory = useRouterHistory(createHistory)({
            basename: '/app'
        });

const initialState = Object.assign(
     {},
     window.INITIAL_STATE,
)

const store = configureStore(initialState)
const history = syncHistoryWithStore(browserHistory, store)

export default store

import { initialParams } from './actions/sync'
import { getOIPAUser } from './actions/async'

// dispatch some actions that need to be handled initially
store.dispatch(initialParams())
store.dispatch(getOIPAUser())

import Root from './containers/Root'

document.addEventListener('DOMContentLoaded', function () {
     ReactDom.render(
          <Root store={store} history={history} />,
          document.getElementById('app')
     );
});
