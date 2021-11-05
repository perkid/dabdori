import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const SET_CART_LIST = "SET_CART_LIST";
export const SET_CART_LIST_SUCCESS = "SET_CART_LIST_SUCCESS";
export const SET_CART_LIST_FAILURE = "SET_CART_LIST_FAILURE";

export const DELETE_CART_ITEM = "DELETE_CART_ITEM";
export const DELETE_CART_ITEM_SUCCESS = "DELETE_CART_ITEM_SUCCESS";
export const DELETE_CART_ITEM_FAILURE = "DELETE_CART_ITEM_FAILURE";

export const SELECT_ITEM = "SELECT_ITEM";
export const CANCEL_ITEM = "CANCEL_ITEM";

export const CREATE_ORDER = "CREATE_ORDER";
export const CREATE_ORDER_SUCCESS = "CREATE_ORDER_SUCCESS";
export const CREATE_ORDER_FAILURE = "CREATE_ORDER_FAILURE";

const url = getUrl();

const sendPushNotification = async (pushToken, pushMessage) => {
    const message = {
      to: pushToken,
      sound: 'default',
      title: '신규오더',
      body: pushMessage,
      data: { data: '' },
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

export function setCartListRequest(user_id){
    return (dispatch) => {
        dispatch(setCartList())

        return axios.post(url + `/api/cartList.dab`,
        {
            user_id:user_id
        }).then((response) => {
            dispatch(setCartListSuccess(response.data))
        }).catch((err) => {
            dispatch(setCartListFailure())
        })
    }
}

export const setCartList = () => ({ type: SET_CART_LIST})

export const setCartListSuccess = (list) => ({ type: SET_CART_LIST_SUCCESS, list})

export const setCartListFailure = () => ({ type: SET_CART_LIST_FAILURE})

export function deleteCartItemRequest(selectItem){
    return (dispatch) => {
        dispatch(deleteCartItem())
        
        return axios.post(url + `/api/deleteCart.dab`,
            selectItem
        ).then((response)=> {
            dispatch(deleteCartItemSuccess())
        }).catch((err)=>{
            dispatch(deleteCartItemFailure())
        })
    }
}

export const deleteCartItem = () => ({ type: DELETE_CART_ITEM})

export const deleteCartItemSuccess = () => ({ type: DELETE_CART_ITEM_SUCCESS})

export const deleteCartItemFailure = () => ({ type: DELETE_CART_ITEM_FAILURE})

export function selectItem(index){
    return {
        type: SELECT_ITEM,
        index: index
    }
}

export function cancelItem(index){
    return {
        type: CANCEL_ITEM,
        index: index
    }
}

export function createOrderRequest(order, userInfo){
    return (dispatch) => {
        dispatch(createOrder())
        return axios.post(url + `/api/createOrder.dab`,{
            companyCode: userInfo.company_code,
            delyDate: order.delyDate,
            deli_type: order.deli_type,
            dept: order.dept,
            remark: order.remark,
            manager_id: order.manager_id,
            object_id: order.object_id,
            detailList: order.detailList
        }).then((response)=> {
            if(response.data.result==='SUCCESS'){
                dispatch(createOrderSuccess())
                order.detailList.forEach((i)=>{
                    axios.post(url+`/api/insertLog.dab`,{
                        log_gb:'02',
                        item_code:i.item_code,
                        item_name:i.item_name,
                        color_name:i.colorYW,
                        user_name:userInfo.user_name,
                        role: userInfo.role,
                        cust_name:userInfo.company_name,
                        order_no:response.data.cause,
                        order_cnt:i.amount,
                        deli_gb:order.deliType,
                        deli_time:order.deliTime,
                        deli_memo:i.remark
                    })
                })
    
                if(userInfo.role==='client'){
                    let pushToken = userInfo.manager_firebase_token;
                    sendPushNotification(pushToken,`${userInfo.company_name} 오더 단가를 확정해주세요.`)
                }
            }
            if(response.data.result==='FAIL'){
                dispatch(createOrderFailure(response.data.cause))
            }

        }).catch((err)=>{
            dispatch(createOrderFailure())
        })
    }
}

export const createOrder = () => ({ type: CREATE_ORDER })

export const createOrderSuccess = () => ({ type: CREATE_ORDER_SUCCESS }) 

export const createOrderFailure = (cause) => ({ type: CREATE_ORDER_FAILURE, cause })

const initialState = {
    cartList: [],
    selectItem: [],
    cartStatus:`INIT`,
    deleteCartStatus:`INIT`,
    createOrderStatus: {
        status:`INIT`,
        cause:`INIT`,
    }
}

function cart(state = initialState, action) {
    if (typeof state === "undefined")
    state = initialState;
    
    switch (action.type) {
        case SET_CART_LIST:
            return update(state, {
                cartStatus: { $set: `WAITING` }
            })
        case SET_CART_LIST_SUCCESS:
            return update(state, {
                cartList: { $set: action.list },
                cartStatus: { $set: `SUCCESS` }
            })
        case SET_CART_LIST_FAILURE:
            return update(state, {
                cartStatus: { $set: 'FAILURE' }
            })
        
        case DELETE_CART_ITEM:
            return update(state, {
                deleteCartStatus: { $set: `WAITING` }
            })
        case DELETE_CART_ITEM_SUCCESS:
            return update(state, {
                deleteCartStatus: { $set: `SUCCESS` }
            })
        case DELETE_CART_ITEM_FAILURE:
            return update(state, {
                deleteCartStatus: { $set: 'FAILURE' }
            })
        case SELECT_ITEM:
            return update(state, {
                selectItem: { $push: [action.index] }
            })
        case CANCEL_ITEM:
            if(action.index==='all'){
                return update(state, {
                    selectItem: { $splice: [[0]]}
                })
            } else {
                return update(state, {
                    selectItem: { $splice: [[state.selectItem.indexOf(action.index),1]]}
                })
            }
        case CREATE_ORDER:
            return update(state, {
                createOrderStatus: {
                    status: { $set: `WAITING` },
                    cause: { $set: `WAITING` }
                }
            })
        case CREATE_ORDER_SUCCESS:
            return update(state, {
                createOrderStatus: {
                    status: { $set: `SUCCESS` },
                    cause: { $set: `SUCCESS` }
                }
            })
        case CREATE_ORDER_FAILURE:
            return update(state, {
                createOrderStatus: {
                    status:{$set: 'FAILURE'},
                    cause:{$set: action.cause}
                }
            })
        default:
            return state
    }
  }
  
  export default cart;