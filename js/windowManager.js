class Program {
	constructor(id, template) {
		this.id = id;
		this.template = template;
	}

	init() {}

    setDomObject(dom_object) {
        this.dom_object = dom_object;

    }

	instantiateTemplate() {
		return this.template.clone();
	}

	setId(id) {
		this.id = id;
	}

}

class DesktopManager {

    constructor(os, windowManager, rootElementId) {
        this.programs = {};
        this.currentId = 0;
        this.wm = windowManager;
        this.os = os;
        this.rootElementId = rootElementId;
        this.wm.setScreenProperties(rootElementId);
        this.name = this.get_browser_info().name;
    }

    getName() {
        return this.name;
    }

    getScreenRes() {
        return [$(window).width(), $(window).height()];
    }

    addProgram(program) {

        this.programs[this.currentId++] = program;

        // get the actual html
        var new_dom = program.instantiateTemplate();
        // set id and display
        new_dom.css('display', 'block');
        new_dom.attr("id", window.id);

        program.setDomObject(new_dom);

        // append new html block to DOM
        this.getRootElement().append(new_dom);

        // tell wm to update display
        this.wm.update(this.getPrograms());
    }

    removeProgram(id) {
        delete this.windows[id];
        this.wm.update(this.getPrograms());
    }

    getProgram(id) {
        console.log('searching for id: '+id)
        return this.programs[id];
    }

    getPrograms() {
        var w = this.programs;
        var values = Object.keys(w).map(function (key) {
                return w[key];
        });
        return values;
    }

    getRootElement() {
        return $("#" + this.rootElementId);
    }

    get_browser_info(){
		var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
			return {name:'IE ',version:(tem[1]||'')};
			}
		if(M[1]==='Chrome'){
			tem=ua.match(/\bOPR\/(\d+)/)
			if(tem!=null)   {return {name:'Opera', version:tem[1]};}
			}
		M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
		return {
		  name: M[0],
		  version: M[1]
		};
	 }
}

class WindowManager {
    constructor() {
    }

    setScreenProperties(rootElementId) {}
}

class FloatingWindowManager extends WindowManager {
    constructor(default_width, default_height) {
        super();
        this.default_height = default_height;
        this.default_width = default_width;
    }

    setScreenProperties(rootElementId) {
        var screen = $(`#${rootElementId}`);
        screen.css("display","block");

    }

    update(programs) {

        programs.forEach(program => {
            this.setDOMProperties(program, this.default_width, this.default_height);
        });
    }


    setDOMProperties(program, width, height) {
        var dom_obj = $(`#${program.id}`);
        dom_obj.css("width", `${width}`);
        dom_obj.css("height", `${height}`);
        dom_obj.css("margin", `auto`);
        dom_obj.css("margin-top", `10%`);
    }

}

class TilingWindowManager extends WindowManager {
    constructor() {
        super();
        this.numRows = 4;
        this.numCols = 4;
    }

    setScreenProperties(rootElementId) {
        var screen = $(`#${rootElementId}`);
        screen.css("display","grid");
        screen.css("grid-template-rows",`repeat(${self.numRows}, 1fr)`);
        screen.css("grid-template-columns",`repeat(${self.numCols}, 1fr)`);
        screen.css("grid-grap","3rem");
    }

    update(allWindows) {

        var windowNr = 1;
        var numSlots = allWindows.length;
        console.log('tiling totalWindows: '+numSlots)
        var x =1;
        var y = 1;
        var width = this.numCols;
        var height = this.numRows;
        allWindows.forEach(window => {
            console.log('getting spot for window: '+windowNr)
            if (windowNr != numSlots) {
                console.log('not last element')
                if (windowNr % 2 != 0) {
                    width /= 2;
                    this.setDOMProperties(window, x, y, width, height);
                    x += width;
                } else {
                    height /= 2;
                    this.setDOMProperties(window, x, y, width, height);
                    y += height;
                }
            } else {
                this.setDOMProperties(window, x, y, width, height);
            }
            console.log('> '+x+ ' > '+y+' > '+ width +' > '+height);
            windowNr += 1;
        });
    }


    setDOMProperties(window, x, y, width, height) {
        var dom_obj = $(`#${window.id}`);
        dom_obj.css("grid-row", `${y} /span ${height}`);
        dom_obj.css("grid-column", `${x} /span ${width}`);
    }

}


