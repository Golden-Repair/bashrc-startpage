function printDirectory(name){
	let a = document.createElement('a')
	a.className ="blue"
	a.href=`javascript:enterDir("${name}")`
	let linkText = document.createTextNode(name)
	a.appendChild(linkText)

	document.getElementById('console_out').appendChild(a)
}
function printMessage(msg, color){
	let a = document.createElement('a')
	a.className =color
	let linkText = document.createTextNode(msg)
	a.appendChild(linkText)
	document.getElementById('console_out').appendChild(a)
}
function printLink(path){
	let a = document.createElement('a')
	a.className = "cyan"
	a.target ="blank"
	a.href=getFileWithPath(path).getUrl()
	let linkText = document.createTextNode(getFileWithPath(path).getName())
	a.appendChild(linkText)
	document.getElementById('console_out').appendChild(a)
}

function clearConsoleOut(){
	let out = document.getElementById("console_out")
	while (out.firstChild) {
    	out.removeChild(out.firstChild);
	}
}

function clear(){
	clearConsoleOut()
}