<template>
  <div id="console">
    <prompt
      v-on:input="onCommand"
      v-on:submit="onCommandSubmit"
      v-bind:wd="this.wd"
      v-bind:suggestions="this.suggestions"
    />
    <term-out 
    v-bind:out="this.out"
    v-on:cd="onCommandSubmit"/>
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
    response: Object,
    wd: String,
    suggestions: Array
  },
  watch: {
    response: function(newResponse, oldVal) {
      this.out.dirs = newResponse.dirs;
      this.out.files = newResponse.files;
      this.out.messages = newResponse.messages
    },
    suggestions: function(newSuggestions, oldVal) {
    }
  },
  data: function() {
    return {
      out: {"dirs": [], "files": [], "messages": []}
    };
  },
  computed: {
    wdName() {
      return this.wd.getName(y);
    }
  },

  methods: {
    locate: function(args) {
      if (args[0]) {
        window.open("https://duckduckgo.com/" + args.join(" "));
      } else {
        return "Please enter a valid search query";
      }
    },

    onCommand: function(input) {
      this.$emit("get-suggestions", input)
    },
    onCommandSubmit: function(com) {
      this.out = {"dirs": [], "files": [], "messages": []};
      var c = com.split(" ")[0];
      var args = com.split(" ").slice(1);
      try {
        this[c](args);
      } catch (e) {
        this.$emit("system-call", c, args);
      }
    }
  }
};
</script>

<style>
#console {
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}
</style>
