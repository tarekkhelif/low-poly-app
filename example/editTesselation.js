// import d3 from "../node_modules/d3/dist/d3.js";
// import paper from "../node_modules/paper/dist/paper-core.js";
/* global d3: false, paper: false */

export function editTesselation() {
    const polygons = this.d3Project.d3Polygons;

    // Add some UI stuff to polygons
    // eslint-disable-next-line func-names
    polygons.call(d3.drag().on("drag", function (d) {
        if (d.translation === undefined) {
            d.translation = { x: 0, y: 0 };
        }

        d.translation.x += d3.event.dx;
        d.translation.y += d3.event.dy;

        d3
            .select(this)
            .attr(
                "transform",
                `translate(${d.translation.x}, ${d.translation.y})`
            );
        // d3
        //     .select(this)
        //     .attr("transform", `translate(${d3.event.dx}, ${d3.event.dy})`);
    }));
}
