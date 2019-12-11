export function newFile(name, url, parent) {
	return new File(name, url, parent);
}

class File {
	constructor(name, url, parent) {
		this.name = name;
		this.url = url;
		this.parent = parent;
	}

	getUrl() {
		return this.url;
	}
	getPath() {
		return this.parent.getPath().concat(this.name);
	}
	getName() {
		return this.name;
	}
}
