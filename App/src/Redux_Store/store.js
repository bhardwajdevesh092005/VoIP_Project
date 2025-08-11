import {configureStore} from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice';
import callSlice from './Slices/callSlce'
const store = configureStore({reducer:{
    user: userSlice,
    call: callSlice
}})
export default store;
