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
        return this.choices.some(choice => group.getMemberNames().includes(choice));
    }
}

// Export the Student class
export default Student;
