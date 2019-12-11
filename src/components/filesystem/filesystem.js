import {newDirectory} from './directory.js'
import {newFile} from './file.js'
import { formatWithOptions } from 'util';

export function getFileSystem() {
	return new FileSystem();
} 

class FileSystem {
	constructor() {
		this.separator = '/'
		this.dirNameExp = /[\w|\~]+$/
		this.containsSlashCheckExp = /\//
		this.isAbsolutePathExp = /^\~/
		
		var config_exists = this.loadConfigFromLocalStorage();
		if (config_exists == 1) {

		} else {
			//create root dir and push it into stack
			this.root = newDirectory('~');
		}

	}

	getRoot() {
		return this.root;
	}

	buildPathList(path) {
		return path.split(this.separator);
	}

	getDir(path) {
		var split =this.buildPathList(path).splice(1);
		var node = this.root;
		while (node && split.length > 1) {
			node = node.getChild(split[0]);
			split = split.splice(1);
		}
		return node.getChild(split[0]);
	}

	//--------------------Saving & Restoring file system from localstorage------------------------

	loadConfigFromLocalStorage() {
		let dirs = JSON.parse(window.localStorage.getItem("directories"))

		if (!dirs) {
			return -1;
		}
		for (let d of dirs) {
			this.allDirectories.push(Directory(d.path))
		}
		let files = JSON.parse(window.localStorage.getItem("files"))
		for (let f of files) {
			this.allFiles.push(Link(f.path, f.url))
		}
		return 1;
	}

	storeConfigToLocalStorage() {
		window.localStorage.setItem("directories", JSON.stringify(allDirectories))
		window.localStorage.setItem("files", JSON.stringify(allFiles))
	}

	ls(dir, args) {
		var node;
		// no arguments, print content of 'dir'
		if (args[0] == undefined) {
			node = dir;
		// got argument
		} else {
			// argument is absolute path
			if (this.isAbsolutePathExp.test(args[0])) {
				node = this.getDir(args[0])
			// argument is relative path
			} else {
				node = this.getDir(`${dir.getPath()}${this.separator}${args[0]}`);
			}
		}

		return node.getChildrenNames().concat(node.getFileNames());
	}

	cd(args) {
		switch (args[0]) {
			case "..":
				upDir()
				break
			case undefined:
				homeDir()
				break
			default:
				if (!enterDir(args[0])) {
					printMessage("no such file or directory: " + args[0], "red")
				}
				break
		}
	}

	enterDir(path) {
		if (isAbsolutePathExp.test(path)) {
			if (dirExists(path)) {
				for (let dir of allDirectories) {
					if (dir.getPath() == path) {
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
			if (dirExists(newPath)) {
				for (let dir of allDirectories) {
					if (dir.getPath() == newPath) {
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

	homeDir() {
		for (let dir of allDirectories) {
			if (dir.getPath() == '~') {
				curr_dir = dir
				updatewd()
				currentSubDirectoryNames = curr_dir.getSubdirNames()
				clearConsoleOut()
			}
		}
	}

	upDir() {
		//Make sure we are not on the home directory
		if (!(curr_dir.getPath() == '~')) {
			let newPath = curr_dir.getPath().split('/')
			newPath.pop()
			newPath = newPath.join('/')
			enterDir(newPath)
		}
	}

	mkdir(dir, args) {
		if (!args[0]) {
			console.log("mkdir: missing operand")
			return "mkdir: missing operand";
		}
		if (dir.getChildrenNames().indexOf(args[0]) == -1) {
			dir.appendChild(newDirectory(args[0], dir));
			console.log('success')
		} else {
			console.log(`mkdir: cannot create directory '${args[0]}': File exists`)
			return `mkdir: cannot create directory '${args[0]}': File exists`;
		}
	}

	rmdir(curr_dir, args) {
		if (!args[0]) {
			return ("rmdir: missing operand", ResultType.error)
		}
		let result = rmdirHelper(args[0])
		//Dir does not exist
		if (result == 0) {
			return ("failed to remove '" + args[0] + "': No such file or directory", ResultType.error)
			//Dir is not empty
		} else if (result == 1) {
			return ("failed to remove '" + args[0] + "': Directory not empty", ResultType.error)
		}
	}

	touch(curr_dir, args) {
		if (!args[0]) {
			return("touch: missing file operand", ResultType.error)
		}
		if (!this.touchHelper(args[0], args[1])) {
			return ("cannot create file '" + args[0] + "': File exists", ResultType.error);
		}
	}

	rm(curr_dir, args) {
		if (!args[0]) {
			return ("rm: missing operand", ResultType.error)
		}
		if (!this.rmHelper(args[0])) {
			return("failed to remove '" + args[0] + "': No such file or directory", ResultType.error)
		}
	}





	//--------------------------------Utility-------------------------------------

	/*
	Check if an Absolute path is already in the file system
	*/
	dirExists(path) {
		for (let dir of this.allDirectories) {
			if (dir.getPath() == path) {
				return true
			}
		}
		return false
	}

	fileExists(path) {
		for (let file of this.allFiles) {
			if (file.getPath() == path) {
				return true
			}
		}
		return false
	}

	getDirWithPath(path) {
		for (let dir of this.allDirectories) {
			console.log(dir.getPath())
			console.log(path)
			if (dir.getPath() == path) {
				return dir
			}
		}
		return null
	}

	getFileWithPath(path) {
		for (let file of this.allFiles) {
			if (file.getPath() == path) {
				return file
			}
		}
		return null
	}

	pathIsAvailable(path) {
		for (let i = 0; i < this.allDirectories.length; i++) {
			let temp = path.split('/')
			temp.pop()
			temp = temp.join('/')
			if (temp == this.allDirectories[i].getPath()) {
				//Path is viable
				return true
			}
		}
		//Did not find a parent directory that matches the path until the name
		return false
	}


}




