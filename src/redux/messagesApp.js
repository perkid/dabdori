import { GiftedChat } from 'react-native-gifted-chat';
// Action Types
export const SET_TEXT = 'SET_TEXT';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RESET_MESSAGE = 'RESET_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
// Action Creators

export function setText(text){
  return {
    type: SET_TEXT,
    text: text
  }
};

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

export function clearMessage(text) {
  return {
    type: CLEAR_MESSAGE,
    text: text
  }
}


const initialState = {
  messages: [
    ],
};

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEXT:
      return {
        messages: [{
          _id: 1,
          text: action.text,
          createdAt: new Date(),
          quickReplies: {
            type: 'radio',
            values: [
              {
                title: '현물조회',
                value: 'red',
              },
              {
                title: '샘플신청',
                value: 'white',
              },
              {
                title: '아이템 정보',
                value: 'green',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'Dabdori',
          },
        }]
      }
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
          text: action.text,
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