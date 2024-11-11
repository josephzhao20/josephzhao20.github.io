from flask import Flask, request, render_template, send_file, jsonify
import pandas as pd
import os
import signal
import csv
import random

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'


class Student:
    def __init__(self, name, choices):
        self.name = name
        self.choices = choices
        self.group = None

    def assign_to_group(self, group):
        self.group = group

    def has_choice_in_group(self, group):
        return any(choice in group.get_member_names() for choice in self.choices)

    def __str__(self):
        return self.name


class Group:
    def __init__(self):
        self.members = []

    def add_member(self, student):
        self.members.append(student)

    def get_member_names(self):
        return [student.name for student in self.members]


def timeout_handler(signum, frame):
    raise TimeoutError("Sorting took too long.")


signal.signal(signal.SIGALRM, timeout_handler)


def run_sorting_algorithm(file_path, group_size):
    # Read student data from the uploaded CSV file
    students_data = {}
    with open(file_path, mode='r') as file:
        reader = csv.reader(file)
        headers = next(reader)  # Skip the header row
        for row in reader:
            student_name = row[0]
            choices = row[1:]
            students_data[student_name] = choices

    students = [Student(name, choices) for name, choices in students_data.items()]
    total_students = len(students)
    num_groups = total_students // group_size
    remaining_students = total_students % group_size

    match = False
    while not match:
        appearances = {student.name: 0 for student in students}
        for student in students:
            for choice in student.choices:
                if choice in appearances:
                    appearances[choice] += 1

        sorted_students = sorted(students, key=lambda student: appearances.get(student.name, 0))
        random.shuffle(sorted_students)

        groups = []
        clone = sorted_students[:]
        
        new_group = Group()
        new_group.add_member(clone[0])
        clone[0].assign_to_group(new_group)
        groups.append(new_group)
        del clone[0]

        while clone:
            added_to_group = False
            for group in groups:
                if clone[0].has_choice_in_group(group) and len(group.members) < group_size:
                    group.add_member(clone[0])
                    clone[0].assign_to_group(group)
                    added_to_group = True
                    del clone[0]
                    break

            if not added_to_group:
                if len(groups) < num_groups:
                    new_group = Group()
                    new_group.add_member(clone[0])
                    clone[0].assign_to_group(new_group)
                    groups.append(new_group)
                    del clone[0]
                else:
                    min_group = min(groups, key=lambda group: len(group.members))
                    if len(min_group.members) < group_size:
                        min_group.add_member(clone[0])
                        clone[0].assign_to_group(min_group)
                        del clone[0]

        students_without_preference = []
        for group in groups:
            for student in group.members:
                if not student.has_choice_in_group(group):
                    students_without_preference.append(student)

        if len(students_without_preference) == 0:
            match = True

    # Prepare data to write to the output CSV file
    sorted_groups = [["Group Number", "Student"]]
    for group_num, group in enumerate(groups, 1):
        for student in group.get_member_names():
            sorted_groups.append([group_num, student])

    # Output the sorted groups to a CSV file
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], 'sorted_groups.csv')
    with open(output_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(sorted_groups)

    return output_path


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/download-template')
def download_template():
    template_path = os.path.join(app.config['UPLOAD_FOLDER'], 'template.csv')
    return send_file(template_path, as_attachment=True)


@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        pd.read_csv(file_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200


@app.route('/process-csv', methods=['POST'])
def process_csv():
    try:
        group_size = int(request.form['group_size'])
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'your_uploaded_file.csv')
        
        signal.alarm(300)  # 5 minutes timeout

        output_path = run_sorting_algorithm(file_path, group_size)

        return send_file(output_path, as_attachment=True)

    except TimeoutError:
        return jsonify({"error": "The process timed out. Please try again."}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        signal.alarm(0)
