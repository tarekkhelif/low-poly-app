import { SET_RASTER } from "../actions/actionTypes";

const defaultState = {
    raster: {
        rasterBase64: "",
        width: 0,
        height: 0
    }
};

export const reducer = (state = defaultState, action) => {
    console.log(action);
    if (action.type === SET_RASTER) {
        const nextState = { ...state };
        const { rasterBase64, width, height } = action.payload;
        nextState.raster = { rasterBase64, width, height };
        return nextState;
    }
    return state;
};
