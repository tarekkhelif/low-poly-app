import {
    SET_RASTER,
    CHANGE_TOOL,
    TOOL_EDIT_AN_OUTLINE,
} from "../actions/actionTypes";

const defaultState = {
    raster: {
        rasterBase64: "",
        width: 600,
        height: 400
    },
    currentTool: {
        tool: TOOL_EDIT_AN_OUTLINE
    }
};

export const reducer = (state = defaultState, action) => {
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
