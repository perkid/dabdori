import axios from 'axios';
import update from 'react-addons-update';

export const PRICE_CONFIRM = "PRICE_CONFIRM";
export const ALL_PRICE_CONFRIM = "ALL_PRICE_CONFIRM";

export function prcieConfirm(orderNo){
  let index = initialState.orders.findIndex(order => order.orderNo === orderNo);
  return {
    type: PRICE_CONFIRM,
    index: index
  }
}

const initialState = {
  orders: [
    {
      state: 1,
      company: '성진어패럴',
      orderer: '함효경',
      ordererNum: '',
      addr: '영업사원 직접전달',
      remarks: '답돌이 고객 등록 (함효경)',
      orderItem: [
        {
          name: '미라클 4-712',
          color: '9792',
          quantity: '4YD',
          price: '6,700원',
        },
        {
          name: '노랑 20-8000',
          color: '9843',
          quantity: '4YD',
          price: '7,900원',
        },
        {
          name: '노랑 20-8000',
          color: '5969',
          quantity: '4YD',
          price: '7,900원',
        }
      ],
      orderTime: `2020-02-25 10:46`,
      orderNo: 'OA2002-0852',
      flagBtn: true
    },
    {
      state: 2,
      company: '디자인바이스퀘어 1팀',
      orderer: '김새이',
      ordererNum: '010-1111-1111',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 직원 등록',
      orderItem: [
        {
          name: 'JERRY(제리) 2AFPP617',
          color: '9920',
          quantity: '4YD',
          price: '7,500원',
        },
        {
          name: '미라클 4-712',
          color: '2662',
          quantity: '8YD',
          price: '7,000원',
        }
      ],
      orderTime: `2020-02-15 10:46`,
      orderNo: 'OA2001-0514',
      flagBtn: true
    },
    {
      state: 3,
      company: '프로패션',
      orderer: '강은효',
      ordererNum: '010-1111-2222',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 고객 등록 (강은효)',
      orderItem: [
        {
          name: '미라클 4-712',
          color: '2662',
          quantity: '8YD',
          price: '7,000원',
        }
      ],
      orderTime: `2020-02-10 10:46`,
      orderNo: 'OA2002-0781',
      flagBtn: false
    },
    {
      state: 4,
      company: '프로패션',
      orderer: '강은효',
      ordererNum: '010-1111-2222',
      addr: '동대문 매장 오전 10시 이후 수령',
      remarks: '답돌이 고객 등록 (강은효)',
      orderItem: [
        {
          name: '미라클 4-712',
          color: '2662',
          quantity: '8YD',
          price: '7,000원',
        }
      ],
      orderTime: `2020-02-05 10:46`,
      orderNo: 'OA2002-0781',
      flagBtn: false
    }
  ]
}

function orderManagemnet(state = initialState, action) {
  switch (action.type) {
    case PRICE_CONFIRM:
      return update(state, {
        orders:{
          [action.index]:{
            flagBtn: {$set: false}
          }
        }
      })
    default:
      return state
  }
}

export default orderManagemnet;