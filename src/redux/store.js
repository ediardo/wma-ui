import { createStore } from "redux";

function search(state = 0, action) {
  switch (action.type) {
    case "SEARCH": {
      return { ...state };
    }
    case "CLEAR": {
      return { ...state };
    }
    default:
      return state;
  }
}

export default search;
