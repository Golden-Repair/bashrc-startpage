
class OperatingSystem {
	constructor(fs, commandHandler) {
        this.fs = fs;
        this.commandHandler = commandHandler;
        this.user = undefined;
    }

    assignDE(de) {
        this.de = de;

    }

    getFileSystem() {
        return this.fs;
    }

    storeUser() {
        window.localStorage.setItem('user', JSON.stringify(user))
    }

    systemCall(command, args) {
        console.log('got command: ' +command)
        //TODO: determine if the command needs to be 
        //sent to the command handler or the file system
        return 0;

    }

}