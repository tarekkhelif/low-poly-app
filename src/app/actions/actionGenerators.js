import { SET_RASTER, CHANGE_TOOL } from "./actionTypes";

export const setRasterAction = (rasterBase64, width, height) => ({
    type: SET_RASTER,
    payload: { rasterBase64, width, height }
});

export const changeToolAction = (toolName) => ({
    type: CHANGE_TOOL,
    payload: { toolName }
});
