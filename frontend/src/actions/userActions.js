import axios from "axios";
import {
    loginRequest,
    loginSuccess,
    loginFail,
    clearError,
    registerRequest,
    registerSuccess,
    registerFail
} from "../slices/authSlice";

/* 
Example of login credentials:
{
    "email":"harrisMohd@email.com",
    "password": "01234"
}  
*/

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        // API call simulation
        const { data } = await axios.post('/api/v1/login', { email, password })
        //first arg is url, second is data to send  because it's a post request 
        dispatch(loginSuccess(data))
    }
    catch (error) {
        dispatch(loginFail(error.response.data.message));
    }
}

/* 
Example of userData:
{
    "name": "MohammedHarris",
    "email": "harrisMohd@email.com",
    "password": "01234",
    "avatar": "https://example.com/avatars/alice.jpg",
    "role": "user"
}
*/

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest())

        const config = {
            header: { 'Content-Type': 'multipart/form-data' } // because we are sending image also
        }
        const { data } = await axios.post('/api/v1/register', userData, config);
        dispatchSuccess(data)
    }
    catch (error) {
        dispatch(registerFail(error.response.data.message));
    }
}

// New action to clear errors in the auth state
export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
}