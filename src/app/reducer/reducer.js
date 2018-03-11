import {
    SET_SELECTION,
    SET_RASTER,
    CHANGE_TOOL,
    DELETE_OUTLINE_NODE,
    MOVE_OUTLINE_NODE
} from "../actions/actionTypes";

import testState from "./testState.json";

// SO says this is a fast way to get a deep copy
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const reducer = (state = testState, action) => {
    console.log("action: ", action);
    let nextState;
    switch (action.type) {
        case SET_SELECTION: {
            nextState = deepCopy(state);
            const { id } = action.payload;
            nextState.selection = id;
            break;
        }
        case SET_RASTER: {
            nextState = deepCopy(state);
            const { rasterBase64, width, height } = action.payload;
            nextState.raster = { rasterBase64, width, height };
            break;
        }
        case CHANGE_TOOL: {
            nextState = deepCopy(state);
            const { tool } = action.payload;
            nextState.currentTool = { tool };
            break;
        }
        case DELETE_OUTLINE_NODE: {
            nextState = deepCopy(state);
            const { patchId, nodeId } = action.payload;
            delete nextState.patches[patchId].outline.nodes[nodeId];
            break;
        }
        case MOVE_OUTLINE_NODE: {
            nextState = deepCopy(state);
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
