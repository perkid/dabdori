import update from 'react-addons-update';
// Action Types
export const SET_ROUTE = 'SET_ROUTE';
// Action Creators

export function setRoute(route){
  return {
    type: SET_ROUTE,
    routeName: route
  }
};

const initialState = {
  routeName: 'INIT'
};

function route(state = initialState, action) {
  switch (action.type) {
    case SET_ROUTE:
        return update(state, {
            routeName : { $set: action.routeName}
        })
    default:
      return state
  }
};

export default route;