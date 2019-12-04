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

	printDirectory(name) {
		let a = document.createElement('a')
		a.href = `javascript:enterDir("${name}")`
		let linkText = document.createTextNode(name)
		a.appendChild(linkText)

		document.getElementById('console_out').appendChild(a)
	}

	printMessage(msgs, type) {
		msgs.forEach(msg => {
			let a = document.createElement('a')
			console.log(type)
			switch (type) {
				case ResultTypes.error:
					a.className = 'error';
					break;
				case ResultTypes.success:
					a.className = "success";
					break;
				default:
					break;
			}
			let linkText = document.createTextNode(msg)
			a.appendChild(linkText)
			document.getElementById('console_out').appendChild(a)
		});
	}

	printLink(path) {
		let a = document.createElement('a')
		a.className = "cyan"
		a.target = "blank"
		a.href = getFileWithPath(path).getUrl()
		let linkText = document.createTextNode(getFileWithPath(path).getName())
		a.appendChild(linkText)
		document.getElementById('console_out').appendChild(a)
	}

	clearConsoleOut() {
		let out = document.getElementById("console_out")
		while (out.firstChild) {
			out.removeChild(out.firstChild);
		}
	}

	fetch() {
		this.printMessage(this.os.getUser() + '@bashrc', 'red')
		this.printMessage('OS: ' + this.os.getName(), 'orange')
		this.printMessage(`Kernel: ${this.os.getKernel()}`, 'yellow')
		let time = new Date().getTime() - this.uptimeStart;
		let seconds = Math.floor(time / 1000)
		let minutes = Math.floor(seconds / 60)
		this.printMessage('Uptime: ' + (minutes) + ' minutes', 'green')
		var res = this.os.getDe().getScreenRes();
		this.printMessage('Resolution: ' + res[0] + 'x' + res[1], 'pink')
		this.printMessage('DE: ' + this.os.getDe().getName(), 'darkblue')
	}



	pwd() {
		this.printMessage(this.curr_dir.getPath(), "green")
	}

	echo(args) {
		this.printMessage(args.join(' '))
	}

	locate(args) {
		if (args[0]) {
			window.open("https://duckduckgo.com/" + args.join(' '));
		} else {
			this.printMessage("Please enter a valid search query", "red")
		}
	}

	timer(args) {
		if (!args[0]) {
			printMessage("timer: missing operand", "red")
			printMessage("Try 'man timer' for more information", "red")
			return
		}
		switch (args[0]) {
			case "start":
				myTimer.start()
				break
			case "stop":
				myTimer.stop()
				break
			case "reset":
				myTimer.reset()
				break
			case "get":
				printMessage(myTimer.getTime())
			default:
				break
		}
	}


}