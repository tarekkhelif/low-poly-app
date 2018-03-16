// @flow

import * as d3 from "d3";
import { paper } from "paper";

import { arrayEquals } from "../util/arrayTools";
import { getBBox } from "../util/geometry";

type CoordinatesType = number[][];

function voronoiBox(sites: CoordinatesType, outline: CoordinatesType) {
    const [[xmax, xmin], [ymax, ymin]] = getBBox(outline);
    const bbox = [[xmin, ymin], [xmax, ymax]]; // Convert BBox representation

    const voronoi = d3.voronoi();
    voronoi.extent(bbox);
    const diagram = voronoi(sites);
    const voronoiPolys = diagram.polygons();
    return voronoiPolys;
}

function trimToBoundingPolygon(
    polygons: CoordinatesType[],
    bound: CoordinatesType
): CoordinatesType[] {
    const trimmedPolygons = [];

    // Create canvas and associate it with `paper`
    const canvas = document.createElement("canvas");
    canvas.id = "canvasProject";
    paper.setup(canvas);
    // paper.view.viewSize = new paper.Size(width, height);

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

export class ColorAverager {
    constructor(rasterBase64, width, height) {
        this.rasterBase64 = rasterBase64;

        // Create canvas and associate it with `paper`
        const canvas = document.createElement("canvas");
        canvas.id = "canvasProject";
        paper.setup(canvas);
        paper.view.viewSize = new paper.Size(width, height);

        this.setRaster();
    }

    async setRaster() {
        const pjsRaster = new Promise((resolve, reject) => {
            const htmlRaster = new Image();
            htmlRaster.src = this.rasterBase64;
            const raster = new paper.Raster(htmlRaster);

            // Set dimensions of Paper.js raster
            const maxBox = new paper.Rectangle(paper.view.viewSize);
            raster.fitBounds(maxBox);

            raster.onLoad = () => resolve(raster);
            raster.onError = () =>
                reject(new Error("Paper.js failed to load the image"));
        });

        this.pjsRaster = pjsRaster;
    }

    // If it can't calculate a color, set `color = "none"` and log to console
    async getColor(polygon) {
        const pjsRaster = await this.pjsRaster;
        const pjsPolygon = new paper.Path(polygon);
        const color = pjsRaster.getAverageColor(pjsPolygon).toCSS();
        return color;
    }
}

// Create a Voronoi tesselation bounded by the outline the user traced
export function voronoiTesselation(
    sites: CoordinatesType,
    outline: CoordinatesType
) {
    // Voronoi tesselation filling the bounding box of the outline
    const rawVoronoiPolygons = voronoiBox(sites, outline);

    // Voronoi tesselation trimmed to be up to the outline
    const voronoiPolygons = trimToBoundingPolygon(rawVoronoiPolygons, outline);

    const mesh = { nodes: {}, polygons: {} };

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
        const polygonNodes = polygon.map((currPoint) => {
            // Find any matching pre-existing nodes
            const matches = Object.entries(mesh.nodes).filter(([, { point }]) =>
                arrayEquals(point, currPoint));

            // Find or create the ID for the unique node.
            // Add the node to `nodes` if the point is new.
            let nodeId;
            switch (matches.length) {
                case 0: {
                    // If node is new, add to dictionary
                    const randNum = Math.floor(Math.random() * 1e16);
                    nodeId = `bad-ID-${randNum.toString(16)}`;
                    mesh.nodes[nodeId] = { point: currPoint };
                    break;
                }
                case 1: {
                    // If there's one match, record the id
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

        // Add polygon to dictionary
        const randNum = Math.floor(Math.random() * 1e16);
        const polygonId = `bad-ID-${randNum.toString(16)}`;
        mesh.polygons[polygonId] = { nodeIds: polygonNodes, color: "none" };
    });

    return mesh;
}
