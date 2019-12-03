ResultTypes = Object.freeze({ "directory": 1, "link": 2, "error": 3});


/*
*Parse user input query from command line and execute command
*/
function parseQuery(id) {
	var dom_object = $(`#${id}`);

	var query = dom_object.find('#input_field').value
	var command = query.split(' ')[0]
	var args = query.split(' ').slice(1)
	
	return {"query":command, "args": args};

}

function pageDesc(){
	printMessage("This startpage is intended to look & act like a unix terminal.", "green")
	printMessage("You can create and manage directories and files - dorectories "+
		"act as bookmark folders and files as bookmark links", "green")
	printMessage("The most common unix commands such as [cd|touch|mkdir|rm|rmdir] are supported!", "green")
	printMessage("Try typing 'commands' for a list of commands or 'man [command]' for help "+
		"with a specific command", "green")
	printMessage("You can autocomplete directories with the 'tab' key! I will add autocomplete "+
		"for files soon.","green")
}


function timer(args){
	if(!args[0]){
		printMessage("timer: missing operand", "red")
		printMessage("Try 'man timer' for more information", "red")
		return
	}
	switch(args[0]){
		case "start":
			myTimer.start()
			break
		case "stop":
		myTimer.stop()
			break
		case "reset":
		myTimer.reset()
			break
		case "get":
		printMessage(myTimer.getTime())
		default:
			break
	}
}