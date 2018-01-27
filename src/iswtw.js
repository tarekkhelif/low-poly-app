/* TODO:
 *  - Make a node marker class
 *  - Make a Voronoi sites class
 */

/* global paper:false, Papa:false, Voronoi:false */
const Paper = paper;

// Confirm that the "imports" are working
/* eslint-disable no-console */
console.log(Paper); // import paper as Paper from "paper";
console.log(Papa); // import Papa from "papaparse";
console.log(Voronoi); // import Voronoi from "voronoi";
/* eslint-enable no-console */

// Modes
const mode = "outline";

// Create canvas and associate it with `Paper`
const canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);
Paper.setup(canvas);

// Create a raster
const raster = new Paper.Raster("../dev_data/nile.jpg");

// Wait for rater to load
raster.on("load", () => {
    // Scale raster
    const MAX_SIZE = new Paper.Size(600, 600);
    const maxBox = new Paper.Rectangle(MAX_SIZE);
    if (!maxBox.contains(raster.size)) {
        raster.fitBounds(maxBox);
    }

    // Set canvas/view same size as raster
    Paper.view.viewSize = raster.bounds.size;

    // Move the raster to the center of the Paper.view
    raster.position = Paper.view.center;

    // Add `averageDots` event listener
    // Paper.view.on("mousemove", averageDots);
});

let nextSegment = new Paper.Segment();
let nextMarker = new Paper.Path.Circle({
    center: nextSegment.point,
    radius: 5,
    strokeColor: "red",
    fillColor: "pink",
});

// Initialize outline
const outline = new Paper.Path({
    segments: [nextSegment],
    strokeColor: "red",
    selected: false,
});

// Click to add to outline
Paper.view.on({
    keypressC: doTheMagic,
    mousedown: addToOutline,
    mousemove: (e) => {
        nextSegment.point = e.point;
        nextMarker.position = nextSegment.point;
    },
});
function addToOutline(e) {
    // Replace the now-finalized point with fresh point
    const finalizedSegment = nextSegment;
    const finalizedMarker = nextMarker;
    nextSegment = new Paper.Segment(e.point);
    nextMarker = new Paper.Path.Circle({
        center: finalizedSegment.point,
        radius: 5,
        strokeColor: "red",
        fillColor: "pink",
    });
    outline.add(nextSegment);

    /* finalizedMarker.on({
        mousedown: () => {
            finalizedMarker.selected = !finalizedMarker.selected;
        },
        mousedrag: (event) => {
            if (finalizedMarker.selected) {
                finalizedSegment.point = finalizedSegment.point.add(event.delta);
                finalizedMarker.position = finalizedSegment.point;
            }
        },
        mouseenter: () => {
            if (finalizedSegment === outline.firstSegment) {
                finalizedMarker.fillColor = "orange";
            }
        },
        mouseleave: () => {
            if (finalizedSegment === outline.firstSegment) {
                finalizedMarker.fillColor = "pink";
            }
        },
    }); */
}

// Draw circle at mouse position filled with the
// average color of the raster under the circle
function averageDots(event) {
    const dot = new Paper.Path.Circle({
        center: event.point,
        radius: 15,
    });
    dot.fillColor = raster.getAverageColor(dot);
}

// Generate a random point within a path
function randInteriorPoint(path) {
    // assert area > 0
    const pointInBBox = Paper.Point.random()
        .multiply(path.bounds.size)
        .add(path.bounds.point);
    const pointInPath = path.contains(pointInBBox) ? pointInBBox : randInteriorPoint(path);
    return pointInPath;
}

let sites = [];
let siteMarkers = [];
function doTheMagic() {
    outline.closed = true;

    // Generate Voronoi sites
    for (let i = 1; i <= 50; i++) {
        sites = sites.concat([randInteriorPoint(outline)]);
    }

    // Draw Voronoi sites
    sites.forEach((site) => {
        const siteMarker = new Paper.Path.Circle({
            center: site,
            radius: 5,
            strokeColor: "green",
            fillColor: "#70cc70",
        });
        siteMarkers = siteMarkers.concat([siteMarker]);
    });
}
