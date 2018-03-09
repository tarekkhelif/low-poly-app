import { SET_RASTER, CHANGE_TOOL } from "./actionTypes";

export const setRasterAction = (raster) => ({
    type: SET_RASTER,
    payload: { raster }
});

export const changeToolAction = (toolName) => ({
    type: CHANGE_TOOL,
    payload: { toolName }
});
