<template>
  <!-- Prompt & user input -->
  <div class="prompt-line">
    <div class="prompt-wrapper">
      <prompt-decoration/>
      <working-directory v-bind:wd="wd" />
    </div>
    <div class="form-wrapper">
      <prompt-input
        v-on:input="$emit('input', command)"
        v-on:submit="$emit('submit', command)"
        v-model="command"
      />
    </div>
  </div>
</template>

<script>
import promptDecoration from "./prompt-decoration.vue";
import promptInput from "./prompt-input.vue";
import workingDirectory from "./working-directory.vue";

export default {
  name: "prompt",
  components: {
    promptDecoration,
    workingDirectory,
    promptInput
  },
  data: function() {
    return {
        command: ''
    }
  },
  props: {
      wd: String,
  }
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
