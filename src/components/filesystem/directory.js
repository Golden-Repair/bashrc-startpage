export function newDirectory(name, parent, isRoot) {
	return new Directory(name, parent);
}

export function dirFromJSON(parent, json_obj){
	var d = new Directory(json_obj.name, parent, json_obj.isRoot);
	d.children = json_obj.children.map(c => fromJSON(d, c));
	d.files = json_obj.files.map(f => fromJSON(d, f));
	return d;
}


class Directory {
	constructor(name, parent, isRoot) {
		this.name = name;
		this.isRoot = isRoot;
		if (parent == null) {
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

	toJSON() {
		var json = {};
		json.name = this.name;
		json.isRoot = this.isRoot;
		json.children = this.children.map(c => c.toJSON());
		json.files = this.files.map(f => f.toJSON());
		return json;		
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
			return this.parent.getPath().concat("/"+this.name); 
		} else {
			return this.name;
		}
	}

	getChildren() {
		return this.children;
	}

	getChild(name) {
		console.log('my children:'+ this.children);
		return this.children.filter(c => c.getName() == name)[0];
	}
	getFile(name) {
		return this.files.filter(f => f.getName() == name)[0];
	}
	getNode(name) {
		return this.getChild(name).concat(this.getFile(name));
	}

	removeChild(name) {
		this.children = this.children.filter(c => c.getName() != name);
	}
	removeFile(name) {
		if(this.getFileNames().indexOf(name) == -1){
			return false;
		}
		this.files = this.files.filter(f => f.getName() != name);
		return true;
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
		if(this.getFileNames().indexOf(file.getName()) != -1) {
			return false;
		}
		this.files.push(file);
		return true;
	}

	
}

