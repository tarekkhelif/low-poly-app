import {
    SET_SELECTION,
    SET_RASTER,
    /* TOOLS */
    CHANGE_TOOL,
    // OUTLINE TOOL
    OUTLINE_CHANGE_TOOL_MODE,
    OUTLINE_CREATE_PATCH,
    OUTLINE_ADD_NODE,
    OUTLINE_DELETE_NODE,
    OUTLINE_MOVE_NODE,
    // TESSELATION TOOL
    TESSELATION_CHANGE_TOOL_MODE,
    MESH_MOVE_NODE
} from "../actions/actionTypes";

import testState from "./testState.json";

// SO says this is a good way to get a deep copy
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

export const reducer = (state = testState, action) => {
    console.log("action: ", action);
    let nextState = deepCopy(state);
    const { type, payload } = deepCopy(action);

    switch (type) {
        case SET_SELECTION: {
            const { id } = payload;
            nextState.selection = id;
            break;
        }
        case SET_RASTER: {
            const { rasterBase64, width, height } = payload;
            nextState.raster = { rasterBase64, width, height };
            break;
        }
        /* TOOLS */
        case CHANGE_TOOL: {
            const { tool } = payload;
            nextState.currentTool = { tool };
            break;
        }
        // OUTLINE TOOL
        case OUTLINE_CHANGE_TOOL_MODE: {
            const { mode } = payload;
            nextState.currentTool.mode = mode;
            break;
        }
        case OUTLINE_CREATE_PATCH: {
            const { patchId } = payload;
            nextState.patches[patchId] = {
                outline: { nodes: {} },
                mesh: { nodes: {}, polygons: {} }
            };
            break;
        }
        case OUTLINE_ADD_NODE: {
            const { patchId, nodeId, point } = payload;
            nextState.patches[patchId].outline.nodes[nodeId] = { point };
            break;
        }
        case OUTLINE_DELETE_NODE: {
            const { patchId, nodeId } = payload;
            delete nextState.patches[patchId].outline.nodes[nodeId];
            break;
        }
        case OUTLINE_MOVE_NODE: {
            const { patchId, nodeId, newPoint } = payload;
            nextState.patches[patchId].outline.nodes[nodeId].point = newPoint;
            break;
        }
        // TESSELATION TOOL
        case TESSELATION_CHANGE_TOOL_MODE: {
            const { mode } = payload;
            nextState.currentTool.mode = mode;
            break;
        }
        case MESH_MOVE_NODE: {
            const { patchId, nodeId, newPoint } = payload;
            nextState.patches[patchId].mesh.nodes[nodeId].point = newPoint;
            break;
        }
        default:
            nextState = state;
    }
    console.log("state: ", nextState);
    return nextState;
};
