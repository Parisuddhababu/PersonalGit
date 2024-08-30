import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  signin: {},
  permission : []
}

const changeState = (state = initialState, { type, ...rest }) => { // NOSONAR
  if (type === "set") return { ...state, ...rest };
  else if (type === "signin" || type === "permission") return { ...rest };
  else return state;
}

const store = createStore(changeState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store
