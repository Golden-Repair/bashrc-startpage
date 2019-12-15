import {newDirectory, dirFromJSON} from './directory.js'
import {newFile, fileFromJSON} from './file.js'
import { newResponse } from '../response.js'

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
		console.log("Searching for config on local storage: "+config_exists)
		if (config_exists == -1) {
			//create root dir and push it into stack
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
		console.log("path is: "+path)
		while (path.length > 1) {
			node = node.getRelative(path[0]);
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

	getLastPathNode(dir, path) {
		var path = args[0].slice(0,args[0].lastIndexOf(this.separator));

		if (!this.isAbsolutePathExp.test(path)) {
			path = path.length > 0 ? dir.getPath()+this.separator+path : dir.getPath()
		}
		var node = this.getDir(this.buildPathList(path));
		return node;

	}

	getPathTarget(dir, path) {
		var name = args[0].slice(args[0].lastIndexOf(this.separator)+1);


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
		var res = newResponse();
		res.dirs = node.getChildrenNames();
		res.files = node.getFiles().map(f => ({"name": f.getName(), "url": f.getUrl()}));
		return res;
	}

	cd(dir, args) {
		console.log('cd')
		var res = newResponse()
		switch (args[0]) {
			case "..":
				res.directory = dir.getParent()
				break;
			case undefined:
				res.directory = this.getRoot()
				break;
			default:
				res.directory = this.getDir(`${dir.getPath()}${this.separator}${args}`)
				break;
		}
		return res;
	}

	mkdir(dir, args) {
		console.log(`mkdir: ${dir} - ${args}`)
		var res = newResponse();
		if (!args[0]) {
			res.message.push({"type": "error", "value":"mkdir: missing operand"});
			return res;
		}
		var path = args[0].slice(0,args[0].lastIndexOf(this.separator));
		var name = args[0].slice(args[0].lastIndexOf(this.separator)+1);
		console.log(`mkdir: path: ${path} - name: ${name}`)

		if (!this.isAbsolutePathExp.test(path)) {
			path = path.length > 0 ? dir.getPath()+this.separator+path : dir.getPath()
		}
		var node = this.getDir(this.buildPathList(path));
		console.log("found node: "+node);
		if (node.getChildrenNames().indexOf(name) == -1) {
			node.appendChild(newDirectory(name, node));
			this.storeConfigToLocalStorage()
		} else {
			res.messages.push({"type": "error", "value": `mkdir: cannot create directory '${args[0]}': File exists`});
			return res;
		}
	}

	rmdir(dir, args) {
		res = newResponse()
		if (!args[0]) {
			res.messages.push({"type": error, "value": 'rmdir: missing operand'});
		}
		var node = this.getDir(this.buildPathList(dir.getPath()+this.separator+args[0]));
		if(!node.isEmpty()) {
			res.messages.push({"type": error, "value": `failed to remove ${node.getName()}: Directory not empty`})
			return res
		}
		node.getParent().removeChild(node.getName());
	}

	touch(dir, args) {
		console.log(`touch: ${dir} - ${args}`)
		var res = newResponse();
		if (!args[0] || !args[1]) {
			res.messages.push({"type": "error", "value": "touch: missing file operand"})
			return res
		}
		var path = args[0].slice(0,args[0].lastIndexOf(this.separator)+1);
		var name = args[0].slice(args[0].lastIndexOf(this.separator)+1);
		console.log(`touch: path: ${path} - name: ${name}`)

		if (!this.isAbsolutePathExp.test(path)) {
			path = path.length > 0 ? dir.getPath()+this.separator+path : dir.getPath()
		}
		
		var node = this.getDir(this.buildPathList(path));
		if(!node.addFile(newFile(name, args[1], node))) {
			res.messages.push({"type":"error", "value": `touch: cannot create file '${name}': File exists`});
			return res;
		}
		
	}

	rm(dir, args) {
		var res = newResponse();
		if (!args[0]) {
			res.messages.push({"type": "error", "value": "rm: missing operand"});
			return res;
		}
		var path = args[0];
		if (!this.isAbsolutePathExp.test(args[0])) {
			path = dir.getPath()+ this.separator + path;
		}

		var file = this.getFile(this.buildPathList(path));
		if(!file.getParent().removeFile(file.getName())) {
			res.messages.push({"type": "error", "value": `rm: cannot remove '${test}: No such file or directory'` });
		}
	}

	api() {
		return ["cd", "touch", "rm", "mkdir", "rmdir", "ls"];
	}


		//--------------------Saving & Restoring file system from localstorage------------------------

		loadConfigFromLocalStorage() {
			let json_obj = JSON.parse(window.localStorage.getItem("root"))
			this.root = newDirectory('~', null, true);
			if (!json_obj) {
				return -1;
			} else {
				this.root.children = json_obj.children.map(c => dirFromJSON(this.root, c));
				this.root.files = json_obj.files.map(f => fileFromJSON(this.root, f));
				return 1;
			}
		}
	
		storeConfigToLocalStorage() {
			console.log("Storing root node in local storage")
			localStorage.setItem("root", JSON.stringify(this.getRoot().toJSON()));
		}


}




