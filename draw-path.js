console.log("starting draw-path.js");

function onDocumentDrag(event) {
	event.preventDefault();
}

function onDocumentDrop(e) {
    event.preventDefault();

    var f = event.dataTransfer.files[0];
        
    // PapaParse
    Papa.parse(f, {
        error: function (err, file) {
            console.log("ERROR:", err, file);
        },

        complete: function (results) {
            console.log("Plotting CSV data");

            // Display data in canvas
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