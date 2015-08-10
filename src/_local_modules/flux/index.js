import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)
const finalCreateStore = applyMiddleware(thunk)(createStore)

export const store = finalCreateStore(reducer)
