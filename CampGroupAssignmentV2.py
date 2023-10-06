"""
Created on Sat May 28 21:

19:53 2022

@author: Joseph Zhao
#Program Description: Create a number of groups based on preferences

"""
import random
import csv

class Student:
    def __init__(self, name, choices):
        self.name = name
        self.choices = choices
        self.group = None

    def assign_to_group(self, group):
        """
        Assign the student to a group.
        """
        self.group = group

    def has_choice_in_group(self, group):
        """
        Check if the student has at least one choice in the given group.
        """
        return any(choice in group.get_member_names() for choice in self.choices)

    def __str__(self):
        return self.name

class Group:
    def __init__(self):
        self.members = []

    def add_member(self, student):
        """
        Add a student to the group.
        """
        self.members.append(student)

    def get_member_names(self):
        """
        Get the names of all members in the group.
        """
        return [student.name for student in self.members]


# Read student data from the CSV file, skipping the first row (headers)
# Define the file name
csv_file = "testList.csv"

# Read student data from CSV file
students_data = {}
with open(csv_file, mode='r') as file:
    reader = csv.reader(file)
    headers = next(reader)  # Skip the header row
    for row in reader:
        student_name = row[0]
        choices = row[1:]
        students_data[student_name] = choices

# Create Student objects
students = [Student(name, choices) for name, choices in students_data.items()]

# Calculate the total number of students
total_students = len(students)

# Calculate the number of groups needed
num_groups = total_students / 5
remaining_students = total_students % 5


# Now you can work with the Student and Group objects to assign students to groups and check the requirements.
match = False
# for i in range(10):

while not match:
#---------------------------------------------------------------------------------------------------------------------
    # Sort by number of appearances least to greatest
    # Calculate the number of times each student appears in someone else's preferences
    appearances = {student.name: 0 for student in students}
    for student in students:
        for choice in student.choices:
            if choice in appearances:
                appearances[choice] += 1

    # Sort students based on the number of appearances
    sorted_students = sorted(students, key=lambda student: appearances.get(student.name, 0))

    random.shuffle(sorted_students)
    # Now, sorted_students contains the students sorted by the number of appearances in other students' preferences,
    # from the least to the most appearances.


    # Create an empty list to store the groups
    groups = []

    # make a cloned version of student list
    clone = []
    for i in sorted_students:
        clone.append(i)
    
    
    # Add the first student in the list to the first group by default
    new_group = Group()
    new_group.add_member(clone[0])
    clone[0].assign_to_group(new_group)
    groups.append(new_group)
    del clone[0]

    # Iterate through the sorted student list
    while clone:

        # Flag to track if the student has been added to any group
        added_to_group = False
        
        # Check if the student has a preference in any of the existing groups
        for group in groups:
            if clone[0].has_choice_in_group(group):
                # Check if the group has less than 5 members
                if len(group.members) < 5:
                    # Add the student to the group
                    group.add_member(clone[0])
                    clone[0].assign_to_group(group)
                    added_to_group = True
                    del clone[0]
                    break

        
        # If the student hasn't been added to any group, create a new group if the maximum number of groups is not reached
        if not added_to_group:
            if len(groups) < num_groups:
                new_group = Group()
                new_group.add_member(clone[0])
                clone[0].assign_to_group(new_group)
                groups.append(new_group)
                del clone[0]
            # ...
            else:
                # If the maximum number of groups is reached, find the group with the least number of students
                min_group = min(groups, key=lambda group: len(group.members))
                
                # Check if the group has less than 5 members
                if len(min_group.members) < 5:
                    min_group.add_member(clone[0])
                    clone[0].assign_to_group(min_group)
                    del clone[0]


                # If the maximum number of groups is reached, add the student to the end of the sorted_students list
                # clone.append(student)
        
        

    # # Print students without a group
    # students_without_group = [student for student in students if student.group is None]
    # print("Students without a group:")
    # for student in students_without_group:
    #     print(student.name)

    # # Now, the students are assigned to groups based on their preferences, and each group has a maximum of 5 members.


    # Debugging/Verification

    # print("")
    # print("Debugging:")


    # After assigning students to groups, outside of the grouping loop
    # Create a list to store students who don't belong to any group
    students_without_group = []

    # Loop through the students and check if they have a group
    for student in students:
        if student.group is None:
            students_without_group.append(student)

    # Print students without a group
    # print("Students without a group:")
    # for student in students_without_group:
    #     print(student.name)


    # Create a list to store students who don't have a preferred student in the same group
    students_without_preference = []

    # Iterate through the groups and check each student
    for group in groups:
        for student in group.members:
            # Check if the student has at least one choice in the same group
            if not student.has_choice_in_group(group):
                students_without_preference.append(student)

    # Print students without a preference in the same group
    # print("\nStudents without a preferred student in the same group:")
    # for student in students_without_preference:
    #     print(student.name)

    # print("")
    # print("Final Groups:")

    # for i in groups:
    #     names = i.get_member_names()
    #     print(names)

    if len(students_without_preference) == 0:
        match = True

    # Now, the students are assigned to groups based on their preferences, and each group has a maximum of 5 members.
    # Students without a preferred student in the same group are also printed.

    if match:
        print("")
        print("Final Groups:")

        for i in groups:
            names = i.get_member_names()
            print(names)


#--------------------------------------------------------------------------------------------------------------------