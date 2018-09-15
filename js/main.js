
const separator = '/'
const dirNameExp =  /[\w|\~]+$/
const containsSlashCheckExp = /\//
const isAbsolutePathExp = /^\~/

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

var allDirectories = []
var allFiles = []

var curr_dir


/*
*Parse user input query from command line and execute command
*/
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
				printMessage(curr_dir.getPath())
				break
			case "ls":
				if(args[0] == undefined){
					let dirs = curr_dir.getSubdirNames()
					let links = curr_dir.getLinkNames()
					for (let x of dirs) printDirectory(x)
					for (let x of links) printLink(x)
				} else {
					let tempDir
					if(isAbsolutePathExp.test(args[0])){
						tempDir = getDirWithPath(args[0])
					} else {
						tempDir = getDirWithPath(curr_dir.getPath()+separator+args[0])
					}
					let dirs = tempDir.getSubdirNames()
					let links = tempDir.getLinkNames()
					for (let x of dirs) printDirectory(x)
					for (let x of links) printLink(x)
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
						if(!enterDir(args[0])){
							printMessage("no such file or directory: "+args[0])
						}
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
				if(!mkdir(args[0])){
					printMessage("cannot create directory '"+args[0]+"': File exists")
				}
	
				break
			case "rmdir":
				let result = rmdir(args[0])
				//Dir does not exist
				if(result == 0){
					printMessage("failed to remove '"+args[0]+"': No such file or directory")
				//Dir is not empty
				}else if (result == 1){
					printMessage("failed to remove '"+args[0]+"': Directory not empty")
				}
				//Otherwise dir is deleted
				break
			case "touch":
				if(!touch(args[0], args[1])){
					printMessage("cannot create file '"+args[0]+"': File exists")	
				}
				break
			case "rm":
				if(!rm(args[0])){
					printMessage("failed to remove '"+args[0]+"': No such file or directory")
				}
				break
			case "clear":
				clearConsoleOut()
				break
			case "echo":
				printMessage(args.join(' '))
				break
		}
		document.getElementById('input_field').value = ''
	}
}

//------------------------------console stuff-----------------------------

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
function printLink(path){
	let a = document.createElement('a')
	a.className = "cyan"
	a.target ="blank"
	a.href=getFileWithPath(path).getUrl()
	let linkText = document.createTextNode(getFileWithPath(path).getName())
	a.appendChild(linkText)
	document.getElementById('console_out').appendChild(a)
}

function clearConsoleOut(){
	let out = document.getElementById("console_out")
	while (out.firstChild) {
    	out.removeChild(out.firstChild);
	}
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
	}
	updatewd()
	
}



//-------------------------------------File system operations-----------------------------


function mkdir(path){
	//check if submitted path is absolute
	if(isAbsolutePathExp.test(path)){
		//Check if path is not already taken
		if(dirExists(path)){
			return false
		}
		//check if path is viable
		if(pathIsAvailable(path)){
			allDirectories.push(Directory(path))
			storeConfigToLocalStorage()
			return true	
		}
		
	} else {
		let newPath = curr_dir.getPath() + separator + path
		return mkdir(newPath)
	}
}

function rmdir(path){
	if(isAbsolutePathExp.test(path)){
		//Check if dir exists and is not empy
		if(!dirExists(path)){
			return 0
		}
		if(!getDirWithPath(path).isEmpty){
			return 1
		}
		for(let i =0;i<allDirectories.length;i++){
			if(allDirectories[i].getPath() == path){
				allDirectories.splice(i,1)
				storeConfigToLocalStorage()
				return 2
			}
		}
	} else {
		//build absolute path and make recursive call
		let newPath = curr_dir.getPath() + separator + path
		return rmdir(newPath)
	}
}

