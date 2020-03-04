import { GiftedChat } from 'react-native-gifted-chat';
// Action Types

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RESET_MESSAGE = 'RESET_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
// Action Creators

export function sendMessage(newMessage = []) {
  return {
    type: SEND_MESSAGE,
    message: newMessage
  }
};

export function resetMessage() {
  return {
    type: RESET_MESSAGE,
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

export function clearMessage() {
  return {
    type: CLEAR_MESSAGE,
  }
}

// reducer
const user = {
  id: 'perkid@youngwoo.co',
  name: '고유준',
  company: '영우',
}

const m = `안녕하세요! ${user.company} ${user.name}님
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
        name: 'Dabdori',
      },
    }],
};

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
          messages: GiftedChat.append(state.messages, action.message[0]),
      }
    case RESET_MESSAGE:
      return {
          messages: GiftedChat.append(state.messages, [action.message]),
      }
    case CLEAR_MESSAGE:
      return {
        messages: [ {
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
        }],
      }
    default:
      return state
  }
};

export default messagesReducer;