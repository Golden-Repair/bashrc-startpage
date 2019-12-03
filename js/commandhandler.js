
function Command(name, description, usage) {
	var self = {}
	self.name = name
	self.description = description
	self.usage = usage

	self.getName = function () {
		return this.name
	}

	self.getHelp = function () {
		return this.description
	}

	self.getUsage = function () {
		return this.usage
	}

	return self
}

class CommandHandler {
	constructor() {

        this.allCommands = [
			Command("locate", "search anythin on the internet", "locate [query]"),
			Command("pwd", "Print working directory", 'pwd'),
			Command("ls", "List contents of working directory", "ls"),
			Command("cd", "change directory", "cd [..| |path]"),
			Command("mkdir", "create new directory", "mkdir [path]"),
			Command("rmdir", "remove directory", "rm dir [path]"),
			Command("touch", "crate new file (link)", "touch [patch]"),
			Command("rm", "remove file (link)", "rm [path]"),
			Command("clear", "clear output", "clear"),
			Command("echo", "repeat something", "echo [phrase]"),
			Command("time", "get current date and time", "time"),
			Command("timer", "start and stop a timer", "timer [start|stop|reset|get]"),
			Command("todo", "manage todo list", "not done yet"), // todo lol
			Command("commands", "get list of commands", "commands"),
			Command("man", "get help for a command", "man [comand]"),
			Command("pageDesc", "description of the startpage", "pageDesc"),
			Command("flip", 'Flip that flippin table', "flip"),
			Command('useradd', 'Set your username for display :)'),
			Command('fetch', 'system information')
		];
    }

    handleInput(directory, command, args) {

		var fn = window[command]
		// if input is a function, execute it and return the results
		if (typeof fn === 'function') {
			return fn(directory, args);
			// If input is a bookmark, open it
		} else if (this.getAllLinkNames().indexOf(command) >= 0) {
			for (let file of this.allFiles) {
				if (file.getName() == command) {
					window.open(file.getUrl())
				}
			}
		} else {
			return "command not found: " + command, "red";
		}

    }
    
    man(args){
		if(!args[0]){
			printMessage("man: missing operand", "red")
			printMessage("Type 'man [command]' for information on any command", "red")
			return
		}
		for (let cmd of allCommands){
			if(cmd.getName() == args[0]){
				printMessage("command: "+cmd.getName(), "green")
				printMessage("description: "+cmd.getHelp(), "green")
				printMessage("usage: "+cmd.getUsage(), "green")
				document.getElementById('input_field').value = ''
				return
			}
		}
		printMessage("command not found: "+args[0])
	}
	
	 commands(args){
		for (let cmd of allCommands){
			printMessage(cmd.getName(), "cyan")
		}
    }
    
    useradd(args){
        if(!args[0]){
            printMessage('Please specify username','green')
            return
        }
        user = args[0]
        storeConfigToLocalStorage()
    }


}