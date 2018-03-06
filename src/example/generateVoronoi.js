// @flow

import * as d3 from "d3";
import { paper } from "paper";

import { arrayEquals } from "./util/arrayTools";
import { getBBox } from "./util/geometry";

import { ColorStringType, PointType, CoordinatesType, NodeIdType } from
    "./types/types.js";

import { SEED, OUTLINE, MESH_NODE, addPolygonAction, addNodesAction } from
    "./store/actions.js";

function voronoiBox(sitesData, bound) {
    const [[xmax, xmin], [ymax, ymin]] = getBBox(bound);
    const bbox = [[xmin, ymin], [xmax, ymax]]; // Convert BBox representation

    const voronoi = d3.voronoi();
    voronoi.extent(bbox);
    const diagram = voronoi(sitesData);
    const voronoiPolys = diagram.polygons();
    return voronoiPolys;
    // return d3
    //     .voronoi()
    //     .extent(bbox)(sitesData)
    //     .polygons();
}

function trimToBoundingPolygon(
    polygons: CoordinatesType[],
    bound: CoordinatesType
): CoordinatesType[] {
    const trimmedPolygons = [];

    polygons.forEach((coordinates) => {
        const pjsPolygon = new paper.Path({
            segments: coordinates,
            closed: true
        });

        const pjsBound = new paper.Path({
            segments: bound,
            closed: true
        });

        // Keep parts of `pjsPolygon` that are within `pjsBound`
        const pjsTrimmedPolygon = pjsPolygon.intersect(pjsBound);

        // The part of the polygon we're keeping might be made up of
        //  disconnected pieces.  Now we make each of those pieces their own
        //  simple polygon.
        const pjsPolygonPieces = compoundToSimples(pjsTrimmedPolygon);
        function compoundToSimples(pjsPolygon) {
            let simplePolygons;
            if (pjsPolygon instanceof paper.Path) simplePolygons = [pjsPolygon];
            else if (pjsPolygon instanceof paper.CompoundPath) {
                simplePolygons = pjsPolygon.children;
            } else {
                const msg = "pjsPolygon must be a Path or CompoundPath";
                throw new Error(msg);
            }

            return simplePolygons;
        }

        // Add each piece to the list of polygons
        pjsPolygonPieces.forEach((polygon) => {
            const coordinates = polygon.segments.map(({ point: { x, y } }) => [
                x,
                y
            ]);
            trimmedPolygons.push(coordinates);
        });
    });

    return trimmedPolygons;
}

// If it can't calculate a color, set `color = "none"` and log to console
function averageColor(polygon: CoordinatesType, raster): ColorStringType {
    const pjsPolygon = new paper.Path(polygon);

    let color;
    try {
        color = raster.getAverageColor(pjsPolygon).toCSS();
    } catch (error) {
        color = "none";
        /* eslint-disable no-console */
        console.log("Couldn't get a color for this polygon. Seeting to none.");
        console.log("Error:", error);
        console.log("Polygon:", pjsPolygon);
        console.log("Color:", color);
        /* eslint-enable no-console */
    }
    return color;
}

// Create a Voronoi tesselation bounded by the outline the user traced
function voronoiTesselation(
    store,
    dispatch,
    addNodeAction,
    addPolygonAction,
    raster, // : A paperjs raster,
    sitesData: PointType[],
    outlineData: PointType[]
) {
    // Voronoi tesselation filling the bounding box of the outline
    const rawVoronoiPolygons = voronoiBox(sitesData, outlineData);

    // Voronoi tesselation trimmed to be up to the outline
    const voronoiPolygons = trimToBoundingPolygon(
        rawVoronoiPolygons,
        outlineData
    );

    /* Extract polygon and node data. Calculate color of each polygon.
       - Represent each point as an array ([x, y]).
       - Don't allow multiple arrays representing the same point.
       - Associate an ID with each (unique) point.  This is a _node_.
       - Put each node in a dictionary ([key=id, value=point]). This is `nodes`.
       - Represent the coordinates of each polygon as a list of node IDs.
       - The color is the average color of the raster under the polygon.
       - Give each polygon an id.
       - Put each polygon in a dictionary ([key=id, value=polygon]) this is
           `polygons` */
    voronoiPolygons.forEach((polygon) => {
        // Find or create a unique id for `currPoint`
        // Represent each polygon as a list of node ids.
        const polygonNodes: NodeIdType[] = polygon.map((currPoint) => {
            // Find any matching pre-existing nodes
            const matches = Object.entries(store.getState()[MESH_NODE])
                // $FlowFixMe
                .filter(([, { point }]) => arrayEquals(point, currPoint));

            // Find or create the ID for the unique node.
            // Add the node to `nodes` if the point is new.
            let nodeId: NodeIdType;
            switch (matches.length) {
                case 0: {
                    // If new, dispatch add action
                    const action = addNodeAction(currPoint);
                    nodeId = Object.keys(action.payload.nodes)[0];
                    dispatch(action);
                    break;
                }
                case 1: {
                    // If there's a match, record the id
                    [nodeId] = matches[0]; // [nodeId, { point }] = match[0]
                    break;
                }
                default: {
                    // If there are multiple matches, record the first
                    //   match's id and print all matches to console.
                    [nodeId] = matches[0]; // [nodeId, { point }] = match[0]

                    // eslint-disable-next-line no-console
                    console.log("There are several nodes at the same " +
                        `point. The point ${currPoint.toString()} ` +
                        `matched ${matches.length} existing nodes with ` +
                        `ids: ${matches.map(([id]) => id).join(", ")} `);
                }
            }

            return nodeId;
        });

        // Calculate the polygon's color
        const color = averageColor(polygon, raster);

        // Dispatch addPolygon action
        dispatch(addPolygonAction(polygonNodes, color));
    });
}

// Coerce to work like before
export function generateVoronoi() {
    const { store } = this;
    const state = store.getState();
    const raster = this.pjsProject.pjsRaster;
    // $FlowFixMe
    const sitesData = Object.values(state[SEED]).map(({ point }) => point);
    // $FlowFixMe
    const outlineData = Object.values(state[OUTLINE]).map(({ point }) => point);

    voronoiTesselation(
        store,
        store.dispatch,
        (...points) => addNodesAction(MESH_NODE, ...points),
        addPolygonAction,
        raster,
        sitesData,
        outlineData
    );
}
