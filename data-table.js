//TODO: Validate `.csv` data before plotting/displaying

// Read and display data
document.addEventListener('drop', (e) => {
    e.preventDefault();

    // Get reference
    const table = document.getElementById('table');
    
    for (const f of event.dataTransfer.files) { // File is in a 1-element list of files
        // PapaParse
        Papa.parse(f, {
            dynamicTyping: true, // Recognize as numbers
	        skipEmptyLines: true, // My `.csv` files end in an empty line
            
            error: (err, file) => {
                console.log("ERROR:", err, file);
            },

            complete: (results) => {
                console.log("Done with all data");
                
                // Display data as table
                for (const row of results.data) {
                    const tr = document.createElement('tr');
                    for (const crd of row) {
                        const td = document.createElement('td');
                        td.innerText = Math.round(crd);
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                }

            },
        });
    }
})