
# BASHRC

![demo](https://github.com/cbrasser/bashrc/blob/master/demo_screen.png)

# Live version

https://cbrasser.github.io/

## Functionality

The basic principle of this startpage is to act as a bookmark repository.
...But in a very cool way.

This is a start page heavily inspired by my linux desktop setup, where I mainly operate in the terminal or terminal-based applications. Naturally, I'd like my browser startpage to be keyboard oriented as well. But it should also look nice.

The Idea is to act like an os with a desktop environment, a file manager and open programs that are then arranged on the page trough a Window Manager (currently tiling or floating).

In the floating layout (which is the default atm), you can drag the windows around by holding 'shift' on your keyboard and dragging the window. window locations are stored in the config and should be persistent upon refreshing the page. This way you can arrange your windows in a way that you like.

Directories in the file system resemble bookmark categories and Files are named links to your most visited webpages.


## Available programs

### shell

available commands:
- cd [path]: change directory
- ls [path]: list content of directory
- touch [path, url]: create file linking to [url]
- rm [path]: remove file
- mkdir [path]: create new directory
- rmdir [path]: remove directory
- fetch: cool system information
- echo [args]: print [args] to stdout
- pwd: print current working directory
- open [path]: open url of file at [path] in new tab
- clear: clear stdout

There is autocompletion for both commands and paths. you can invoke it by starting to type something and then hitting 'tab'. You can cycle through suggestions with tab and accept one with 'enter'. If there is only one suggestion, 'tab' will also work for accepting.


### filemanager

Modeled after the linux file manager 'fff' (fucking fast filemanager).
It is completely keyboard based.
You can move up and down the content of the current directory with the arrow keys.
- Right arrow key either enters the selected item if its a directory or opens the url of the file if its a file.
- Left arrow key goes into the parent directory of the current dir
- input 'a' to add a new file/directory
- input 'd' to go into 'deletion' mode: All (with 'd') selected elements will be deleted uppon pressing 'p'. Directories can only be deleted if they are empty.
- input 'esc' to leave the input prompt or deletion mode, if one of them is open.

The status bar at the bottom displays the path of the current working directory as well as the position of the selected element.

### weather 

Just a tiny applet that displays local weather information. you can set your
city in the settings widget.

###  todo

a tiny todo tracker. todos store a name and a description of a task, as well as
0 to several tags for marking tasks that belong to the same category (work, private,
university, some project, whatever). You can color-code the tags by clicking on them and selecting a color in the color strip.

Task completion is going to be implemented within the next few days.

### Settings

The wheel on the bottom left of the page opens the settings. you can select which applications you would like to have open upon startup.

More settings and customizability options will be added in the near future

### Active TODO list

current todos, each with priority in parenthesis

- add window manager state selection to settings (1)
- implement filetree widget (9)
- implement colorscheme framework (3)
- implement colorscheme selection & generation (4)
- implement split layouts other than just vertical split for tiling state (5)

### General remarks

Links and dirs are clickable in all programs as well, but thats not the point of this website right?.

All bookmarks are currently stored in local storage, so you might now want to clear your cache if you stored a lot of bookmarks on the page. I am planning on porting the page into a chrome extension to get better storage options.


It should work with all modern browsers, however I'm mainly using firefox and can't guarantee that everything looks nicely on other browsers.

