COMMANDS = Object.freeze({ "fs": 1, "os": 2, "bash": 3 });


class Command {
	constructor(name, description, usage, type) {
		this.type = type;
		this.name = name
		this.description = description
		this.usage = usage

	}
	getName() {
		return this.name
	}

	getHelp() {
		return this.description
	}

	getUsage() {
		return this.usage
	}

	getType() {
		return this.type;
	}

}

class CommandHandler {
	constructor() {

		this.allCommands = [
			new Command("locate", "search anythin on the internet", "locate [query]", COMMANDS.fs),
			new Command("pwd", "Print working directory", 'pwd', COMMANDS.bash),
			new Command("ls", "List contents of working directory", "ls", COMMANDS.fs),
			new Command("cd", "change directory", "cd [..| |path]", COMMANDS.fs),
			new Command("mkdir", "create new directory", "mkdir [path]", COMMANDS.fs),
			new Command("rmdir", "remove directory", "rm dir [path]", COMMANDS.fs),
			new Command("touch", "crate new file (link)", "touch [patch]", COMMANDS.fs),
			new Command("rm", "remove file (link)", "rm [path]", COMMANDS.fs),
			new Command("clear", "clear output", "clear", COMMANDS.bash),
			new Command("echo", "repeat something", "echo [phrase]", COMMANDS.fs),
			new Command("time", "get current date and time", "time", COMMANDS.os),
			new Command("timer", "start and stop a timer", "timer [start|stop|reset|get]", COMMANDS.os),
			//new Command("todo", "manage todo list", "not done yet"), // todo lol
			new Command("commands", "get list of commands", "commands", COMMANDS.os),
			new Command("man", "get help for a command", "man [command]", COMMANDS.os),
			new Command("pageDesc", "description of the startpage", "pageDesc", COMMANDS.os),
			new Command('useradd', 'Set your username for display :)', COMMANDS.os),
			new Command('fetch', 'system information', COMMANDS.bash)
		];
	}

	getAllCommands() {
		console.log('test')
		return this.allCommands;
	}

	handle(wd, command, args) {
		var foundCommand = -1;
		this.allCommands.forEach(c => {
			if (c.getName() === command) {
				foundCommand = c;
				// todo: break this or throw exception
			}
		});

		if (foundCommand == -1) {
			return -1;
		}

		switch (foundCommand.getType()) {
			case COMMANDS.os:
				return 0;
			case COMMANDS.fs:
				return 1;
			case COMMANDS.bash:
				return 2;
			default:
				return -1;
		}

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






}