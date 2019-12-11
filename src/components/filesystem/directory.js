export function newDirectory(name, parent) {
	return new Directory(name, parent);
}

class Directory {
	constructor(name, parent) {
		this.name = name;
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

		return this.children.filter(c => c.getName() == name);
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
	
}

