import { combineReducers } from "redux";

import { SET_TESSELATION } from "./appActions";

function tesselation(state = {}, action) {
    let returnVal;
    switch (action.type) {
        case SET_TESSELATION: {
            returnVal = action.payload.tesselationData;
            break;
        }
        default: {
            returnVal = state;
        }
    }

    return returnVal;
}

export const appReducer = combineReducers({ tesselation });
