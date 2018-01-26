const Paper = paper;

// Confirm that the "imports" are working
console.log(Paper); // import paper as Paper from "paper";
console.log(Papa); // import Papa from "papaparse";
console.log(Voronoi); // import Voronoi from "voronoi";

// Create canvas and associate it with `Paper`
const canvas = document.createElement("canvas");
canvas.id = "canvas";
document.body.appendChild(canvas);
Paper.setup(canvas);

// Create a raster item using the image tag with id='mona'
const raster = new Paper.Raster("mona.jpg");

// Make canvas/view same size as raster
Paper.view.viewSize = raster.size;

// Move the raster to the center of the Paper.view
raster.position = Paper.view.center;

// Draw circle at mouse position filled with the
// average color of the raster under the circle
raster.onMouseMove = (event) => {
    const region = new Paper.Path.Circle({
        center: event.point,
        radius: 15,
    });
    region.fillColor = raster.getAverageColor(region);
};
