// Handle CSV file upload and parsing
document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form from refreshing the page

    // Get the uploaded file
    const fileInput = document.getElementById("csv-file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a CSV file.");
        return;
    }

    // Read the file using FileReader
    const reader = new FileReader();

    reader.onload = function(e) {
        // Parse the CSV content
        const text = e.target.result;
        const parsedData = parseCSV(text);

        // Process the CSV data
        processCSVData(parsedData);
    };

    reader.readAsText(file); // Read the file as text
});

// Parse CSV into an array of student objects
function parseCSV(csvText) {
    const rows = csvText.split("\n").map(row => row.trim()).filter(row => row);
    const parsedData = [];

    rows.forEach((row, index) => {
        const columns = row.split(",").map(col => col.trim());
        
        // Skip the first row if it's the header
        if (index === 0) return;

        const studentName = columns[0];
        const preferences = columns.slice(1);  // The rest are preferences
        parsedData.push({ name: studentName, preferences: preferences });
    });

    return parsedData;
}

// Display the parsed CSV data on the page (for verification)
function processCSVData(data) {
    console.log(data);  // Print data to the console (for debugging)
    
    // Optionally, show the parsed data on the page
    const displayArea = document.createElement("div");
    displayArea.innerHTML = "<h2>Parsed Data:</h2>";

    const list = document.createElement("ul");
    data.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} prefers: ${item.preferences.join(", ")}`;
        list.appendChild(listItem);
    });

    displayArea.appendChild(list);
    document.body.appendChild(displayArea);

    // Enable the group sorting step (you can modify this later)
    enableGroupSorting(data);
}
