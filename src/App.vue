<template>
  <div id="app">
    <terminal
      v-on:system-call="onCall"
      v-bind:response="this.term.response"
      v-bind:wd="this.term.wdName"
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
      term: { id: 0, wd: null, wdName: "", response: [] }
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
      this.term.response = [];
      //try handling the command
      try {
        this.term.response = this[call](args);
        //not recognized, forward to file system
      } catch (e) {
        try {
          var res = this.fs[call](this.term.wd, args);
          if (typeof res == 'undefined') {
            return;
          }
            if (Array.isArray(res)) {
              this.term.response = res;
            } else if (typeof res == 'string') { 
              this.term.response = [res]
            } else {
              this.term.wd = res;
              this.term.wdName = res.getName();
            }
          
        } catch (e1) {
          this.term.response = [`bashrc: command not found: ${call}`];
        }
      }
    },
    getRoot() {
      return this.fs.getRoot();
    },
    clear: function(args) {
      return [];
    },
    fetch: function(args) {},
    pwd: function(args) {
      return [this.term.wd.getName()];
    },
    echo: function(args) {
      return [args.join(" ")];
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
