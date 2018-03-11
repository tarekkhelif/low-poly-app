import {
    SET_SELECTION,
    SET_RASTER,
    CHANGE_TOOL,
    CHANGE_OUTLINE_TOOL_MODE,
    ADD_OUTLINE_NODE,
    DELETE_OUTLINE_NODE,
    MOVE_OUTLINE_NODE
} from "./actionTypes";

export const setSelectionAction = (id) => ({
    type: SET_SELECTION,
    payload: { id }
});

export const setRasterAction = (rasterBase64, width, height) => ({
    type: SET_RASTER,
    payload: { rasterBase64, width, height }
});

export const changeToolAction = (tool) => ({
    type: CHANGE_TOOL,
    payload: { tool }
});

export const changeOutlineModeAction = (mode) => ({
    type: CHANGE_OUTLINE_TOOL_MODE,
    payload: { mode }
});

export const addOutlineNodeAction = (patchId, nodeId, point) => ({
    type: ADD_OUTLINE_NODE,
    payload: { patchId, nodeId, point }
});

export const deleteOutlineNodeAction = (patchId, nodeId) => ({
    type: DELETE_OUTLINE_NODE,
    payload: { patchId, nodeId }
});

export const moveOutlineNodeAction = (patchId, nodeId, newPoint) => ({
    type: MOVE_OUTLINE_NODE,
    payload: { patchId, nodeId, newPoint }
});
