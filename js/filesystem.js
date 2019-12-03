function Directory(path) {
	var self = {}
	self.path = path

	self.getName = function () {
		return this.path.match(dirNameExp)[0]
	}
	self.getPath = function () {
		return this.path
	}
	self.getSubdirNames = function () {
		let names = []
		for (let dir of allDirectories) {
			let myPath = this.path.split('/')
			let subPath = dir.getPath().split('/')
			subPath.pop()

			if (myPath.join('/') == subPath.join('/')) {
				names.push(dir.getName())
			}
		}
		return names
	}

	self.isEmpty = function () {
		return this.getSubdirNames().length == 0 && this.getLinkNames().length == 0
	}
	self.getLinkNames = function () {
		let names = []
		for (let file of allFiles) {
			let myPath = this.path.split('/')
			let subPath = file.getPath().split('/')
			subPath.pop()

			if (myPath.join('/') == subPath.join('/')) {
				names.push(file.getPath())
			}
		}
		return names
	}
	return self
}

function Link(path, url) {
	var self = {}
	self.url = url
	self.path = path

	self.getUrl = function () {
		return this.url
	}
	self.getPath = function () {
		return this.path
	}

	self.getName = function () {
		return this.path.match(dirNameExp)[0]
	}
	return self
}


class FileSystem {
	constructor() {
		this.separator = '/'
		this.dirNameExp = /[\w|\~]+$/
		this.containsSlashCheckExp = /\//
		this.isAbsolutePathExp = /^\~/
		this.allDirectories = []
		this.allFiles = []

		
		var config_exists = this.loadConfigFromLocalStorage();
		if (config_exists == 1) {

		} else {
			//create root dir and push it into stack
			var root = Directory('~');
			this.allDirectories.push(root);
		}

	}

	getRoot() {
		return this.allDirectories[0];
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

	ls(curr_dir, args) {
		var results = [];
		if (args[0] == undefined) {
			let dirs = curr_dir.getSubdirNames()
			let links = curr_dir.getLinkNames()
			for (let x of dirs) results.push(x, ResultType.directory)
			for (let x of links) results.push(x, ResultType.link)
		} else {
			let tempDir
			if (isAbsolutePathExp.test(args[0])) {
				tempDir = getDirWithPath(args[0])
			} else {
				tempDir = getDirWithPath(curr_dir.getPath() + separator + args[0])
			}
			let dirs = tempDir.getSubdirNames()
			let links = tempDir.getLinkNames()
			for (let x of dirs) results.push(x, ResultType.directory)
			for (let x of links) results.push(x, ResultType.link)
		}
		return results;
	}

	mkdir(curr_dir, args) {
		if (!args[0]) {
			return ("mkdir: missing operand", ResultType.error);
		}
		if (!this.mkdirHelper(args[0])) {
			return ("cannot create directory '" + args[0] + "': File exists", ResultType.error)
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

	//-------------------------------------helpers-------------------------------------

	mkdirHelper(curr_dir, path) {
		//check if submitted path is absolute
		if (this.isAbsolutePathExp.test(path)) {
			//Check if path is not already taken
			if (this.dirExists(path)) {
				return false
			}
			//check if path is viable
			if (this.pathIsAvailable(path)) {
				this.allDirectories.push(Directory(path))
				this.storeConfigToLocalStorage()
				this.currentSubDirectoryNames = curr_dir.getSubdirNames()
				return true
			}

		} else {
			let newPath = curr_dir.getPath() + this.separator + this.path
			return this.mkdirHelper(newPath)
		}
	}

	rmdirHelper(curr_dir, path) {
		if (this.isAbsolutePathExp.test(path)) {
			//Check if dir exists and is not empy
			if (!this.dirExists(path)) {
				return 0
			}
			if (!this.getDirWithPath(path).isEmpty) {
				return 1
			}
			for (let i = 0; i < this.allDirectories.length; i++) {
				if (this.allDirectories[i].getPath() == path) {
					this.allDirectories.splice(i, 1)
					this.storeConfigToLocalStorage()
					this.currentSubDirectoryNames = curr_dir.getSubdirNames()
					return 2
				}
			}
		} else {
			//build absolute path and make recursive call
			let newPath = curr_dir.getPath() + this.separator + this.path
			return this.rmdirHelper(newPath)
		}
	}

	touchHelper(curr_dir, path, url) {
		//check if submitted path is absolute
		if (this.isAbsolutePathExp.test(path)) {
			//Check if path is not already taken
			if (this.fileExists(path)) {
				return false
			}
			//check if path is viable
			if (this.pathIsAvailable(path)) {
				this.allFiles.push(Link(path, url))
				this.storeConfigToLocalStorage()
				return true
			}

		} else {
			//build absolute path and make recursive call
			let newPath = curr_dir.getPath() + this.separator + this.path
			return this.touchHelper(newPath, url)
		}
	}

	rmHelper(curr_dir, path) {
		if (this.isAbsolutePathExp.test(path)) {
			//Check if file exists
			if (!this.fileExists(path)) {
				return false
			}
			for (let i = 0; i < this.allFiles.length; i++) {
				if (this.allFiles[i].getPath() == path) {
					this.allFiles.splice(i, 1)
					this.storeConfigToLocalStorage()
					return true
				}
			}
		} else {
			let newPath = curr_dir.getPath() + this.separator + this.path
			return this.rmHelper(newPath)
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




