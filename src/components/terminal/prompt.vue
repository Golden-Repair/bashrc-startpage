<template>
  <!-- Prompt & user input -->
  <div class="prompt-line">
    <div class="prompt-wrapper">
      <prompt-decoration/>
      <working-directory v-bind:wd="wd" />
    </div>
    <div class="form-wrapper">
      <prompt-input
        v-on:input="onInput"
        v-on:submit="onSubmit"
        v-model="command"
        v-bind:termSuggestions="suggestions"
      />
    </div>
  </div>
</template>

<script>
import promptDecoration from "./prompt-decoration.vue";
import promptInput from "./prompt-input.vue";
import workingDirectory from "./working-directory.vue";
import { log } from "../logger";

export default {
  name: "prompt",
  components: {
    promptDecoration,
    workingDirectory,
    promptInput
  },
  data: function() {
    return {
        command: '',
    }
  },
  props: {
      wd: String,
      suggestions: Array
  },
  watch: {
  },
  methods: {
    onInput: function(value) {
      this.$emit("input", value);
    },
    onSubmit: function(value) {
      log('prompt: got input', value)
      this.$emit("submit", value);
    },
  },
};
</script>

<style>
.prompt-line {
  margin-bottom: 1rem;
}
.prompt-wrapper {
  float: left;
  margin-right: 1rem;
}
</style>
