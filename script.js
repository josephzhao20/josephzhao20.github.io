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
    constructor(id) {
        this.id = id;
        this.members = [];
    }

    addMember(student) {
        this.members.push(student);
    }

    getMemberNames() {
        return this.members.map(student => student.name);
    }

    getSize() {
        return this.members.length;
    }

    isFull() {
        return this.members.length >= 5;
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
function processCSVData() {
    console.log('Starting to process the uploaded file...');
    
    const numGroups = Math.ceil(students.length / 5);
    console.log(`Number of groups required: ${numGroups}`);

    let attempts = 0;
    let success = false;
    let sortedStudents = [];

    // Attempt sorting up to 10 times
    while (attempts < 10 && !success) {
        attempts++;
        console.log(`Attempt ${attempts}: Trying to sort students...`);
        
        sortedStudents = sortStudents(students, numGroups);

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
}

// Sort students into groups based on their preferences
function sortStudents(students, numGroups) {
    console.log('Starting sorting process...');
    let groups = [];
    let remainingStudents = [...students];

    // Create groups with available spots
    for (let i = 0; i < numGroups; i++) {
        groups.push(new Group(i + 1)); // Create new group with id starting from 1
    }

    // Sort students based on number of appearances in others' choices (least appearances first)
    let appearances = {};
    students.forEach(student => {
        student.choices.forEach(choice => {
            if (!appearances[choice]) appearances[choice] = 0;
            appearances[choice]++;
        });
    });

    remainingStudents.sort((a, b) => {
        let aAppearances = a.choices.reduce((count, choice) => count + (appearances[choice] || 0), 0);
        let bAppearances = b.choices.reduce((count, choice) => count + (appearances[choice] || 0), 0);
        return aAppearances - bAppearances; // Least appearances first
    });

    console.log('Sorted students by preference appearance...');

    // Assign students to groups
    while (remainingStudents.length > 0) {
        let student = remainingStudents.shift();
        console.log(`Assigning student ${student.name} to a group...`);

        let addedToGroup = false;

        // Try to assign the student to an existing group based on preferences
        for (let group of groups) {
            if (!group.isFull() && student.hasChoiceInGroup(group)) {
                group.addMember(student);
                addedToGroup = true;
                console.log(`Student ${student.name} added to Group ${group.id}.`);
                break;
            }
        }

        // If no suitable group, create a new group or add to the least full group
        if (!addedToGroup) {
            let minGroup = groups.reduce((min, group) => (group.getSize() < min.getSize() ? group : min), groups[0]);
            minGroup.addMember(student);
            console.log(`No suitable group found for ${student.name}, adding to Group ${minGroup.id}.`);
        }
    }

    console.log('Groups sorted successfully.');
    return groups;
}

// Function to display sorted groups on the webpage
function displayGroups(groups) {
    console.log('Displaying final groups...');
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    groups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';
        groupDiv.innerHTML = `<h3>Group ${group.id}</h3><ul></ul>`;
        
        group.members.forEach(student => {
            const li = document.createElement('li');
            li.textContent = student.name;
            groupDiv.querySelector('ul').appendChild(li);
        });

        resultDiv.appendChild(groupDiv);
    });

    console.log('Groups displayed successfully.');
}
