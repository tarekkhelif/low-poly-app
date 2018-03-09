import {
    SET_RASTER,
    CHANGE_TOOL,
    OUTLINE_TOOL,
} from "../actions/actionTypes";

import testState from "./testState.json";

const defaultState = {
    raster: {
        rasterBase64: "",
        width: 600,
        height: 400
    },
    currentTool: {
        tool: OUTLINE_TOOL
    }
};

export const reducer = (state = testState, action) => {
    console.log(action);
    if (action.type === SET_RASTER) {
        const nextState = { ...state };
        const { rasterBase64, width, height } = action.payload;
        nextState.raster = { rasterBase64, width, height };
        return nextState;
    } else if (action.type === CHANGE_TOOL) {
        const nextState = { ...state };
        const { tool } = action.payload;
        nextState.currentTool = { tool };
        return nextState;
    }
    return state;
};
