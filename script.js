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

function processCSVData() {
    if (students.length === 0) {
        alert("Please upload a valid CSV file.");
        return;
    }

    showStatus("Sorting students...");

    // Sorting logic
    let match = false;
    let attempts = 0;
    const totalStudents = students.length;
    const numGroups = Math.ceil(totalStudents / 5);
    const remainingStudents = totalStudents % 5;
    
    while (!match && attempts < 10) {
        attempts++;
        
        let appearances = students.reduce((acc, student) => {
            student.choices.forEach(choice => {
                acc[choice] = (acc[choice] || 0) + 1;
            });
            return acc;
        }, {});
        
        students.sort((a, b) => (appearances[a.name] || 0) - (appearances[b.name] || 0));
        students = shuffleArray(students);

        let groups = [];
        let remainingStudentsList = [...students];
        
        let newGroup = new Group();
        newGroup.addMember(remainingStudentsList[0]);
        remainingStudentsList[0].assignToGroup(newGroup);
        groups.push(newGroup);
        remainingStudentsList.shift();

        while (remainingStudentsList.length) {
            let student = remainingStudentsList[0];
            let addedToGroup = false;

            for (let group of groups) {
                if (student.hasChoiceInGroup(group) && group.members.length < 5) {
                    group.addMember(student);
                    student.assignToGroup(group);
                    remainingStudentsList.shift();
                    addedToGroup = true;
                    break;
                }
            }

            if (!addedToGroup) {
                if (groups.length < numGroups) {
                    let newGroup = new Group();
                    newGroup.addMember(student);
                    student.assignToGroup(newGroup);
                    groups.push(newGroup);
                    remainingStudentsList.shift();
                } else {
                    let minGroup = groups.reduce((min, group) => group.members.length < min.members.length ? group : min, groups[0]);
                    if (minGroup.members.length < 5) {
                        minGroup.addMember(student);
                        student.assignToGroup(minGroup);
                        remainingStudentsList.shift();
                    }
                }
            }
        }

        let studentsWithoutPreference = [];
        groups.forEach(group => {
            group.members.forEach(student => {
                if (!student.hasChoiceInGroup(group)) {
                    studentsWithoutPreference.push(student);
                }
            });
        });

        if (studentsWithoutPreference.length === 0) {
            match = true;
        }
    }

    if (match) {
        showStatus("Sorting complete.");
        displayGroups(groups);
    } else {
        showStatus("Failed to sort students after multiple attempts.");
    }
}

function displayGroups(groups) {
    const tableBody = document.getElementById('group-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear previous groups

    groups.forEach((group, index) => {
        const row = document.createElement('tr');
        const groupCell = document.createElement('td');
        groupCell.textContent = `Group ${index + 1}`;
        const membersCell = document.createElement('td');
        membersCell.textContent = group.getMemberNames().join(", ");
        row.appendChild(groupCell);
        row.appendChild(membersCell);
        tableBody.appendChild(row);
    });

    document.getElementById('group-container').style.display = 'block';
}

function showStatus(message) {
    document.getElementById('status').textContent = message;
}

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
