class Group {
    constructor() {
        this.members = [];
    }

    addMember(student) {
        this.members.push(student);
    }

    getMemberNames() {
        return this.members.map(member => member.name);
    }
}

// Export the Group class
export default Group;
