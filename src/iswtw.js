// Confirm that the "imports" are working
console.log(paper); // import paper as Paper from "paper";
console.log(Papa); // import Papa from "papaparse";
console.log(Voronoi); // import Voronoi from "voronoi";

paper.install(window);
window.onload = () => {
    paper.setup("canvas");
    const rect = new paper.Path.Rectangle([75, 75], [100, 100]);
    rect.strokeColor = "black";
    paper.view.onFrame = () => rect.rotate(3);
};
