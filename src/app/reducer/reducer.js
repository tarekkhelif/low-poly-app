import {
    SET_SELECTION,
    SET_RASTER,
    CHANGE_TOOL,
    CHANGE_OUTLINE_TOOL_MODE,
    ADD_OUTLINE_NODE,
    DELETE_OUTLINE_NODE,
    MOVE_OUTLINE_NODE
} from "../actions/actionTypes";

import testState from "./testState.json";

// SO says this is a fast way to get a deep copy
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const reducer = (state = testState, action) => {
    console.log("action: ", action);
    let nextState = deepCopy(state);

    switch (action.type) {
        case SET_SELECTION: {
            const { id } = action.payload;
            nextState.selection = id;
            break;
        }
        case SET_RASTER: {
            const { rasterBase64, width, height } = action.payload;
            nextState.raster = { rasterBase64, width, height };
            break;
        }
        case CHANGE_TOOL: {
            const { tool } = action.payload;
            nextState.currentTool = { tool };
            break;
        }
        case CHANGE_OUTLINE_TOOL_MODE: {
            const { mode } = action.payload;
            nextState.currentTool.mode = mode;
            break;
        }
        case ADD_OUTLINE_NODE: {
            const { patchId, nodeId, point } = action.payload;
            nextState.patches[patchId].outline.nodes[nodeId] = { point };
            break;
        }
        case DELETE_OUTLINE_NODE: {
            const { patchId, nodeId } = action.payload;
            delete nextState.patches[patchId].outline.nodes[nodeId];
            break;
        }
        case MOVE_OUTLINE_NODE: {
            const { patchId, nodeId, newPoint } = action.payload;
            nextState.patches[patchId].outline.nodes[nodeId].point = newPoint;
            break;
        }
        default:
            nextState = state;
    }
    console.log("state: ", nextState);
    return nextState;
};
