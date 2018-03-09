import { CHANGE_TOOL } from "./actionTypes";

export const changeToolAction = (toolName) => ({
    type: CHANGE_TOOL,
    payload: { toolName }
});
