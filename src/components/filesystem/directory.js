export function newDirectory(name, parent, isRoot) {
	return new Directory(name, parent);
}

class Directory {
	constructor(name, parent, isRoot) {
		this.name = name;
		this.isRoot = isRoot;
		if (parent) {
			this.isRoot = true;
			this.parent = null;
		} else {
			this.isRoot = false;
			this.parent = parent;
		}
		this.parent = parent;
		this.children = [];
		this.files = [];
	}

	appendChild(child) {
		this.children.push(child);
	}

	getParent() {
		return this.parent;
	}

	getRelative(name){
		if(name == '..') {
			return this.getParent();
		} else {
			return this.getChild(name);
		}
	}

	isEmpty() {
		console.log('isempty')
		console.log('test:' +this.children.length == 0 && this.files.length == 0)
		return this.children.length == 0 && this.files.length == 0;
	}

	getName() {
		return this.name;
	}
	getPath() {
		if (this.parent) {
			return this.parent.getPath().concat(this.name); 
		} else {
			return this.name;
		}
	}

	getChildren() {
		return this.children;
	}

	getChild(name) {
		return this.children.filter(c => c.getName() == name)[0];
	}
	getFile(name) {
		return this.files.filter(f => f.getName() == name)[0];
	}

	removeChild(name) {
		this.children = this.children.filter(c => c.getName() != name);
	}
	removeFile(name) {
		this.files = this.files.filter(f => f.getName() != name);
	}

	getChildrenNames() {
		return this.children.map( c => c.getName());
	}

	isEmpty() {
		return this.children.length == 0;
	}

	getFileNames() {
		return this.files.map(f => f.getName());
	}
	
	getFiles() {
		return this.files;
	}

	addFile(file) {
		this.files.push(file);
	}
	
}

