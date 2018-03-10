import { SET_SELECTION, SET_RASTER, CHANGE_TOOL } from "./actionTypes";

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
