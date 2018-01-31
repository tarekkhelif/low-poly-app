// import SVG from "svg.js";
/* global SVG: false */

// Use svg.js within the element with id `#drawing`
const drawing = SVG("drawing").size(300, 300);

// Set up empty outline
const outline = drawing
    .polyline()
    /* TODO: Style with CSS */
    .stroke("green")
    .fill("#00000000");

// Install handler for starting the outline
drawing.on("mousedown", doStartOutlining);

// Handler for starting the outline
function doStartOutlining(e) {
    // Initialize outline with first point
    const point = [e.offsetX, e.offsetY];
    addToOutline(outline, [], point);

    // Replace handler
    drawing.off("mousedown", doStartOutlining);
    drawing.on("mousedown", doAddClickToOutline);
}

// Handler for adding to the outline
function doAddClickToOutline(e) {
    /* TODO: Implement a class for outline nodes, and check if the event
     * target matches that, rather than `"circle"`
     */
    // Don't add if an existing node was clicked
    if (e.target.nodeName !== "circle") {
        const point = [e.offsetX, e.offsetY];
        const existingPoints = outline.array().value;

        addToOutline(outline, existingPoints, point);
    }
}

/* TODO: Use Flow to indicate `existingPoints` should be an `Array`
 * TODO: Make an `Outline` class that contains this as a method.
 * For now, I'm passing `thisOutline` as the first argument to the function,
 * because that immitates what would happen if there were an `Outline` class.
 */
function addToOutline(thisOutline, existingPoints, newPoint) {
    const marker = drawing
        .circle()
        .radius(5)
        .center(...newPoint)
        .addClass("outlineNode");

    marker.on("mousedown", toToggleSelected);

    outline.plot(existingPoints.concat([newPoint]));
}

function toToggleSelected(e) {
    e.target.classList.toggle("selected");
}

/* class outlineNode extends SVG.Circle {
    constructor(diameter) {
        super(diameter);
        this.on("mousedown", toggleSelected);
    }
} */
