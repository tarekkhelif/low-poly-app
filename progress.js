/* 
    TODO: Validate `.csv` data before plotting/displaying
          - Currently I'm assuming all data is in the positive quadrant, ie 
            I'm displaying x: (0, x_max) and y: (0, y_max)
*/

var numberOfDataSets = 0;
var firstYmax;


console.log("starting draw-path.js");

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

            // Display data as table
            results.data.forEach(function (row) {
                var tr = document.createElement('tr');
                row.forEach(function (crd) {
                    var td = document.createElement('td');
                    td.innerText = Math.round(crd);
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });

            
            // Find x_max and y_max
            function slice2D(col, arr) {
                return arr.map(function (row) {return row[col];});
            }
            var xs = slice2D(0, results.data);
            var ys = slice2D(1, results.data);
            var x_max = Math.max.apply(null, xs);
            var y_max = Math.max.apply(null, ys);
            if(!firstYmax) firstYmax = y_max; // Set the y-translation according to the first dataset

            // Plot data in canvas
            results.data.forEach(function (row) {
                var x = row[0];
                var y = firstYmax - row[1]; // Looks like it's necessary to invert y??
                new Path.Circle({
                    center: [x, y],
                    radius: 2,
                    fillColor: '#FF0000',
                    opacity: 1
                });
            });
            
            // Resize canvas to fit data
            view.viewSize.width  = Math.max(x_max, view.viewSize.width);
            view.viewSize.height = Math.max(y_max, view.viewSize.height);
            view.center = new Point(view.size.width / 2, view.size.height / 2);
            
            // Actually update the canvas
            view.update();
        }
    });
}


document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);