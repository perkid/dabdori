import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const SET_NOTICE_TOP_LIST = "SET_NOTICE_TOP_LIST";
export const SET_NOTICE_TOP_LIST_SUCCESS = "SET_NOTICE_TOP_LIST_SUCCESS";
export const SET_NOTICE_TOP_LIST_FAILURE = "SET_NOTICE_TOP_LIST_FAILURE";

export const SET_NOTICE_BODY_LIST = "SET_NOTICE_BODY_LIST";
export const SET_NOTICE_BODY_LIST_SUCCESS = "SET_NOTICE_BODY_LIST_SUCCESS";
export const SET_NOTICE_BODY_LIST_FAILURE = "SET_NOTICE_BODY_LIST_FAILURE";

export const GET_NOTY_DETAIL = "GET_NOTY_DETAIL";
export const GET_NOTY_DETAIL_SUCCESS = "GET_NOTY_DETAIL_SUCCESS";
export const GET_NOTY_DETAIL_FAILURE = "GET_NOTY_DETAIL_FAILURE";

const url = getUrl();


export function setNoticeTopListRequest(role) {
    return (dispatch) => {
        dispatch(setNoticeTopList())
        return axios.post(url + `/api/getNotyTopList.dab`,
            {
                role: role
            }).then((response) => {
                //  console.log(response.data)
                dispatch(setNoticeTopListSuccess(response.data))
            }).catch((err) => {
                dispatch(setNoticeTopListFailure())
            })
    }
}

export const setNoticeTopList = () => ({ type: SET_NOTICE_TOP_LIST })

export const setNoticeTopListSuccess = (list) => ({ type: SET_NOTICE_TOP_LIST_SUCCESS, list })

export const setNoticeTopListFailure = () => ({ type: SET_NOTICE_TOP_LIST_FAILURE })


export function setNoticeBodyListRequest(role) {
    return (dispatch) => {
        dispatch(setNoticeBodyList())
        return axios.post(url + `/api/getNotyBodyList.dab`,
            {
                role: role
            }).then((response) => {
                dispatch(setNoticeBodyListSuccess(response.data))
            }).catch((err) => {
                dispatch(setNoticeBodyListFailure())
            })
    }
}

export const setNoticeBodyList = () => ({ type: SET_NOTICE_BODY_LIST })

export const setNoticeBodyListSuccess = (list) => ({ type: SET_NOTICE_BODY_LIST_SUCCESS, list })

export const setNoticeBodyListFailure = () => ({ type: SET_NOTICE_BODY_LIST_FAILURE })


export function getNotyDetailRequest(noty_id, img_data) {
    return (dispatch) => {
        dispatch(getNotyDetail())
        return axios.post(url + `/api/getNotyDetail.dab`,
            {
                noty_id: noty_id
            }).then((response) => {
                dispatch(getNotyDetailSuccess(response.data, img_data))
            }).catch((err) => {
                console.log(err)
                dispatch(setNoticeBodyListFailure())
            })
    }
}

export const getNotyDetail = () => ({ type: GET_NOTY_DETAIL })

export const getNotyDetailSuccess = (detail, img_data) => ({ type: GET_NOTY_DETAIL_SUCCESS, detail, img_data });

export const getNotyDetailFailure = () => ({ type: GET_NOTY_DETAIL_FAILURE });

const initialState = {
    notice: {
        noticeStatus: 'INIT',
        topList: [],
        bodyList: [],
        notyDetail: {
            detail: {
            },
            img_data: {
            },
            status: 'INiT',
        }
    }
}

function cart(state = initialState, action) {
    if (typeof state === "undefined")
        state = initialState;

    switch (action.type) {
        case SET_NOTICE_TOP_LIST:
            return update(state, {
                notice: {
                    noticeStatus: { $set: `WAITING` }
                }
            })
        case SET_NOTICE_TOP_LIST_SUCCESS:
            return update(state, {
                notice: {
                    topList: { $set: action.list },
                    noticeStatus: { $set: `SUCCESS` }
                }
            })
        case SET_NOTICE_TOP_LIST_FAILURE:
            return update(state, {
                notice: {
                    noticeStatus: { $set: 'FAILURE' }
                }
            })
        case SET_NOTICE_BODY_LIST:
            return update(state, {
                notice: {
                    noticeStatus: { $set: `WAITING` }
                }
            })
        case SET_NOTICE_BODY_LIST_SUCCESS:
            return update(state, {
                notice: {
                    bodyList: { $set: action.list },
                    noticeStatus: { $set: `SUCCESS` }
                }
            })
        case SET_NOTICE_BODY_LIST_FAILURE:
            return update(state, {
                notice: {
                    noticeStatus: { $set: 'FAILURE' }
                }
            })
        case GET_NOTY_DETAIL:
            return update(state, {
                notice: {
                    notyDetail: {
                        status: { $set: `WAITING` }
                    }
                }
            })
        case GET_NOTY_DETAIL_SUCCESS:
            return update(state, {
                notice: {
                    notyDetail: {
                        detail: { $set: action.detail },
                        img_data: { $set: action.img_data},
                        status: { $set: 'SUCCESS' }
                    }
                }
            })
        case GET_NOTY_DETAIL_FAILURE:
            return update(state, {
                notice: {
                    notyDetail: {
                        status: { $set: `FAILURE` }
                    }
                }
            })
        default:
            return state
    }
}

export default cart;