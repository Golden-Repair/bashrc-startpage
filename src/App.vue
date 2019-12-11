<template>
  <div id="app">
    <terminal
      v-bind:root="fs.getRoot()"
      v-on:system-call="onCall"
      v-bind:sysCallResults="this.results"
    />
  </div>
</template>

<script>
import terminal from "./components/terminal/terminal";
import { getFileSystem } from "./components/filesystem/filesystem.js";

export default {
  name: "app",
  data() {
    return {
      fs: getFileSystem(),
      results: []
    };
  },
  props: {},
  components: {
    terminal
  },
  methods: {
    onCall: function(wd, call, args) {
      this.results = [];
      //try handling the command
      try {
        this[call](wd, args);
        //not recognized, forward to file system
      } catch (e) {
        try {
          var temp = this.fs[call](wd, args);
          if (!Array.isArray(temp)) {
            temp = [temp];
          }
          this.results = this.results.concat(temp);
        } catch (e1) {
          this.results.push(`bashrc: command not found: ${call}`);
        }
      }
    },
    getRoot() {
      return this.fs.getRoot();
    },
    clear: function(wd, args) {
      this.results = [];
    },
    fetch: function(wd, args) {},
    pwd: function(wd, args) {
      this.results.push(wd.getName());
    },
    echo: function(wd, args) {
      this.results.push(args.join(" "));
    }
  }
};
</script>

<style lang="scss">
:root {
  --cyan: #8fbcbb;
  --dark: #1a1e21;
  --blue: #81a1c1;
  --darkblue: #5e81ac;
  --orange: #d08770;
  --yellow: #ebcb8b;
  --green: #a3be8c;
  --pink: #b48ead;
  --red: #bf616a;
  --white: #d8dee9;
}

html,
body,
.main-screen {
  height: 100%;
  max-height: 100vw;
}
.main-screen {
  padding: 3rem;
}

body {
  color: #ffffff;
  font-size: 20px;
  font-family: "FantasqueSansMonoRegular";
  font-weight: normal;
  font-style: normal;
  background: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
}
</style>
