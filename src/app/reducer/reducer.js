import { SET_SELECTION, SET_RASTER, CHANGE_TOOL } from "../actions/actionTypes";

import testState from "./testState.json";

export const reducer = (state = testState, action) => {
    console.log("action: ", action);
    let nextState;
    switch (action.type) {
        case SET_SELECTION: {
            nextState = { ...state };
            const { id } = action.payload;
            nextState.selection = id;
            break;
        }
        case SET_RASTER: {
            nextState = { ...state };
            const { rasterBase64, width, height } = action.payload;
            nextState.raster = { rasterBase64, width, height };
            break;
        }
        case CHANGE_TOOL: {
            nextState = { ...state };
            const { tool } = action.payload;
            nextState.currentTool = { tool };
            break;
        }
        default:
            nextState = state;
    }
    console.log("state: ", nextState);
    return nextState;
};
