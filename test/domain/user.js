class User {

    constructor() {
        this.id = 0;
        this.uid = null;
        this.firstName = null;
        this.lastName = null;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
}

export default User;
