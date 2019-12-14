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
			this.root = newDirectory('~', null, true);
		}
	}

	getRoot() {
		return this.root;
	}

	buildPathList(path) {
		return path.split(this.separator);
	}

	biuldPathString(path_list) {
		return path_list.join(this.separator);
	}

	getDir(path) {
		console.log(`getDir: ${path}`)
		//if path is a string, convert to list of names
		if (!Array.isArray(path)) {
			path = this.buildPathList(path)
		}
		//if path starts from root, remove root from path
		path = path.filter(p => p != this.getRoot().getName());

		//if path length is empty now it can ony be root
		if (path.length == 0) {
			return this.root;
		}
		// if path has length 1 it can only be a direct child of root
		if (path.length == 1) {
			console.log('searching '+path[0]+' in '+ this.getRoot().getName())
			return this.root.getChild(path[0]);
		}
		console.log('path: '+path)
		// else start at root and traverse tree until only name is left in path
		var node = this.root;
		console.log('searching '+path[0]+' in '+ node.getName())

		while (path.length > 1) {
			next = next.getRelative(path[0]);
			path = path.splice(1);
		}
		console.log('searching '+path[0]+' in '+ node.getName())
		return node.getChild(path[0]);
	}

	getFile(path) {
		console.log(`getFile: ${path}`)
		//if path is a string, convert to list of names
		if (!Array.isArray(path)) {
			path = this.buildPathList(path)
		}
		//if path starts from root, remove root from path
		path = path.filter(p => p != this.getRoot().getName());

		//if path length is empty now it can ony be root
		if (path.length == 0) {
			return `rm: cannot remove '${path}': Is a directory`;
		}
		// if path has length 1 it can only be a direct child of root
		if (path.length == 1) {
			console.log('searching '+path[0]+' in '+ this.getRoot().getName())
			return this.root.getFile(path[0]);
		}
		console.log('path: '+path)
		// else start at root and traverse tree until only name is left in path
		var node = this.root;
		console.log('searching '+path[0]+' in '+ node.getName())

		while (path.length > 1) {
			next = next.getRelative(path[0]);
			path = path.splice(1);
		}
		console.log('searching '+path[0]+' in '+ node.getName())
		return node.getFile(path[0]);
	}


// ------------------------- BASIC FILE SYSTEM COMMANDS ------------------------


	ls(dir, args) {
		console.log(`ls: ${dir} - ${args}`)
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

	cd(dir, args) {
		console.log('cd')
		switch (args[0]) {
			case "..":
				return dir.getParent()
			case undefined:
				return this.getRoot()
			default:
				console.log(`${dir.getPath()}${this.separator}${args}`)
				return this.getDir(`${dir.getPath()}${this.separator}${args}`);
		}
	}

	mkdir(dir, args) {
		console.log(`mkdir: ${dir} - ${args}`)
		if (!args[0]) {
			return "mkdir: missing operand";
		}
		if (dir.getChildrenNames().indexOf(args[0]) == -1) {
			dir.appendChild(newDirectory(args[0], dir));
		} else {
			return `mkdir: cannot create directory '${args[0]}': File exists`;
		}
	}

	rmdir(dir, args) {
		if (!args[0]) {
			return 'rmdir: missing operand';
		}
		var node = this.getDir(this.buildPathList(dir.getPath()+this.separator+args[0]));
		if(!node.isEmpty()) {
			return `failed to remove ${node.getName()}: Directory not empty`
		}
		node.getParent().removeChild(node.getName());
	}

	touch(dir, args) {
		if (!args[0] || !args[1]) {
			return "touch: missing file operand"
		}
		var path = args[0].slice(0,args[0].lastIndexOf(this.separator));
		var name = args[0].slice(args[0].lastIndexOf(this.separator)+1);
		if (!this.isAbsolutePathExp.test(path)) {
			path = path.length > 0 ? dir.getPath()+this.separator+path : dir.getPath()
		}
		
		console.log('path compl: '+path);
		console.log('name: '+name);
		var node = this.getDir(this.buildPathList(path));
		node.addFile(newFile(name, args[1], node));

	}

	rm(dir, args) {
		if (!args[0]) {
			return "rm: missing operand"
		}
		var path = args[0];
		if (!this.isAbsolutePathExp.test(args[0])) {
			path = dir.getPath()+ this.separator + path;
		}

		var file = this.getFile(this.buildPathList(path));
		file.getParent().removeFile(file.getName())
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
}




