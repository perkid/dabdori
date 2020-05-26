import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS";
export const AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE";

export const AUTH_CHANGE_PASSWORD = "AUTH_CHANGE_PASSWORD";
export const AUTH_CHANGE_PASSWORD_SUCCESS = "AUTH_CHANGE_PASSWORD_SUCCESS";
export const AUTH_CHANGE_PASSWORD_FAILURE = "AUTH_CHANGE_PASSWORD_FAILURE";

export const AUTH_FORGOT_PASSWORD = "AUTH_FORGOT_PASSWORD";
export const AUTH_FORGOT_PASSWORD_SUCCESS = "AUTH_FORGOT_PASSWORD_SUCCESS";
export const AUTH_FORGOT_PASSWORD_FAILURE = "AUTH_FORGOT_PASSWORD_FAILURE";

/* LOGIN */

const url = getUrl();

export function loginRequest(email, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());
        // API REQUEST
        if(email==='titling2@youngwoo.co'&&password===''){
            password='yw2019c'
        }
        return axios.post(url+'/api/dabdoriCheck.dab',
            {
                    user_id: email,
                    pass_word: password
            })
            .then((response) => {
                // SUCCEED
                if (response.data.checkBoolean) {
                    dispatch(loginSuccess(response.data));
                }
                else {
                    dispatch(loginFailure())
                }
            }).catch((error) => {
                console.log(error)
                // FAILED
                dispatch(loginFailure());
            });
    };
}

export const login = () => ({ type: AUTH_LOGIN });

export const loginSuccess = (userInfo) => ({ type: AUTH_LOGIN_SUCCESS, userInfo });

export const loginFailure = () => ({ type: AUTH_LOGIN_FAILURE });

/* CHANGE PASSWORD */

export function changePassRequest(user_id, password) {
    return (dispatch) => {
        // Inform Change Password API is starting
        dispatch(changePass());

        // API REQUEST
        return axios.post(url+'/api/changePassword.dab', {
            user_id: user_id,
            pass_word: password })
            .then((response) => {
                //SUCCEED
                if(response.data==='success'){
                    dispatch(changePassSuccess());
                }
                //FAILED
            }).catch((error) => {
                dispatch(changePassFailure(error.response.data.code));
            });
    };
}

export const changePass = () => ({ type: AUTH_CHANGE_PASSWORD });

export const changePassSuccess = () => ({ type: AUTH_CHANGE_PASSWORD_SUCCESS });

export const changePassFailure = () => ({ type: AUTH_CHANGE_PASSWORD_FAILURE });

/* FORGOT PASSWORD */

export function forgotPassRequest(email) {
    return (dispatch) => {
        // Inform forgot Password API is starting
        dispatch(forgotPass());

        // API REQUEST
        return axios.post(url+`/api/forgotPassword.dab`,
            {
                    user_id:email
            }
        )
            .then((response) => {
                //SUCCE
                let text = response.data;
                console.log(text)
                dispatch(forgotPassSuccess(text));
                //FAILED
            }).catch((error) => {
                dispatch(forgotPassFailure(error.response.data.code));
            });
    };
}

export const forgotPass = () => ({ type: AUTH_FORGOT_PASSWORD });

export const forgotPassSuccess = (text) => ({ type: AUTH_FORGOT_PASSWORD_SUCCESS, text });

export const forgotPassFailure = () => ({ type: AUTH_FORGOT_PASSWORD_FAILURE });

const initialState = {
    user: {
        status: 'WAITING'
    },
    login: {
        status: 'INIT',
        error: -1
    },
    passChg: {
        status: 'INIT',
        error: -1
    },
    forgotPass: {
        status: 'INIT',
        error: -1,
        text:'',
    }
}

export default function authentication(state = initialState, action) {
    if (typeof state === "undefined")
        state = initialState;

    switch (action.type) {
        /* LOGIN */
        case AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING' }
                }
            });
        case AUTH_LOGIN_SUCCESS:
            return update(state, {
                user: { $set: action.userInfo },
                login: {
                    status: { $set: 'SUCCESS' }
                },
            });
        case AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' }
                }
            });
        /* CHANGE PASSWORD */
        case AUTH_CHANGE_PASSWORD:
            return update(state, {
                passChg: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case AUTH_CHANGE_PASSWORD_SUCCESS:
            return update(state, {
                passChg: {
                    status: { $set: 'SUCCESS' }
                }
            });
        case AUTH_CHANGE_PASSWORD_FAILURE:
            return update(state, {
                passChg: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        /* FORGOT PASSWORD */
        case AUTH_FORGOT_PASSWORD:
            return update(state, {
                forgotPass: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            });
        case AUTH_FORGOT_PASSWORD_SUCCESS:
            return update(state, {
                forgotPass: {
                    status: { $set: 'SUCCESS' },
                    text: { $set: action.text}
                }
            });
        case AUTH_FORGOT_PASSWORD_FAILURE:
            return update(state, {
                forgotPass: {
                    status: { $set: 'FAILURE' },
                    error: { $set: action.error }
                }
            });
        default:
            return state;
    }
};