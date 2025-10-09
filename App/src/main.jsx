import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
    createBrowserRouter,
    createRoutesFromChildren,
    Route,
    RouterProvider,
} from 'react-router-dom'
import Home from '../src/Components/Home/Home.jsx'
import LoginForm from './Components/Login_SignUp/Login.jsx'
import SignUp from './Components/Login_SignUp/SignUp.jsx'
import store from './Redux_Store/store.js'
import { Provider } from 'react-redux'
import Contacts from './Components/Contacts/Contacts.jsx'
import Profile from './Components/Profile/Profile.jsx'
import CallScreen from './Components/Calling/CallScreen.jsx'
const router = createBrowserRouter(
    createRoutesFromChildren(
        <Route path="/" element={<App />}>
            <Route path="" element={<Home />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="profile" element={<Profile />} />
            <Route path="call" element={<CallScreen />} />
        </Route>
    )
)
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
)
