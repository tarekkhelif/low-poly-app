// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // Get references
    const button = document.getElementById('submit');
    const table = document.getElementById('table');
    const input = document.getElementById('input');

    // Read and display data
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        for (const f of input.files) { // File is in a 1-element list of files
            // PapaParse
            Papa.parse(f, {
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

                dynamicTyping: true // Recognize as numbers
            });
        }
    })
});