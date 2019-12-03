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

function WindowManager (rootElementId) {
	var self = {};
	self.rootElementId = rootElementId;
	self.numRows = 1;
	self.numCols= 1;
	self.children = {};

	self.spawnChild = function(type) {
		var activeId = document.activeElement.id;

		// no active window yet, so just spawn one fullscreen
		if (!activeId) {
			console.log('no active element')
			var new_window = type.template.content.cloneNode(true);
			$("#"+self.rootElementId).append(new_window);
			// set its id to 0
			$(".window").attr("id",0);
			$("#0").css("grid-row","1 / span 4").css("grid-column","1 / span 4")
			return;
		} else {
			var active = $("#"+activeId);
			
			//Get the top level container of the active terminal
			active = active.parent().parent().parent().parent().parent();
		}
		// Element to split is more wide than high
		if(active.css("grid-column") > active.css("grid-row")) {
			active.css("grid-column",active.css("grid-column")/2);
		} else {
			active.css("grid-row",active.css("grid-row")/2);

		}
		$("#"+self.rootElementId).append(type.template.content.cloneNode(true));
	};

	self.destroyChild = function(id) {

	}

	return self;
}

function Terminal () {
	var self = {};
	self.template = document.getElementById('terminal-template');

	return self;
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

function Command (name, description, usage) {
	var self = {}
	self.name = name
	self.description = description
	self.usage = usage

	self.getName = function(){
		return this.name
	}

	self.getHelp = function(){
		return this.description
	}

	self.getUsage = function(){
		return this.usage
	}

	return self
}

function Timer(){
	var self = {}
	self.starttime = 0
	self.endtime = 0
	self.running = false
	self.isReset = true

	self.getTime = function() {
		if(this.running){
			return new Date().getTime() - this.starttime
		}else {
			if(this.isReset){
				return 0
			}
			return this.endtime - this.starttime	
		}
		
	}

	self.start = function() {
		this.running = true
		this.isReset = false
		this.starttime = new Date().getTime()
	}
	self.stop = function(){
		this.running = false
		this.endtime = new Date().getTime()
		this.time =  this.endtime - this.starttime

	}
	self.reset = function(){
		if(this.running){
			this.starttime =new Date().getTime()
		} else {
			this.isReset=true
		}
		
	}
	return self
}