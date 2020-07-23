import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const GET_QNA_LIST = "GET_QNA_LIST";
export const GET_QNA_LIST_SUCCESS = "GET_QNA_LIST_SUCCESS";
export const GET_QNA_LIST_FAILURE = "GET_QNA_LIST_FAILURE";

export const INSERT_QNA = "INSERT_QNA";
export const INSERT_QNA_SUCCESS = "INSERT_QNA_SUCCESS";
export const INSERT_QNA_FAILURE = "INSERT_QNA_FAILURE";

const url = getUrl();

export function getQNAListRequest(userInfo){
    return (dispatch) => {
        dispatch(getQNAList())
        return axios.post(url + `/api/getQnaList.dab`,
        {
            object_id: userInfo.object_id,
            user_id: userInfo.user_id,
            role: userInfo.role
        }).then((response) => {
            dispatch(getQNAListSuccess(response.data))
        }).catch((err) => {
            dispatch(getQNAListFailure())
        })
    }
}

export const getQNAList = () => ({ type: GET_QNA_LIST })

export const getQNAListSuccess = (qna) => ({ type: GET_QNA_LIST_SUCCESS , qna});

export const getQNAListFailure = () => ({ type: GET_QNA_LIST_FAILURE });


export function insertQNARequest(userInfo, content, qna_id){
    return (dispatch) => {
        dispatch(insertQNA())
        if(userInfo.role!=='employee'){
            return axios.post(url + `/api/insertQna.dab`,
            {
                role: userInfo.role,
                user_id: userInfo.user_id,
                content: content
            }).then((response) => {
                dispatch(insertQNASuccess(response.data))
            }).catch((err) => {
                dispatch(insertQNAFailure())
            })
        }
        if(userInfo.role==='employee'){
            return axios.post(url + `/api/insertQna.dab`,
            {
                role: userInfo.role,
                user_id: userInfo.user_id,
                content: content,
                qna_id:qna_id
            }).then((response) => {
                console.log(response.data)
                dispatch(insertQNASuccess(response.data))
            }).catch((err) => {
                console.log(err)
                dispatch(insertQNAFailure())
            })
        }
    }
}

export const insertQNA = () => ({ type: INSERT_QNA })

export const insertQNASuccess = () => ({ type: INSERT_QNA_SUCCESS});

export const insertQNAFailure = () => ({ type: INSERT_QNA_FAILURE });


const initialState = {
    qna: {
        status: 'INIT',
        list:[]
    },
    insert: {
        status: 'INIT'
    }
}

function qna(state = initialState, action) {
    if (typeof state === "undefined")
    state = initialState;
    
    switch (action.type) {
        case GET_QNA_LIST:
            return update(state, {
                qna:{
                    status: { $set: 'WAITING'}
                }
            })
        case GET_QNA_LIST_SUCCESS:
            return update(state, {
                qna:{
                    status: { $set: 'SUCCESS'},
                    list: { $set: action.qna}
                }
            })
        case GET_QNA_LIST_FAILURE:
            return update(state, {
                qna:{
                    status: { $set: 'FAILURE'},
                }
            })
        case INSERT_QNA:
            return update(state, {
                insert:{
                    status: { $set: 'WAITING'}
                }
            })
        case INSERT_QNA_SUCCESS:
            return update(state, {
                insert:{
                    status: { $set: 'SUCCESS'},
                }
            })
        case INSERT_QNA_FAILURE:
            return update(state, {
                insert:{
                    status: { $set: 'FAILURE'},
                }
            })
        default:
            return state
    }
  }
  
  export default qna;