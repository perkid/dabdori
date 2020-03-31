import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const SET_ORDER = "SET_ORDER";
export const SET_ORDER_SUCCESS = "SET_ORDER_SUCCESS";
export const SET_ORDER_FAILURE = "SET_ORDER_FAILURE";

export const SET_DETAIL = "SET_DETAIL";
export const SET_DETAIL_SUCCESS = "SET_DETAIL_SUCCESS";
export const SET_DETAIL_FAILURE = "SET_DETAIL_FAILURE";

export const SET_PRICE_CNT = "SET_PRICE_CNT";
export const SET_PRICE_FLAG = "SET_PRICE_FLAG";

export const PRICE_CONFIRM = "PRICE_CONFIRM";
export const PRICE_CONFIRM_SUCCESS = "PRICE_CONFIRM_SUCCESS";
export const PRICE_CONFIRM_FAILURE = "PRICE_CONFIRM_FAILURE";

export const ALL_PRICE_CONFRIM = "ALL_PRICE_CONFIRM";


const url = getUrl();

export function setOrderRequest(data){
  return (dispatch) => {
    dispatch(setOrder())

    return axios.post(url+`/api/orderList.dab`,
    {
      erp_id: data.erp_id,
      start_date: data.start_date,
      end_date: data.end_date
    }).then((response)=>{
        dispatch(setOrderSuccess(response.data))
      }).catch((err)=>{
        dispatch(setOrderFailure())
      })
    }
}

export const setOrder = () => ({ type: SET_ORDER})
export const setOrderSuccess = (orders) => ({ type: SET_ORDER_SUCCESS, orders})
export const setOrderFailure = () => ({ type: SET_ORDER_FAILURE})

export function setDetailRequest(orderNo){
  return (dispatch) => {
    dispatch(setDetail())
    return axios.post(url+`/api/orderDetail.dab`,
    {
      orderNo:orderNo
    }).then((response)=>{
      dispatch(setDetailSuccess(response.data))
    }).catch(()=>{
      dispatch(setDetailFailure())
    })
  }
}
export const setDetail = () => ({type: SET_DETAIL})
export const setDetailSuccess = (detail) => ({type: SET_DETAIL_SUCCESS, detail})
export const setDetailFailure = () => ({type: SET_DETAIL_FAILURE})

export function setPriceCnt(index){
  return {
    type: SET_PRICE_CNT,
    index: index
  }
}

export function setPriceFlag(key){
  return {
    type: PRICE_CONFIRM,
    key: key
  }
}
export function priceConfirmRequest(data){
  return (dispatch) => {
    dispatch(priceConfirm())

    return axios.post(url+`/api/priceConfirm.dab`,
    {
      orderNo:data.orderNo,
      seq:data.seq,
      price:data.price
    }).then((response)=>{
      dispatch(priceConfirmSuccess(response.data))
    }).catch((err)=>{
      dispatch(priceConfirmFailure())
    })
  }
}

export function priceConfirm(){
  return {
    type: PRICE_CONFIRM
  }
}
export function priceConfirmSuccess(response){
  return {
    type: PRICE_CONFIRM_SUCCESS,
    result: response.result,
    cause: response.cause
  }
}
export function priceConfirmFailure(){
  return {
    type: PRICE_CONFIRM_FAILURE,
  }
}
const initialState = {
  orders: [],
  detail: [],
  orderStatus:`INIT`,
  detailStatus:`INIT`,
  confirm:{
    result:`INIT`,
    cause:`INIT`
  }
}

function orderManagemnet(state = initialState, action) {
  if (typeof state === "undefined")
  state = initialState;
  
  switch (action.type) {
    case SET_ORDER:
      return update(state, {
        orderStatus: { $set: `WAITING`}
      })
    case SET_ORDER_SUCCESS:
      return update(state, {
        orders: { $set: action.orders},
        orderStatus: { $set: `SUCCESS`}
      })
    case SET_DETAIL:
      return update(state, {
        detailStatus : { $set:"WAITING"}
      })
    case SET_DETAIL_SUCCESS:
      return update(state, {
        detail: {$set:action.detail},
        detailStatus : { $set:"SUCCESS"}
      })
    case SET_DETAIL_FAILURE:
      return update(state, {
        detailStatus: {$set:`FAILURE`}
      })
    case PRICE_CONFIRM:
      return update(state, {
        confirm: {
          result: { $set: `Waiting` },
          cause: { $set: 0 }
        }
      })
    case PRICE_CONFIRM_SUCCESS:
      return update(state, {
        confirm: {
          result: { $set: action.result },
          cause: { $set: action.cause }
        }
      })
    case PRICE_CONFIRM_FAILURE:
      return update(state, {
        confirm: {
          result: { $set: `FAILURE`}
        }
      })
    case SET_PRICE_CNT:
      let cnt = state.orders[action.index].priceFlagCnt-1
      return update(state, {
        orders:{
          [action.index]:{
            priceFlagCnt: { $set: `${cnt}` }
          }
        }
      })
    case SET_PRICE_FLAG:
      return update(state, {
        detail:{
          [action.key]:{
            priceFlag: { $set: true }
          }
        }
      })
    default:
      return state
  }
}

export default orderManagemnet;