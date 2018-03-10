import {
    SET_SELECTION,
    SET_RASTER,
    CHANGE_TOOL,
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

export const deleteOutlineNodeAction = (patchId, nodeId) => ({
    type: DELETE_OUTLINE_NODE,
    payload: { patchId, nodeId }
});

export const moveOutlineNodeAction = (patchId, nodeId, newPoint) => ({
    type: MOVE_OUTLINE_NODE,
    payload: { patchId, nodeId, newPoint }
});
