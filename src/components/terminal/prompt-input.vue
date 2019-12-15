<template>
  <!-- Prompt & user input -->
  <form v-on:submit.prevent="onSubmit">
    <input
      id="input_field"
      name="cmd"
      v-model="input"
      v-on:input.prevent="onInput"
      type="text"
      autofocus="autofocus"
      autocomplete="off"
    />
  </form>
</template>



<script>
import tabcomplete from "../autocompletion/commandCompletion";
import $ from "jquery";

export default {
  name: "promptInput",
  data() {
    return {
      input: "",
      currentSuggestion: "",
      sugg_obj: { suggestions: ["test", "lol"] }
    };
  },
  props: {
    suggestions: Array
  },
  components: {},
  methods: {
    onSubmit(command) {
      this.$emit("submit",$('input[name="cmd"]').val());
        $('input[name="cmd"]').val("");

      //this.input = ''
    },
    onInput(event) {
      this.$emit("input",$('input[name="cmd"]').val());
      //this.currentSuggestion = this.suggestions[0].slice(this.input.length);
    }
  },
  mounted: function() {
    $('input[name="cmd"]').tabcomplete(this.sugg_obj);
  },
  computed: {
    input_value: function() {
      return $('input[name="cmd"]').val();
    }
  },
  watch: {
      suggestions: function() {
                this.sugg_obj.suggestions = this.suggestions;
                console.log("got new suggestions: "+this.suggestions)
      }
  }
};
</script>

<style>
.form-wrapper {
  width: auto;
  overflow: hidden;
}

input {
  width: 100%;
  outline: none !important;
  background: none;
  border: none;
  color: #fff;
  font-size: 1em;
}

form {
  display: inline;
}
</style>