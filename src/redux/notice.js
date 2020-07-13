import axios from 'axios';
import update from 'react-addons-update';
import getUrl from '../config/environment';

export const SET_NOTICE_LIST = "SET_NOTICE_LIST";
export const SET_NOTICE_LIST_SUCCESS = "SET_NOTICE_LIST_SUCCESS";
export const SET_NOTICE_LIST_FAILURE = "SET_NOTICE_LIST_FAILURE";

const url = getUrl();

export function setNoticeListRequest(user_id){
    return (dispatch) => {
        dispatch(setNoticeList())

        return axios.post(url + ``,
        {
            user_id:user_id
        }).then((response) => {
            dispatch(setNoticeListSuccess(response.data))
        }).catch((err) => {
            dispatch(setNoticeListFailure())
        })
    }
}

export const setNoticeList = () => ({ type: SET_CART_LIST})

export const setNoticeListSuccess = (list) => ({ type: SET_CART_LIST_SUCCESS, list})

export const setNoticeListFailure = () => ({ type: SET_CART_LIST_FAILURE})

const initialState = {
    notice :{
        noticeList:
        [
            {
                index:'6',
                title:'[신칼라] 6번 멀구슬 (2DFNP631)_2개',
                content:`5815 : KHA진한회녹색\n\n10054 : BK먹색검정`,
                image:`https://i.imgur.com/UYiroysl.jpg`,
              },
              {
                index:'5',
                title:'[소재설명] 5번 왕가람 (7-8010)',
                content:`“가람”은 순우리말로 ‘강’, 또는 길고 넓은 내를 뜻합니다.
플루이드하게 흐르는 느낌과 하얀 물결 끝자락을 스트라이프로 표현했다는 의미에서 ‘가람’을 붙였습니다.
가람시리즈 중에서도 가장 넓은 스트라이프를 가졌다고하여 “왕가람”이라 지어졌습니다.

- 부드러운 터치감에 유연함을 극대화 시킨 소재
- 베이직한 폴리레이온처럼 보이나 점선 스트라이프로 스타일을 더한 소재
- 포근한 터치감과 적정밀도, 적정중량감을 찾아낸 완성도 높은 제품
- 뛰어난 자체 신축성과 더불어 셔츠, 자켓, 팬츠, 원피스, 치마 등 다양하게 적용 가능.
- 구김이 잘 가지 않고 편안한 실용적임
      
(참고)
현재 블랙에 화이트 점선 스트라이프 한 칼라 있습니다. 추후 추가 신칼라들 올라올 예정입니다.`,
                image:``,
              },
              {
                index:'4',
                title:'[신아이템] 4번 그린남(7-8071) / 그린단미(7-8072) / 그린아가 (7-8073)',
                content:`1. 그린남(7-8071)
18000본 메모리경사. 판매가 9400~9900원 <그리운 남자> 그린비 파생 아이템.
   
2. 그린단미(7-8072)
12800본 메모리경사. 판매가 8500원 <달콤한 여자 / 아름다운 여자>

3. 그린아가(7-8073)
11000본 메모리경사. 판매가 9500원 <그리운 아가>

*3합 투싸이드 사염.
   
*메모리 TAG부착.
   
*신칼라 전개중.`,
                image:`https://i.imgur.com/MABUbpDl.jpg`,
          },
              {
                index:'3',
                title:'[신칼라] 3번 멀구슬 (2DFNP631)_2개',
                content:`5815 : KHA진한회녹색\n\n10054 : BK먹색검정`,
                image:``,
              },
              {
                index:'2',
                title:'[소재설명] 2번 왕가람 (7-8010)',
                content:`“가람”은 순우리말로 ‘강’, 또는 길고 넓은 내를 뜻합니다.
플루이드하게 흐르는 느낌과 하얀 물결 끝자락을 스트라이프로 표현했다는 의미에서 ‘가람’을 붙였습니다.
가람시리즈 중에서도 가장 넓은 스트라이프를 가졌다고하여 “왕가람”이라 지어졌습니다.

- 부드러운 터치감에 유연함을 극대화 시킨 소재
- 베이직한 폴리레이온처럼 보이나 점선 스트라이프로 스타일을 더한 소재
- 포근한 터치감과 적정밀도, 적정중량감을 찾아낸 완성도 높은 제품
- 뛰어난 자체 신축성과 더불어 셔츠, 자켓, 팬츠, 원피스, 치마 등 다양하게 적용 가능.
- 구김이 잘 가지 않고 편안한 실용적임
      
(참고)
현재 블랙에 화이트 점선 스트라이프 한 칼라 있습니다. 추후 추가 신칼라들 올라올 예정입니다.`,
                image:``,
              },
              {
                index:'1',
                title:'[신아이템] 1번 그린남(7-8071) / 그린단미(7-8072) / 그린아가 (7-8073)',
                content:`1. 그린남(7-8071)
18000본 메모리경사. 판매가 9400~9900원 <그리운 남자> 그린비 파생 아이템.
   
2. 그린단미(7-8072)
12800본 메모리경사. 판매가 8500원 <달콤한 여자 / 아름다운 여자>

3. 그린아가(7-8073)
11000본 메모리경사. 판매가 9500원 <그리운 아가>

*3합 투싸이드 사염.
   
*메모리 TAG부착.
   
*신칼라 전개중.`,
                image:``,
          }
        ],
        noticeStatus:'INIT'
    } 
}

function cart(state = initialState, action) {
    if (typeof state === "undefined")
    state = initialState;
    
    switch (action.type) {
        case SET_NOTICE_LIST:
            return update(state, {
                notice:{
                    noticeStatus: { $set: `WAITING` }
                } 
            })
        case SET_NOTICE_LIST_SUCCESS:
            return update(state, {
                notice:{
                    noticeList: { $set: action.list },
                    noticeStatus: { $set: `SUCCESS` }
                }
            })
        case SET_NOTICE_LIST_FAILURE:
            return update(state, {
                notice: {
                    noticeStatus: { $set: 'FAILURE' }
                }
            })
        default:
            return state
    }
  }
  
  export default cart;