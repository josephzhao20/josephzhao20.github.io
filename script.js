// Handle file upload and parse CSV data
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
        parseCSV(file);
    } else {
        alert("Please upload a valid CSV file.");
    }
});

function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = event.target.result;
        const studentsData = processCSVData(data);
        document.getElementById("groupSortingSection").style.display = "block";
        enableGroupSorting(studentsData);
    };
    reader.readAsText(file);
}

function processCSVData(csvContent) {
    const lines = csvContent.split("\n");
    const studentsData = [];
    
    lines.forEach((line, index) => {
        const columns = line.split(",");
        if (columns.length > 1) { // Skip empty lines
            const name = columns[0].trim();
            const preferences = columns.slice(1).map(item => item.trim());
            studentsData.push({ name, preferences });
        }
    });

    return studentsData;
}

function enableGroupSorting(studentsData) {
    const sortButton = document.getElementById("sortButton");
    sortButton.onclick = function() {
        sortStudentsIntoGroups(studentsData);
    };
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

    // Add the download CSV button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Sorted Groups as CSV";
    downloadButton.onclick = function() {
        downloadCSV(groups);
    };
    document.body.appendChild(downloadButton);
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

// Helper function to shuffle an array randomly
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
