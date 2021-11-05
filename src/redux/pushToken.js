import update from 'react-addons-update';
// Action Types
export const SET_TOKEN = 'SET_TOKEN';
// Action Creators

export function setToken(token){
  return {
    type: SET_TOKEN,
    pToken: token
  }
};

const initialState = {
  pToken: ''
};

function pushToken(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
        return update(state, {
            pToken : { $set: action.pToken}
        })
    default:
      return state
  }
};

export default pushToken;