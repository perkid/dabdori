import axios from 'axios';
import update from 'react-addons-update';

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

export function loginRequest(email, password) {
    return (dispatch) => {
        // Inform Login API is starting
        dispatch(login());
        // API REQUEST
        return axios.post('http://127.0.0.1:4000/api/account/signin', { email, password })
            .then((response) => {
                // SUCCEED
                dispatch(loginSuccess(response.data.account.email));
            }).catch((error) => {
                console.log(error)
                // FAILED
                dispatch(loginFailure());
            });
    };
}

export const login = () => ({ type: AUTH_LOGIN });

export const loginSuccess = (email) => ({ type: AUTH_LOGIN_SUCCESS, email});

export const loginFailure = () => ({ type: AUTH_LOGIN_FAILURE });

/* CHANGE PASSWORD */

export function changePassRequest(email, password, newPassword1, newPassword2) {
    return (dispatch) => {
        // Inform Change Password API is starting
        dispatch(changePass());

        // API REQUEST
        return axios.put('/api/account/password/change', { email, password, newPassword1, newPassword2 })
            .then((response) => {
                //SUCCEED
                dispatch(changePassSuccess());
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

export function forgotPassRequest(email, password, newPassword1, newPassword2) {
    return (dispatch) => {
        // Inform forgot Password API is starting
        dispatch(forgotPass());

        // API REQUEST
        return axios.put('/api/account/password/forgot', { email, password, newPassword1, newPassword2 })
            .then((response) => {
                //SUCCEED
                dispatch(forgotPassSuccess());
                //FAILED
            }).catch((error) => {
                dispatch(forgotPassFailure(error.response.data.code));
            });
    };
}

export const forgotPass = () => ({ type: AUTH__PASSWORD });

export const forgotPassSuccess = () => ({ type: AUTH__PASSWORD_SUCCESS });

export const forgotPassFailure = () => ({ type: AUTH__PASSWORD_FAILURE });

const initialState = {
    user: {
        _id: 1,
        email: 'INIT',
        name: '고유준',
        company: '영우',
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
        error: -1
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
                user: {
                    email: { $set: action.email}
                },
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
                    status: { $set: 'SUCCESS' }
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