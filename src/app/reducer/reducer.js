import { SET_RASTER } from "../actions/actionTypes";

export const reducer = (state = {}, action) => {
    console.log(action);
    if (action.type === SET_RASTER) {
        const nextState = { ...state };
        nextState.raster = action.payload.raster;
        return nextState;
    }
    return state;
};
