<template>
  <div id="console">
    <prompt
      v-on:input="onCommand"
      v-on:submit="onCommandSubmit"
      v-bind:wd="wd.getPath()"
    />
    <term-out v-bind:results="sysCallResults" />
  </div>
</template>
<script>

import prompt from "./prompt.vue";
import termOut from "./term-out.vue";

export default {
  name: "terminal",
  components: {
    prompt,
    termOut
  },
    props: {
      root: Object,
      sysCallResults: Array
  },
  data: function() {
    return {
      wd : this.root,
      results: []
    };
  },

  methods: {
    locate: function(args) {
      if (args[0]) {
        window.open("https://duckduckgo.com/" + args.join(" "));
      } else {
        return "Please enter a valid search query";
      }
    },

    onCommand: function(command) {
    },
    onCommandSubmit: function(com) {
      this.results = [];
      var c = com.split(" ")[0];
      var args = com.split(" ").slice(1);
      try {
      this[c](args);
      } catch (e) {
          this.$emit('system-call',this.wd,c,args);
          this.results = this.results.concat(this.sysCallResults);
      }
    }
  }
};
</script>

<style>
#console {
  height: 100%;
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}
</style>
