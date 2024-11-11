class Student {
    constructor(name, choices) {
        this.name = name;
        this.choices = choices;
        this.group = null;
    }

    assignToGroup(group) {
        this.group = group;
    }

    hasChoiceInGroup(group) {
        return group.getMemberNames().some(name => this.choices.includes(name));
    }

    toString() {
        return this.name;
    }
}

class Group {
    constructor() {
        this.members = [];
    }

    addMember(student) {
        this.members.push(student);
    }

    getMemberNames() {
        return this.members.map(student => student.name);
    }
}

// Handle CSV file reading
document.getElementById('csv-file').addEventListener('change', handleFileUpload);
document.getElementById('process-button').addEventListener('click', processCSVData);

let students = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        parseCSV(content);
        
        // Show the submit button after the file is uploaded
        document.getElementById('process-button').style.display = 'inline-block'; // Show the button
    };
    reader.readAsText(file);
}


function parseCSV(content) {
    const lines = content.split('\n');
    const header = lines[0].split(',');
    students = [];
    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        const name = row[0].trim();
        const choices = row.slice(1).map(choice => choice.trim());
        students.push(new Student(name, choices));
    }
}

// Function to process CSV data and sort students into groups
function processCSVData(file) {
    console.log('Starting to process the uploaded file...');
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            console.log('File successfully loaded, parsing CSV...');
            const content = event.target.result;
            const parsedData = Papa.parse(content, { header: true });

            // Check for parsing errors
            if (parsedData.errors.length > 0) {
                throw new Error("CSV parsing error: " + parsedData.errors[0].message);
            }

            console.log('CSV Data:', parsedData.data);

            // Validate if preferences exist
            const students = parsedData.data;
            console.log('Validating student preferences...');
            for (let student of students) {
                if (!student.choices || student.choices.length === 0) {
                    console.warn(`Student ${student.name} has no preferences.`);
                }
            }

            // Set group size
            const numGroups = Math.ceil(students.length / 5);
            console.log(`Number of groups required: ${numGroups}`);
            
            let attempts = 0;
            let success = false;

            // Attempt sorting up to 10 times
            while (attempts < 10 && !success) {
                attempts++;
                console.log(`Attempt ${attempts}: Trying to sort students...`);

                let sortedStudents = sortStudents(students, numGroups);

                if (sortedStudents) {
                    success = true;
                    console.log('Sorting completed successfully!');
                } else {
                    console.log(`Attempt ${attempts}: Sorting failed, retrying...`);
                }
            }

            if (!success) {
                console.error('Failed to sort students after multiple attempts.');
                alert('Failed to sort students after multiple attempts.');
                return;
            }

            // Display sorted groups
            console.log('Displaying sorted groups...');
            displayGroups(sortedStudents);
        } catch (error) {
            console.error('Error during file processing:', error);
            alert('An error occurred during file processing.');
        }
    };
    
    reader.readAsText(file);
}

// Sort students into groups based on their preferences
function sortStudents(students, numGroups) {
    console.log('Starting sorting process...');
    let groups = [];
    let remainingStudents = [...students];

    // Calculate number of appearances for each student
    let appearances = {};
    students.forEach(student => {
        student.choices.forEach(choice => {
            if (!appearances[choice]) appearances[choice] = 0;
            appearances[choice]++;
        });
    });

    console.log('Sorted students based on appearances...');
    remainingStudents.sort((a, b) => {
        let aAppearances = a.choices.reduce((count, choice) => count + (appearances[choice] || 0), 0);
        let bAppearances = b.choices.reduce((count, choice) => count + (appearances[choice] || 0), 0);
        return aAppearances - bAppearances; // Least appearances first
    });

    // Create groups
    console.log('Allocating students to groups...');
    while (remainingStudents.length > 0) {
        let student = remainingStudents.shift();
        console.log(`Assigning student ${student.name} to a group...`);
        
        let addedToGroup = false;

        // Check if the student can be added to an existing group based on preferences
        for (let group of groups) {
            if (group.length < 5 && student.choices.some(choice => group.some(member => member.name === choice))) {
                group.push(student);
                addedToGroup = true;
                console.log(`Student ${student.name} added to group.`);
                break;
            }
        }

        // If not added to any group, create a new group
        if (!addedToGroup) {
            console.log(`No suitable group found for ${student.name}. Creating a new group.`);
            if (groups.length < numGroups) {
                groups.push([student]);
            } else {
                let minGroup = groups.reduce((min, group) => group.length < min.length ? group : min, groups[0]);
                minGroup.push(student);
            }
        }
    }

    console.log('Sorting completed. Returning groups...');
    return groups.every(group => group.length <= 5) ? groups : null;
}

// Function to display sorted groups on the webpage
function displayGroups(groups) {
    console.log('Displaying final groups...');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.innerHTML = `<h3>Group ${index + 1}</h3><ul></ul>`;
        
        group.forEach(student => {
            const li = document.createElement('li');
            li.textContent = student.name;
            groupDiv.querySelector('ul').appendChild(li);
        });

        resultDiv.appendChild(groupDiv);
    });

    console.log('Groups displayed successfully.');
}

// Event listener for file input
document.getElementById('csvFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log(`File selected: ${file.name}`);
        processCSVData(file);
    }
});


// Helper function to shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
