import { Actions } from "react-native-gifted-chat";
import { GiftedChat } from 'react-native-gifted-chat';
// Action Types

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RESET = 'RESET';
// Action Creators

export function sendMessage(newMessage = []) {
  return {
    type: SEND_MESSAGE,
    message: newMessage
  }
};

export function reset() {
  return {
    type: RESET,
    message: {
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
      text: '처음으로 돌아갑니다.',
      quickReplies: {
        type: 'radio',
        values: [
          {
            title: '현물조회',
            value: 'inquiry',
          },
          {
            title: '샘플신청',
            value: 'sample',
          },
          {
            title: '아이템 정보',
            value: 'item',
          },
        ],
      },
      user: 2,
    }
  }
}


// reducer
const dapuser = {
  id: 'perkid@youngwoo.co',
  name: '고유준',
  company: '영우',
}

const m = `안녕하세요! ${dapuser.company} ${dapuser.name}님
인공지능 답돌이 입니다.

이용 중 처음 단계로 돌아가고
싶으시면 상단에 답돌이 아이콘
을 클릭하세요!`;

const initialState = {
  messages: [
    {
      _id: 1,
      text: `${m}`,
      createdAt: new Date(),
      quickReplies: {
        type: 'radio',
        values: [
          {
            title: '현물조회',
            value: 'inquiry',
          },
          {
            title: '샘플신청',
            value: 'sample',
          },
          {
            title: '아이템 정보',
            value: 'item',
          },
        ],
      },
      user: {
        _id: 2,
        name: 'Dapdori',
      },
    }]
};

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
          messages: GiftedChat.append(state.messages, action.message[0])

      }
    case RESET:
      return {
          messages: GiftedChat.append(state.messages, [action.message])

      }
    default:
      return state
  }
};

export default messagesReducer;