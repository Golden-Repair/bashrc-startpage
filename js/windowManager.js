WindowTypes = Object.freeze({ "terminal": 1 });
WindowStates = Object.freeze({ "floating": 1, "tiled": 2, "fullscreen": 3 });


class Window {
	constructor(id, template) {
		this.id = id;
		this.template = template;
	}

	init() { }

	instantiateTemplate() {
		return this.template.clone();
	}

	setId(id) {
		this.id = id;
	}

}

class DesktopManager {

    constructor(os, windowManager, rootElementId) {
        this.windows = {};
        this.currentId = 0;
        this.wm = windowManager;
        this.os = os;
        this.rootElementId = rootElementId;
        this.wm.setScreenProperties(rootElementId);
    }

    createWindowFromType(type, id) {
        switch (type) {
            case WindowTypes.terminal:
                return new Terminal(id, this.os);
        }
    }

    addWindow(windowType) {

        var window = this.createWindowFromType(windowType, this.currentId);
        this.windows[this.currentId++] = window;

        // get the actual html
        var new_dom = window.instantiateTemplate();
        // set id and display
        new_dom.css('display', 'block');
        new_dom.attr("id", window.id);
        if (windowType == WindowTypes.terminal){
            new_dom.find("form").attr('id',`${window.id}form`);
            
        }

        // append new html block to DOM
        this.getRootElement().append(new_dom);

        window.init();
        // tell wm to update display
        this.wm.update(this.getWindows());
    }

    removeWindow(id) {
        delete this.windows[id];
        this.wm.update(this.getWindows());
    }

    getWindow(id) {
        console.log('searching for id: '+id)
        return this.windows[id];
    }

    getWindows() {
        var w = this.windows;
        var values = Object.keys(w).map(function (key) {
                return w[key];
        });
        return values;
    }

    getRootElement() {
        return $("#" + this.rootElementId);
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

    update(allWindows) {

        allWindows.forEach(window => {
            this.setDOMProperties(window, this.default_width, this.default_height);
        });
    }


    setDOMProperties(window, width, height) {
        var dom_obj = $(`#${window.id}`);
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


