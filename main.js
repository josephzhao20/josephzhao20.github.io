import Student from './student.js';
import Group from './group.js';

// Read student data from the CSV file
const csv_file = "testList.csv";
const students_data = {}; // Your code to read the CSV file goes here

// Create Student objects
const students = Object.entries(students_data).map(([name, choices]) => new Student(name, choices));

// Calculate the total number of students
const total_students = students.length;

// Calculate the number of groups needed
const num_groups = Math.floor(total_students / 5);
const remaining_students = total_students % 5;

// Your code for group creation and matching goes here
