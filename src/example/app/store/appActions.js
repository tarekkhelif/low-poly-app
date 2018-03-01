export const SET_TESSELATION = "SET_TESSELATION";

export function setTesselationDataAction(tesselationData) {
    return { type: SET_TESSELATION, payload: { tesselationData } };
}
