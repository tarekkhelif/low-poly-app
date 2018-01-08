//TODO: Validate `.csv` data before plotting/displaying


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

            // Plot data in canvas
            results.data.forEach(function (row, i) {
                var x = row[0];
                var y = 600 - row[1]; // Looks like it's necessary to invert y??
                new Path.Circle({
                    center: [x, y],
                    radius: 2,
                    fillColor: '#FF0000',
                    opacity: 1
                })
            })
                
            view.update();
        }
    })
}


document.addEventListener('drop', onDocumentDrop, false);
document.addEventListener('dragover', onDocumentDrag, false);
document.addEventListener('dragleave', onDocumentDrag, false);