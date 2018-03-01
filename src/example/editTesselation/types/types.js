// @flux

export type ColorString = string;

export type NodeId = string;
export type EdgeId = string;
export type PolygonId = string;

export type Point = number[];
export type Coordinates = Point[];
export type Node = { point: Point };
export type Polygon = { nodes: NodeId[], color: ColorString };

export type ReduxTesselation = {
    nodes: Object,
    polygons: Object
};

// #toDelete
type OldNode = Point;
type OldEdge = OldNode[];
type OldCoordinates = OldNode[];
type OldPolygon = {
    coordinates: OldCoordinates[],
    edges: OldEdge[],
    color: ColorString
};
export type OldTesselation = {
    polygons: OldPolygon[],
    edges: OldEdge[],
    nodes: OldNode[]
};
// #endToDelete
