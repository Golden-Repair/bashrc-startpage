<template>
  <div>
    <prompt
      v-on:input="onCommand"
      v-on:submit="onCommandSubmit"
      v-bind:wd="this.wdName"
      v-bind:suggestions="this.suggestions"
    />
    <term-out v-bind:out="this.out" v-on:cd="onCommandSubmit" />
  </div>
</template>
<script>
import prompt from "./prompt.vue";
import termOut from "./term-out.vue";
import { newResponse } from "../response";
import { log } from "../logger";
import { get_browser_info} from '../utility'

export default {
  name: "terminal",
  components: {
    prompt,
    termOut
  },
  props: {
    fs: Object
  },
  watch: {
    response: function(newResponse, oldVal) {
      this.out.dirs = newResponse.dirs;
      this.out.files = newResponse.files;
      this.out.messages = newResponse.messages;
    },
    suggestions: function(newSuggestions, oldVal) {}
  },
  data: function() {
    return {
      out: { dirs: [], files: [], messages: [] },
      response: {},
      wd: {},
      wdname: "",
      suggestions: [],
      uptimeStart: new Date().getTime(),

    };
  },
  computed: {
    wdName() {
      if (this.wd["getName"]) {
        return this.wd.getName();
      } else {
        return "";
      }
    }
  },
  mounted: function() {
    this.wd = this.fs.getRoot();
    this.buildCommands();
    console.log([this.commands]);
  },
  methods: {
    onCommand: function(input) {
      // Handle autocompletion
      this.suggest(input);
    },
    onCommandSubmit: function(com) {
      this.out = { dirs: [], files: [], messages: [] };
      var c = com.split(" ")[0];
      var args = com.split(" ").slice(1);
      try {
        log("command", c, "green");
        log("args", args, "green");
        /* in order to manage multiple applocations that access
            the file system we have to hand it to each command
         for each invocation
         */
        var res = this.commands[c](this.fs, this.wd, args);
        if (res) {
          if (res.directory) {
            this.wd = res.directory;
          } else {
            this.response = res;
          }
        }
      } catch (e) {
        log("error", e, "red");
        var res = newResponse();
        res.messages.push({
          type: "error",
          value: `bashrc: command not found: ${c}`
        });
        this.response = res;
      }
    },
    buildCommands: function() {
      log("terminal", "building commands", "green");
      this.commands = {
        cd: function(fs, wd, args) {
          return fs.cd(wd, args);
        },
        ls: function(fs, wd, args) {
          log("ls", args, "red");
          return fs.ls(wd, args);
        },
        touch: function(fs, wd, args) {
          return fs.touch(wd, args);
        },
        rm: function(fs, wd, args) {
          return fs.rm(wd, args);
        },
        mkdir: function(fs, wd, args) {
          return fs.mkdir(wd, args);
        },
        rmdir: function(fs, wd, args) {
          return fs.rmdir(wd, args);
        },
        clear: function(fs, wd, args) {
          return newResponse();
        },
        fetch: function(fs, wd, args) {
          var res = newResponse();
          //res.messages.push({ type: "value", value: user+'@bashrc', css: {"color": "red"}})
          res.messages.push({ type: "value", value: 'OS > '+window.navigator.platform, css: {"color": "var(--orange)"}})
          res.messages.push({ type: "value", value: 'Kernel > bashrc v1.0.1', css: {"color": "var(--yellow)"}})
          let seconds = Math.floor(Math.random()*60)
          let minutes = Math.floor(Math.random()*60)
          res.messages.push({ type: "value", value: `Uptime > ${minutes} minutes - ${seconds} seconds`, css: {"color": "var(--green)"}})
          res.messages.push({ type: "value", value: 'Resolution > '+$(window).width()+'x'+$(window).height(), css: {"color": "var(--pink)"}})
          res.messages.push({ type: "value", value: 'DE > '+get_browser_info().name,css: {"color": "var(--darkblue)"}})
          return res;
        },
        pwd: function(fs, wd, args) {
          var res = newResponse();
          res.messages.push({ type: "value", value: wd.getName() });
          return res;
        },
        echo: function(fs, wd, args) {
          var res = newResponse();
          res.messages.push({ type: "value", value: args.join(" ") });
          return res;
        },
        locate: function(fs, wd, args) {
          if (args[0]) {
            window.open("https://duckduckgo.com/" + args.join(" "));
          } else {
            return "Please enter a valid search query";
          }
        },
        open: function(fs,wd, args) {
          log("open", args);
          var res = newResponse();
          if (!args[0]) {
            res.messages.push({
              type: "error",
              value: `open: missing operand`
            });
            return res;
          }
          var file = fs.getNode(wd, args);

          if (!file) {
            res.messages.push({
              type: "error",
              value: `open: cannot open '${args[0]}': No such file or directory`
            });
            return res;
          }
          if (!file.url) {
          } else {
            window.location = file.url;
          }
        },
        getMethods() {
          var res = [];
          for (var m in this) {
            if (typeof this[m] == "function") {
              res.push(m);
            }
          }
          return res;
        }
      };
    },
    suggest: function(input) {
      log("input", input, "green");
      var content;
      if (input.length == 0) {
        this.suggestions = [];
      }
      //input contains a space, suggesting that the user has already typed a command and
      //is now typing the arguments
      if (input.indexOf(" ") != -1) {
        log("Suggesting", "files", "green");
        this.suggestFiles(input);
      } else {
        log("Suggesting", "commands", "green");
        this.suggestCommands(input);
        // User has not yet typed a space -> suggest commands or files to open
      }
    },
    suggestCommands: function(input) {
      var commands = this.commands.getMethods();
      log("commands", commands);
      var files = this.wd.getFileNames();
      this.suggestions = commands
        .concat(files)
        .filter(c => c.substr(0, input.length) == input);
    },
    suggestFiles: function(input) {
      var command = input.split(" ")[0] + " ";
      var path = input.split(" ").splice(1)[0];
      log("command", command);
      log("path", path);
      var content;
      // input path contains a separator, search suggestions in last directory of path
      if (path.indexOf(this.fs.separator) != -1) {
        path = path.substr(0, path.lastIndexOf(this.fs.separator));
        console.log("path: " + path);
        var node = this.fs.getNode(this.wd, path);
        console.log(node.getName());
        content = node.getChildrenNames();
      } else {
        console.log(
          "path has no separator, suggesting content of current directory"
        );
        content = this.wd.getChildrenNames(); //.map(n => ' '+n);
        console.log("content: " + content);
      }
      this.suggestions = content;
    }
  }
};
</script>

<style>
#terminal {
  opacity: 0.95;
}
</style>
