Programs = Object.freeze({ "terminal": 1 });
ResultTypes = Object.freeze({ "success": 0, "directory": 1, "link": 2, "error": 3 });


class OperatingSystem {
    constructor(fs, commandHandler) {
        this.name = window.navigator.oscpu;
        this.kernel = 'bashrc v 0.1';
        this.fs = fs;
        this.commandHandler = commandHandler;
        this.user = undefined;
        this.programs = {};
        this.programId = 0;
    }

    getKernel() {
        return this.kernel;
    }

    getName() {
        return this.name;
    }

    getUser() {
        return this.user;
    }

    getDe() {
        return this.de;
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

    buildMessage(strings) {
        var result = "";
        strings.forEach(str => {
            result = result.concat(str + '\n');
        });
        return result;
    }

    systemCall(wd, command, args) {
        console.log('got command: ' + command)
        /*
        -1: command not recognized
        0: OS command, handle it directly on os level
        1: FS command, forward to FS
        2: bash command, handle in terminal
        */
        var result = this.commandHandler.handle(wd, command, args);
        console.log(result);
        switch (result) {
            case -1:
                return new ResponseObject(ResultTypes.error, 'command not recognized')
            case 0:
                return this.handleCommand(wd, command, args);
            case 1:
                return new ResponseObject(ResultTypes.error, 'command not recognized')
            case 2:
                return new ResponseObject(ResultTypes.error, 'command not recognized')

            default:
                return new ResponseObject(ResultTypes.error, 'command not recognized')
        }
    }

    handleCommand(wd, command, args) {
        this.getAvailableCommands().forEach(element => {
            if (element == command) {
                command = this[element];
            }
        });
        return command(this, wd, args);

    }

    getAvailableCommands() {
        var propertyNames = Object.getOwnPropertyNames(OperatingSystem.prototype);

        return propertyNames;
    }

    launchProgram(programType) {
        var program;
        switch (programType) {
            case Programs.terminal:
                program = new Terminal(this.programId++, this);
                break;
        }
        if (!program) {
            console.log('could not launch program');
            return 0;
        }
        this.de.addProgram(program);
        program.init();

    }

    useradd(wd, args) {
        if (!args[0]) {
            printMessage('Please specify username', 'green')
            return
        }
        user = args[0]
        this.storeConfigToLocalStorage()
    }

    pageDesc() {
        printMessage("This startpage is intended to look & act like a unix terminal.", "green")
        printMessage("You can create and manage directories and files - dorectories " +
            "act as bookmark folders and files as bookmark links", "green")
        printMessage("The most common unix commands such as [cd|touch|mkdir|rm|rmdir] are supported!", "green")
        printMessage("Try typing 'commands' for a list of commands or 'man [command]' for help " +
            "with a specific command", "green")
        printMessage("You can autocomplete directories with the 'tab' key! I will add autocomplete " +
            "for files soon.", "green")
    }


    man(os, wd, args) {
        if (!args[0]) {
            return new ResponseObject(ResultTypes.error, ["man: missing operand"]);
        }
        for (let cmd of os.commandHandler.getAllCommands()) {
            console.log(cmd.getName())
            if (cmd.getName() == args[0]) {
                console.log('found command')
                return new ResponseObject(ResultTypes.success, [
                    "command: " + cmd.getName(),
                    "description: " + cmd.getHelp(),
                    "usage: " + cmd.getUsage()]
                );
            }
        }
        return new ResponseObject(ResultTypes.error, ["command not found: " + args[0]]);
    }

    commands(os, wd, args) {
        var strings = [];
        for (let cmd of os.commandHandler.getAllCommands()) {
            strings.push(cmd.getName());
        }
        return new ResponseObject(ResultTypes.success, strings);
    }

    time() {
        var date = new Date()
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]

        printMessage("Today is the " + date.getDate() + "th of " + months[date.getMonth()] + " - The time is " +
            date.getHours() + " | " + date.getMinutes() + " | " + date.getSeconds() + ".", "green")
    }




}

