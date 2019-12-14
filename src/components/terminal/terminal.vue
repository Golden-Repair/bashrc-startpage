<template>
  <div id="console">
    <prompt
      v-on:input="onCommand"
      v-on:submit="onCommandSubmit"
      v-bind:wd="this.wd"
    />
    <term-out v-bind:out="this.out" />
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
    response: Array,
    wd: String
  },
  watch: {
    response: function(newVal, oldVal) {
      if (newVal != 0 && newVal.length > 0) {
        this.out = this.out.concat(newVal);
      }
    }
  },
  data: function() {
    return {
      out: []
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

    onCommand: function(command) {},
    onCommandSubmit: function(com) {
      this.out = [];
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
  height: 100%;
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}
</style>
