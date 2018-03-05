export type ColorStringType = string;

export type NodeGroupType = string;

// Need to implement a generic type for IDs
export type IDType = string;
export type NodeIdType = IDType;
export type EdgeIdType = IDType;
export type PolygonIdType = IDType;

export type PointType = number[];
export type CoordinatesType = PointType[];
export type NodeType = { point: PointType };
export type PolygonType = { nodes: NodeIdType[], color: ColorStringType };
