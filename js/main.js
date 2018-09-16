const separator = '/'
const dirNameExp =  /[\w|\~]+$/
const containsSlashCheckExp = /\//

const allCommands = [
	Command("locate","search anythin on the internet", "locate [query]"),
	Command("pwd","Print working directory",'pwd'),
	Command("ls","List contents of working directory","ls"),
	Command("cd","change directory","cd [..| |path]"),
	Command("mkdir","create new directory", "mkdir [path]"),
	Command("rmdir","remove directory", "rm dir [path]"),
	Command("touch","crate new file (link)", "touch [patch]"),
	Command("rm","remove file (link)","rm [path]"),
	Command("clear","clear output","clear"),
	Command("echo", "repeat something","echo [phrase]"),
	Command("time","get current date and time","time"),
	Command("timer","start and stop a timer", "timer [start|stop|reset|get]"),
	Command("todo", "manage todo list"), // todo lol
	Command("commands","get list of commands", "commands"),
	Command("man", "get help for a command", "man [comand]"),
	Command("pageDesc","description of the startpage", "pageDesc")
	]

var allDirectories = []
var allFiles = []
var myTimer = Timer()

var curr_dir


/*
*Parse user input query from command line and execute command
*/
function parseQuery() {
	let query = document.getElementById('input_field').value
	let command = query.split(' ')[0]
	let args = query.split(' ').slice(1)

	clearConsoleOut()
	var fn = window[command]
	if(typeof fn === 'function'){
		fn(args)
	} else {
		printMessage("command not found: "+command, "red")
	}
	document.getElementById('input_field').value = ''
}

function updatewd(){
	document.getElementById('location').textContent = curr_dir.getPath()
}

function init() {
	loadConfigFromLocalStorage()
	for (let d of allDirectories){
		if(d.getPath() == '~'){
			curr_dir = d
		}
	}
	if (curr_dir == undefined ){
		curr_dir = Directory('~')
		allDirectories.push(curr_dir)
		printMessage("Hey there! - If you're new to the page try 'commands' for a "+
			"list of commands!", "green")
	}
	updatewd()
}

//--------------------Saving & Restoring file system from localstorage------------------------

function loadConfigFromLocalStorage(){
	let dirs = JSON.parse(window.localStorage.getItem("directories"))
	if(!dirs){
		return
	}
	for (let d of dirs){
		allDirectories.push(Directory(d.path))
	}
	let files = JSON.parse(window.localStorage.getItem("files"))
	for (let f of files){
		allFiles.push(Link(f.path,f.url))
	}
}

function storeConfigToLocalStorage(){
	window.localStorage.setItem("directories", JSON.stringify(allDirectories))
	window.localStorage.setItem("files", JSON.stringify(allFiles))
}