function touch(path, url){
	//check if submitted path is absolute
	if(isAbsolutePathExp.test(path)){
		//Check if path is not already taken
		if(fileExists(path)){
			return false
		}
		//check if path is viable
		if(pathIsAvailable(path)){
			allFiles.push(Link(path, url))
			storeConfigToLocalStorage()
			return true	
		}
		
	} else {
		//build absolute path and make recursive call
		let newPath = curr_dir.getPath() + separator + path
		return touch(newPath, url)
	}
}

function rm(path){
	if(isAbsolutePathExp.test(path)){
		//Check if file exists
		if(!fileExists(path)){
			return false
		}
		for(let i =0;i<allFiles.length;i++){
			if(allFiles[i].getPath() == path){
				allFiles.splice(i,1)
				storeConfigToLocalStorage()
				return true
			}
		}
	} else {
		let newPath = curr_dir.getPath() + separator + path
		return rm(newPath)
	}
}


//-------------------------------------Navigation------------------------------------

function enterDir(path){
	if(isAbsolutePathExp.test(path)){
		if(dirExists(path)){
			for (let dir of allDirectories){
				if(dir.getPath() == path){
					curr_dir = dir
					updatewd()
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
					clearConsoleOut()
					return true
				}
			}
		} else {
			return false
		}
	}

}

function homeDir(){
	for (let dir of allDirectories){
		if(dir.getPath() == '~'){
			curr_dir = dir
			updatewd()
			clearConsoleOut()		
		}
	}
}

function upDir(){
	//Make sure we are not on the home directory
	if(!(curr_dir.getPath() == '~')){
		let newPath = curr_dir.getPath().split('/')
		newPath.pop()
		newPath = newPath.join('/')
		enterDir(newPath)
	}
}

//-------------------------------------Classes------------------------------------


function Directory (path) {
	var self = {}
	self.path = path

	self.getName = function (){
		return this.path.match(dirNameExp)[0]
	}
	self.getPath = function (){
		return this.path
	}
	self.getSubdirNames = function (){
		let names = []
		for (let dir of allDirectories){
			let myPath = this.path.split('/')
			let subPath = dir.getPath().split('/')
			subPath.pop()

			if(myPath.join('/') == subPath.join('/')){
				names.push(dir.getName())
			}
		}
		return names
	}

	self.isEmpty = function (){
		return this.getSubdirNames().length == 0 && this.getLinkNames().length == 0
	}
	self.getLinkNames = function (){
		let names = []
		for (let file of allFiles){
			let myPath = this.path.split('/')
			let subPath = file.getPath().split('/')
			subPath.pop()

			if(myPath.join('/') == subPath.join('/')){
				names.push(file.getPath())
			}
		}
		return names
	}
	return self
}

function Link (path, url) {
	var self = {}
	self.url = url
	self.path = path

	self.getUrl = function(){
		return this.url
	}
	self.getPath = function(){
		return this.path
	}

	self.getName = function(){
		return this.path.match(dirNameExp)[0]
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

//-------------------------------------Helper functions------------------------------------


function pathIsAvailable(path){
	for(let i = 0;i<allDirectories.length;i++){	
			let temp = path.split('/')
			temp.pop()
			temp = temp.join('/')
			if(temp == allDirectories[i].getPath()){
				//Path is viable
				return true
			}
		}
		//Did not find a parent directory that matches the path until the name
		return false
}

/*
Check if an Absolute path is already in the file system
*/
function dirExists(path){
	for (let dir of allDirectories){
		if(dir.getPath() == path){
			return true
		}
	}
	return false
}

function fileExists(path){
	for (let file of allFiles){
		if(file.getPath() == path){
			return true
		}
	}
	return false
}

function getDirWithPath(path){
	for (let dir of allDirectories){
		if(dir.getPath() == path){
			return dir
		}
	}
	return null
}

function getFileWithPath(path){
	for (let file of allFiles){
		if(file.getPath() == path){
			return file
		}
	}
	return null
}

//--------------------------------------Saving & Restoring file system------------------------

function loadConfigFromLocalStorage(){
	let dirs = JSON.parse(window.localStorage.getItem("directories"))
	if(!dirs){
		allDirectories.push(Directory('~'))
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