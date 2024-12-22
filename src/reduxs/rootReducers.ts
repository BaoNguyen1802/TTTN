import { combineReducers } from '@reduxjs/toolkit'
import accountReducer from './accounts/auth.slices';

const rootReducer = combineReducers({
    auth: accountReducer,
})

export default rootReducer;