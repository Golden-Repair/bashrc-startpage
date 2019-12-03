class Terminal extends Window {

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
		var dom_object = $(`#${this.id}`);
		var query = dom_object.find('#input_field').val();
		var command = query.split(' ')[0]
		var args = query.split(' ').slice(1)
		dom_object.find('#console_out').val('');

		//TODO: make a command handler for the terminal that makes calls to the file system

		var results = this.os.systemCall(command, args);
		this.clearConsoleOut();
		this.printMessage(results);
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

		var dom_object = $(`#${this.id}`);

		// assign form handler
		dom_object.find('form').submit(function () {
			console.log('new form: ' + $(this).attr('id'));
			var id = $('form').attr('id')[0];
			de.getWindow(id).parseQuery();
			//de.addWindow(WindowTypes.terminal);
		});

		// Enable tabcomplete.
		//var input = dom_object.find("#input_field");
		//input.tabcomplete();
		//input.focus();

		this.uptimeStart = new Date().getTime()

		this.curr_dir = this.os.getFileSystem().getRoot();
		this.updatewd()

		this.out = dom_object.find(`#console_out`)

		dom_object.find("#prompt").text(this.PROMPT);
	}

	printDirectory(name){
		let a = document.createElement('a')
		a.href=`javascript:enterDir("${name}")`
		let linkText = document.createTextNode(name)
		a.appendChild(linkText)
	
		document.getElementById('console_out').appendChild(a)
	}

	printMessage(msg, color){
		let a = document.createElement('a')
		a.className =color
		let linkText = document.createTextNode(msg)
		a.appendChild(linkText)
		document.getElementById('console_out').appendChild(a)
	}

	 printLink(path){
		let a = document.createElement('a')
		a.className = "cyan"
		a.target ="blank"
		a.href=getFileWithPath(path).getUrl()
		let linkText = document.createTextNode(getFileWithPath(path).getName())
		a.appendChild(linkText)
		document.getElementById('console_out').appendChild(a)
	}

	 clearConsoleOut(){
		let out = document.getElementById("console_out")
		while (out.firstChild) {
			out.removeChild(out.firstChild);
		}
	}

	fetch(){
		this.printMessage(user+'@bashrc', 'red')
		this.printMessage('OS: '+window.navigator.oscpu, 'orange')
		this.printMessage('Kernel: bashrc v 0.1', 'yellow')
		let time = new Date().getTime() - uptimeStart
		let seconds = Math.floor(time/1000)
		let minutes = Math.floor(seconds/60)
		this.printMessage('Uptime: '+(minutes)+' minutes','green')
		this.printMessage('Resolution: '+$(window).width()+'x'+$(window).height(), 'pink')
		this.printMessage('DE: '+get_browser_info().name, 'darkblue')
	}

	get_browser_info(){
		var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
			return {name:'IE ',version:(tem[1]||'')};
			}
		if(M[1]==='Chrome'){
			tem=ua.match(/\bOPR\/(\d+)/)
			if(tem!=null)   {return {name:'Opera', version:tem[1]};}
			}
		M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
		return {
		  name: M[0],
		  version: M[1]
		};
	 }

	  cd(args){
		switch(args[0]){
			case "..":
				upDir()
				break
			case undefined:
				homeDir()
				break
			default:
				if(!enterDir(args[0])){
					printMessage("no such file or directory: "+args[0], "red")
				}
				break
		}
	}
	
	 enterDir(path){
		if(isAbsolutePathExp.test(path)){
			if(dirExists(path)){
				for (let dir of allDirectories){
					if(dir.getPath() == path){
						curr_dir = dir
						updatewd()
						currentSubDirectoryNames = curr_dir.getSubdirNames()
						clearConsoleOut()
						return true
					}
				}
			} else {
				return false
			}
			
		} else {
			let newPath = curr_dir.getPath() + separator + path
			if(dirExists(newPath)){
				for (let dir of allDirectories){
					if(dir.getPath() == newPath){
						curr_dir = dir
						updatewd()
						currentSubDirectoryNames = curr_dir.getSubdirNames()
						clearConsoleOut()
						return true
					}
				}
			} else {
				return false
			}
		}
	
	}
	
	 homeDir(){
		for (let dir of allDirectories){
			if(dir.getPath() == '~'){
				curr_dir = dir
				updatewd()
				currentSubDirectoryNames = curr_dir.getSubdirNames()
				clearConsoleOut()		
			}
		}
	}
	
	 upDir(){
		//Make sure we are not on the home directory
		if(!(curr_dir.getPath() == '~')){
			let newPath = curr_dir.getPath().split('/')
			newPath.pop()
			newPath = newPath.join('/')
			enterDir(newPath)
		}
	}

	 pwd(){
		printMessage(curr_dir.getPath(), "green")
	}
	
	 echo(args){
		printMessage(args.join(' '))
	}


	 locate(args){
		if(args[0]){
			window.open("https://duckduckgo.com/"+args.join(' '));
		} else {
			printMessage("Please enter a valid search query", "red")
		}
	}

	 time(){
		let date = new Date()
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
		
		printMessage("Today is the "+date.getDate()+"th of "+months[date.getMonth()]+" - The time is "+
			date.getHours()+" | "+date.getMinutes() +" | "+date.getSeconds()+".", "green")
	}
}