

const separator = '/'

const commands = [
	Command("locate","search anythin on the internet"),
	Command("pwd","Print working directory"),
	Command("ls","List contents of working directory"),
	Command("cd","change directory"),
	Command("mkdir","create new directory"),
	Command("rmdir","remove directory"),
	Command("touch","crate new file (link)"),
	Command("rm","remove file (link)"),
	Command("clear","clear output"),
	Command("echo", "repeat something")
]


var curr_path = []

function parseQuery() {
	let query = document.getElementById('input_field').value
	let command = query.split(' ')[0]
	let args = query.split(' ').slice(1)
	let commandNames = []
	for(let j =0;j<commands.length;j++){
		commandNames.push(commands[j].name)
	}
	if(commandNames.indexOf(command) < 0){
		document.getElementById('input_field').value = "command not found: "+command
		return
	} else{
		clearConsoleOut()
		switch(command){
			case "pwd":
				printMessage(buildPathString())
				break
			case "ls":
				let dirs = curr_path[curr_path.length-1].getChildrenNames()
				let links = curr_path[curr_path.length-1].getLinkNames()
				for(let k =0;k<dirs.length;k++){
					printDirectory(dirs[k])
				}
				for(let k =0;k<links.length;k++){
					printLink(links[k])
				}
				break
			case "cd":
				switch(args[0]){
					case "..":
						upDir()
						break
					case undefined:
						homeDir()
						break
					default:
						enterDir(args[0])
						break
				}
				break
			case "locate":
				if(args[0]){
					window.open("https://duckduckgo.com/"+args.join(' '));
				} else {
					printMessage("Please enter a valid search query")
				}
				
				break
			case "mkdir":
				if(!curr_path[curr_path.length-1].addDirectoryByName(args[0])){
					printMessage("failed to create '"+args[0]+"': Directory already exists")
				}
				break
			case "rmdir":
				if (!curr_path[curr_path.length-1].removeDirectory(args[0])){
					printMessage("failed to remove '"+args[0]+"': No such file or directory")
				}
				break
			case "touch":
				if(!curr_path[curr_path.length-1].addLink(args[0], args[1])){
					printMessage("failed to create '"+args[0]+"': Link already exists")
				}
				break
			case "rm":
				if (!curr_path[curr_path.length-1].removeLink(args[0])){
					printMessage("failed to remove '"+args[0]+"': No such file or directory")
				}
				break
			case "clear":
				clearConsoleOut()
				break
			case "echo":
				printMessage(args.join(' '))
		}
		document.getElementById('input_field').value = ''
	}
}

function printDirectory(name){
	let a = document.createElement('a')
	a.className ="blue"
	a.href=`javascript:enterDir("${name}")`
	let linkText = document.createTextNode(name)
	a.appendChild(linkText)

	document.getElementById('console_out').appendChild(a)
}
function printMessage(msg){
	let a = document.createElement('a')
	a.className ="green"
	let linkText = document.createTextNode(msg)
	a.appendChild(linkText)
	document.getElementById('console_out').appendChild(a)
}
function printLink(name){
	let a = document.createElement('a')
	a.className = "cyan"
	a.target ="blank"
	a.href=curr_path[curr_path.length-1].getUrl(name)
	let linkText = document.createTextNode(name)
	a.appendChild(linkText)
	document.getElementById('console_out').appendChild(a)
}

function clearConsoleOut(){
	let out = document.getElementById("console_out")
	while (out.firstChild) {
    	out.removeChild(out.firstChild);
	}
}

function init() {
	updatewd()
	var home= Directory("~")
	var reddit= Directory("reddit")
	var university= Directory("university")
	var general = Directory("general")
	reddit.addLink("r/startpages","https://reddit.com/r/startpages")
	reddit.addLink("r/unixporn", "https://www.reddit.com/r/unixporn/")
	general.addLink("youtube","https://www.youtube.com/")
	general.addLink("github","https://github.com/")
	general.addLink("stackowerflow","https://stackoverflow.com/")
	home.addDirectoryByReference(reddit)
	home.addDirectoryByReference(general)
	home.addDirectoryByReference(university)
	curr_path.push(home)

}
function buildPathString (){
	let path =""
	for(let i =0;i<curr_path.length;i++){
		path += curr_path[i].getName()+'/'
	}
	return path
}

function updatewd(){
	document.getElementById('location').textContent = buildPathString()
}


function enterDir(name){
	if(curr_path[curr_path.length-1].containsDir(name)){
		curr_path.push(curr_path[curr_path.length-1].getDirectory(name))
		updatewd()
		clearConsoleOut()
		document.getElementById("input_field").focus()
	} else{
		printMessage("No such directory: "+name)
	}

}

function homeDir(){
	curr_path = curr_path.slice(0,1)
	updatewd()
}

function upDir(){
	//Already in home directory, no root access :P
	if(curr_path.length == 1){
		return
	} else {
		curr_path.pop()
		updatewd()
	}
}

function checkIfDirValid(){

}

function Directory (name) {
	var self = {}
	self.name = name
	self.children = []
	self.links = []

	self.getName = function (){
		return this.name
	}
	self.getChildren = function (){
		return this.children
	}
	self.getChildrenNames = function (){
		let names = []
		for(let i =0;i<self.children.length;i++){
			names.push(self.children[i].getName())
		}
		return names
	}
	self.getLinkNames = function (){
		let names = []
		for(let i =0;i<self.links.length;i++){
			names.push(self.links[i].getName())
		}
		return names
	}
	self.getFiles = function (){
		return this.files
	}
	self.addDirectoryByName = function(name){
		if(!self.containsDir()){
			self.children.push(Directory(name))
			return true
		}else {
			return false
		}
		
	}
	self.addDirectoryByReference = function(dir){
		if(!self.containsDir()){
			self.children.push(dir)
			return true
		}else {
			return false
		}
	}
	self.addLink = function(name,url){
		if(!self.containsLink()){
			self.links.push(Link(name,url))
			return true
		}else {
			return false
		}
		
	}
	self.containsLink = function(name){
		for(let i =0;i<self.links.length;i++){
			if(self.links[i].getName() == name){
				return true
			}
		}
		return false
	}
	self.getUrl = function(name){
		for(let i =0;i<self.links.length;i++){
			if(self.links[i].getName() == name){
				return self.links[i].getUrl()
			}
		}
	}
	self.containsDir = function(dir){
		for(let i =0;i<self.children.length;i++){
			if(self.children[i].getName() == dir){
				return true
			}
		}

		return false
	}
	self.getDirectory = function(dir){
		for(let i =0;i<self.children.length;i++){
			if(self.children[i].getName() == dir){
				return self.children[i]
			}
		}
		return null
	}
	self.removeDirectory = function(dir){
		for(let i =0;i<self.children.length;i++){
			if(self.children[i].getName() == dir){
				self.children.splice(i,1)
				return true
			}
		}
		return false
	}

	self.removeLink = function(link){
		for(let i =0;i<self.links.length;i++){
			if(self.links[i].getName() == link){
				self.links.splice(i,1)
				return true
			}
		}
		return false
	}

	return self
}

function Link (name, url) {
	var self = {}
	self.name = name
	self.url = url

	self.getUrl = function(){
		return this.url
	}

	self.getName = function(){
		return this.name
	}
	return self
}

function Command (name, description) {
	var self = {}
	self.name = name
	self.description = description

	self.getName = function(){
		return this.name
	}

	self.getDescription = function(){
		return this.description
	}

	return self
}