class Terminal extends Program {

	constructor(id, os) {
		super(id, $('#terminal-template'));
		this.PROMPT = ">";
		this.os = os;

		this.currentSubDirectoryNames = []
		//this.myTimer = Timer()
		this.user = ''
		this.uptimeStart = 0

		this.curr_dir = undefined
	}

	/*
	*Parse user input query from command line and execute command
	*/
	parseQuery() {
		var query = this.dom_object.find('#input_field').val();
		var command = query.split(' ')[0]
		var args = query.split(' ').slice(1)
		this.dom_object.find('#console_out').val('');

		//TODO: make a command handler for the terminal that makes calls to the file system

		var found_command = Object.getOwnPropertyNames(Terminal.prototype).filter(val => val == command);
		
		if (found_command) {
			command = this[found_command];
			return command(this, args);
		}
		var result = this.os.systemCall(this.curr_dir, command, args);
		this.clearConsoleOut();
		this.printMessage(result.messages, result.resultType);
	}

	updatewd() {
		var dom_object = $(`#${this.id} #wd`);
		dom_object.text(this.curr_dir.getPath());
	}

	init() {

		let storedUser = JSON.parse(window.localStorage.getItem("user"))
		if (storedUser) {
			this.user = storedUser;
		}

		this.dom_object.find("form").attr('id', `${this.id}form`);

		// assign form handler
		this.dom_object.find('form').submit(function () {
			console.log('new form: ' + $(this).attr('id'));
			var id = $('form').attr('id')[0];
			de.getProgram(id).parseQuery();
			//de.addWindow(WindowTypes.terminal);
		});



		// Enable tabcomplete.
		//var input = dom_object.find("#input_field");
		//input.tabcomplete();
		//input.focus();

		this.uptimeStart = new Date().getTime()

		this.curr_dir = this.os.getFileSystem().getRoot();
		this.updatewd()

		this.out = this.dom_object.find(`#console_out`)

		this.dom_object.find("#prompt").text(this.PROMPT);
	}

	printMessage(msgs, type) {
		if (typeof msgs == 'string') {
			msgs = [msgs];
		}
		msgs.forEach(msg => {
			let a = document.createElement('a')
			// also allow printing colored messages
			if (typeof type == 'string') {
				a.setAttribute('color', `var(--${type})`)
			}
			console.log(type)
			switch (type) {
				case ResultTypes.error:
					a.className = 'error';
					break;
				case ResultTypes.success:
					a.className = "success";
					break;
				case ResultTypes.link:
					a.className = 'link';
					break;
				case ResultTypes.directory:
					a.className = 'directory'
					break;
				default:
					break;
			}
			let linkText = document.createTextNode(msg)
			a.appendChild(linkText)
			document.getElementById('console_out').appendChild(a)
		});
	}

	clear(terminal, args) {
		let out = document.getElementById("console_out")
		while (out.firstChild) {
			out.removeChild(out.firstChild);
		}
	}

	fetch(terminal, args) {
		terminal.printMessage(`${terminal.os.getUser()}@bashrc`, 'red')
		terminal.printMessage(`OS: ${terminal.os.getName()}`, 'orange')
		terminal.printMessage(`Kernel: ${terminal.os.getKernel()}`, 'yellow')
		let time = new Date().getTime() - terminal.uptimeStart;
		let seconds = Math.floor(time / 1000)
		let minutes = Math.floor(seconds / 60)
		terminal.printMessage(`Uptime:  ${minutes} minutes`, 'green')
		var res = terminal.os.getDe().getScreenRes();
		terminal.printMessage(`Resolution: ${res[0]} x ${res[1]}`, 'pink')
		terminal.printMessage(`DE: ${terminal.os.getDe().getName()}`, 'darkblue')
	}



	pwd(terminal, args) {
		terminal.printMessage(terminal.curr_dir.getPath(), ResultTypes.success)
	}

	echo(terminal, args) {
		terminal.printMessage(args.join(' '), ResultTypes.success)
	}

	locate(args) {
		if (args[0]) {
			window.open("https://duckduckgo.com/" + args.join(' '));
		} else {
			this.printMessage("Please enter a valid search query", "red")
		}
	}


}