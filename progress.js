/* 
    TODO: Validate `.csv` data before plotting/displaying
          - Currently I'm assuming all data is in the positive quadrant, ie 
            I'm displaying x: (0, x_max) and y: (0, y_max)
*/

console.log("starting draw-path.js");

var numberOfDataSets = 0;
var sites;
var bbox;
var voronoi = new Voronoi();

function onDocumentDrag(event) {
	event.preventDefault();
}

function onDocumentDrop(e) {
    event.preventDefault();

    var f = event.dataTransfer.files[0];
    
    // Get reference
    var table = document.getElementById('table');
        
    // PapaParse
    Papa.parse(f, {
        dynamicTyping: true, // Recognize as numbers
        skipEmptyLines: true, // My `.csv` files end in an empty line, which screws some things up

        error: function (err, file) {
            console.log("ERROR:", err, file);
        },

        complete: function (results) {
            numberOfDataSets++;
            
            // Turn data into array of paperjs `Points`
            var points = [];
            results.data.forEach(function (row) {
                points.push(new Point(row))
            })

            // Find x_max and y_max
            function slice2D(col, arr) {
                return arr.map(function (row) {return row[col];});
            }
            var xs = slice2D(0, results.data);
            var ys = slice2D(1, results.data);
            var x_max = Math.max.apply(null, xs);
            var y_max = Math.max.apply(null, ys);
            
            // Resize canvas to fit data
            view.viewSize.width  = Math.max(x_max, view.viewSize.width);
            view.viewSize.height = Math.max(y_max, view.viewSize.height);
            view.center = new Point(view.size.width / 2, view.size.height / 2);

            bbox = {
                xl: 0,
                xr: view.bounds.width,
                yt: 0,
                yb: view.bounds.height
            };
            
            // Plot first data set as path
            if (numberOfDataSets !== 1) {
                var outline = new Path({
                    segments: points,
                    strokeColor: 'black',
                    //fillColor: 'blue',
                    strokeWidth: 3
                });
                var box = Path.Rectangle(outline.bounds);
                console.log(box);
                var cover = box.subtract(outline);
                cover.fillColor = 'yellow';
            }
            else {
                sites = points;
                renderDiagram();
            }

            points.forEach(function (point) {
                // Display data as table
                var tr = document.createElement('tr');
                var tdx = document.createElement('td');
                var tdy = document.createElement('td');
                tdx.innerText = Math.round(point.x);
                tdy.innerText = Math.round(point.y);
                tr.appendChild(tdx);
                tr.appendChild(tdy);
                table.appendChild(tr);

                // Plot data in canvas
                new Path.Circle({
                    center: point,
                    radius: 4,
                    fillColor: (numberOfDataSets === 1) ? '#009900': '#FF0000',
                    opacity: 1
                });
            });
            
            // Actually update the canvas
            view.update();
        }
    });
}


function renderDiagram() {
    var diagram = voronoi.compute(sites, bbox);
    if (diagram) {
		for (var i = 0, l = sites.length; i < l; i++) {
			var cell = diagram.cells[sites[i].voronoiId];
			if (cell) {
				var halfedges = cell.halfedges,
					length = halfedges.length;
				if (length > 2) {
					var points = [];
					for (var j = 0; j < length; j++) {
						v = halfedges[j].getEndpoint();
						points.push(new Point(v));
					}
					createPath(points, sites[i]);
				}
			}
		}
	}
}

function createPath(points, center) {
	var path = new Path();
    path.fillColor = "#3df55f";
    path.strokeColor = 'black';
    path.closed = true;

	for (var i = 0, l = points.length; i < l; i++) {
		var point = points[i];
		var next = points[(i + 1) == points.length ? 0 : i + 1];
		var vector = (next - point) / 2;
		path.add({
			point: point + vector,
			handleIn: -vector,
			handleOut: vector
		});
	}
	return path;
}

document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);