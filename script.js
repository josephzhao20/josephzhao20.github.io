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

    // Enable the group sorting step
    enableGroupSorting(data);
}

// Function to enable the sorting button
function enableGroupSorting(data) {
    const sortButton = document.createElement("button");
    sortButton.textContent = "Sort into Groups";
    
    sortButton.onclick = function() {
        sortStudentsIntoGroups(data);
    };

    document.body.appendChild(sortButton);
}


// Group the students based on their preferences
function sortStudentsIntoGroups(studentsData) {
    const groups = [];
    const groupSize = 5;  // Max group size
    
    // Shuffle students to start with random order
    shuffleArray(studentsData);

    // Create groups
    while (studentsData.length > 0) {
        const group = [];
        const groupMembers = new Set();
        
        // Try to create a group with up to 5 students
        while (group.length < groupSize && studentsData.length > 0) {
            const student = studentsData.shift(); // Get the first student
            
            // Add student to group if they prefer at least one member of the current group
            if (group.length === 0 || student.preferences.some(pref => groupMembers.has(pref))) {
                group.push(student);
                groupMembers.add(student.name);
            } else {
                // If the student can't be added to this group, put them back in the list to try again later
                studentsData.push(student);
            }
        }

        // Add the group to the groups list
        groups.push(group);
    }

    // Show the groups on the page
    displayGroups(groups);
}

// Display the sorted groups on the page
function displayGroups(groups) {
    const groupContainer = document.createElement("div");
    groupContainer.innerHTML = "<h2>Sorted Groups:</h2>";

    groups.forEach((group, index) => {
        const groupDiv = document.createElement("div");
        groupDiv.innerHTML = `<h3>Group ${index + 1}:</h3>`;
        
        const groupList = document.createElement("ul");
        group.forEach(student => {
            const listItem = document.createElement("li");
            listItem.textContent = student.name;
            groupList.appendChild(listItem);
        });

        groupDiv.appendChild(groupList);
        groupContainer.appendChild(groupDiv);
    });

    document.body.appendChild(groupContainer);
}

// Helper function to shuffle an array randomly
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Generate and download a CSV file with the sorted groups
function downloadCSV(groups) {
    let csvContent = "Group,Student Name\n";

    // Add each group and its members to the CSV content
    groups.forEach((group, index) => {
        group.forEach(student => {
            csvContent += `"Group ${index + 1}",${student.name}\n`;
        });
    });

    // Create a downloadable link for the CSV
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", encodedUri);
    downloadLink.setAttribute("download", "sorted_groups.csv");

    // Append the link to the document and click it to trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
