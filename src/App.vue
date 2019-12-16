<template>
  <div id="app">
    <terminal
      class="floating"
      v-on:system-call="onCall"
      v-on:get-suggestions="suggest"
      v-bind:response="this.term.response"
      v-bind:wd="this.term.wdName"
      v-bind:suggestions="this.term.suggestions"
    />
  </div>
</template>

<script>
import terminal from "./components/terminal/terminal";
import { getFileSystem } from "./components/filesystem/filesystem.js";
import { newResponse } from "./components/response";
import { log } from "./components/logger";

export default {
  name: "app",
  data() {
    return {
      fs: getFileSystem(),
      term: { id: 0, wd: null, wdName: "", response: {}, suggestions: [] }
    };
  },
  props: {},
  components: {
    terminal
  },
  computed: {},
  beforeMount: function() {
    this.term.wd = this.fs.getRoot();
    this.term.wdName = this.term.wd.getName();
  },
  methods: {
    onCall: function(call, args) {
      this.term.response = {};
      //try handling the command
      log('call', call, 'red')
      if (this.api().indexOf(call) != -1) {
        try {
          this.term.response = this[call](args);
          return
          //not recognized, forward to file system
        } catch (e) {}
      }
      try {
        var res = this.fs[call](this.term.wd, args);
        if (typeof res == "undefined") {
          return;
        }
        if (res.directory == null) {
          this.term.response = res;
        } else {
          this.term.wd = res.directory;
          this.term.wdName = res.directory.getName();
        }
      } catch (e) {
        var res = newResponse();
        res.messages.push({
          type: "error",
          value: `bashrc: command not found: ${call}`
        });
        this.term.response = res;
      }
    },
    suggest: function(input) {
      var content;
      //input contains a space, suggesting that the user has already typed a command and
      //is now typing the arguments
      if (input.indexOf(" ") != -1) {
        log("input", input, "green");
        var command = input.split(" ")[0] + " ";
        var arg_dir = input.split(" ").splice(1)[0];
        log("command", command);
        log("path", arg_dir);
        // input path contains a separator, search suggestions in last directory of path
        if (arg_dir.indexOf(this.fs.separator) != -1) {
          arg_dir = arg_dir.substr(0, arg_dir.lastIndexOf(this.fs.separator));
          console.log("arg_dir: " + arg_dir);
          var node = this.fs.getNode(this.term.wd, arg_dir);
          console.log(node.getName());
          content = node.getChildrenNames().map(n => command.concat(n));
        } else {
          console.log(
            "arg dir has no separator, suggesting content of current directory"
          );
          content = this.term.wd.getChildrenNames(); //.map(n => ' '+n);
          console.log("content: " + content);
        }
        this.term.suggestions = content;
      } else {
        log("input", input, "green");
        // User has not yet typed a space -> suggest commands or files to open
        var my_functions = this.api();
        var fs_functions = this.fs.api();
        var files = this.term.wd.getFileNames();
        this.term.suggestions = my_functions.concat(files).concat(fs_functions);
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
    },
    getRoot() {
      var res = newResponse();
      res.messages.push({ type: "value", value: this.fs.getRoot() });
      return res;
    },
    open: function(args) {
      log("open", args);
      var res = newResponse();
      if (!args[0]) {
        res.messages.push({ type: "error", value: `open: missing operand` });
        return res;
      }
      var file = this.fs.getNode(this.term.wd, args);

      if (!file) {
        res.messages.push({
          type: "error",
          value: `open: cannot open '${args[0]}': No such file or directory`
        });
        return res;
      }
      if (!file.url) {
        this.term.wd = this.fs.cd(this.term.wd, args);
        this.term.wdName = this.term.wd.getName();
      } else {
        window.location = file.url;
      }
    },
    clear: function(args) {
      return newResponse();
    },
    fetch: function(args) {},
    pwd: function(args) {
      var res = newResponse();
      res.messages.push({ type: "value", value: this.term.wd.getName() });
      return res;
    },
    echo: function(args) {
      var res = newResponse();
      res.messages.push({ type: "value", value: args.join(" ") });
      return res;
    },
    api: function() {
      return ["clear", "fetch", "pwd", "echo", "open"];
    }
  }
};
</script>

<style lang="scss">
.floating {
  height: 400px;
  width: 600px;
  margin: auto;
  margin-top: 10%;
}

.fullscreen {
  height: 100%;
  width: 100%;
}
</style>
