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
} from "./actionTypes";

export const setSelectionAction = (id) => ({
    type: SET_SELECTION,
    payload: { id }
});

export const setRasterAction = (rasterBase64, width, height) => ({
    type: SET_RASTER,
    payload: { rasterBase64, width, height }
});

/* TOOLS */
// #region
export const changeToolAction = (tool) => ({
    type: CHANGE_TOOL,
    payload: { tool }
});

// OUTLINE TOOL
// #region
export const outlineChangeModeAction = (mode) => ({
    type: OUTLINE_CHANGE_TOOL_MODE,
    payload: { mode }
});

export const outlineCreatePatchAction = (patchId) => ({
    type: OUTLINE_CREATE_PATCH,
    payload: { patchId }
});

export const outlineAddNodeAction = (patchId, nodeId, point) => ({
    type: OUTLINE_ADD_NODE,
    payload: { patchId, nodeId, point }
});

export const outlineDeleteNodeAction = (patchId, nodeId) => ({
    type: OUTLINE_DELETE_NODE,
    payload: { patchId, nodeId }
});

export const outlineMoveNodeAction = (patchId, nodeId, newPoint) => ({
    type: OUTLINE_MOVE_NODE,
    payload: { patchId, nodeId, newPoint }
});
// #endregion

// TESSELATION TOOL
// #region
export const tesselationChangeModeAction = (mode) => ({
    type: TESSELATION_CHANGE_TOOL_MODE,
    payload: { mode }
});

export const meshMoveNodeAction = (patchId, nodeId, newPoint) => ({
    type: MESH_MOVE_NODE,
    payload: { patchId, nodeId, newPoint }
});
// #endregion

// #endregion
