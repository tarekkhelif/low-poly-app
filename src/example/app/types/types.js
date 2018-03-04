import type { Point } from "../../editTesselation/types/types";

// Need to implement a generic type for IDs
export type ID = string;

export type NodeProps = {
    className: string,
    deleteNode?: (id: ID) => Object,
    moveNode?: (id: ID, dx: number, dy: number) => Object
};
