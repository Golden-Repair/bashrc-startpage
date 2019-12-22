<template>
  <!-- Prompt & user input -->
  <div>
    <form>
      <input
        id="input_field"
        name="cmd"
        v-model="input"
        v-on:input.prevent="onInput"
        v-on:keydown.9.prevent=""
        v-on:keyup.9.prevent="next"
        v-on:keydown.13.prevent=""
        v-on:keyup.13.prevent="enter"
        type="text"
        autofocus="autofocus"
        autocomplete="off"
      />
    </form>
    <suggestions
      v-bind:suggestions="termSuggestions"
      v-bind:suggestionIndex="index"
      v-bind:show='showSuggestions'
    />
  </div>
</template>

<script>
//import { $, jQuery } from "jquery";
import suggestions from "./suggestions.vue";
import "expose-loader?$!expose-loader?jQuery!jquery";
import easyAutocomplete from "easy-autocomplete";
import { log } from "../logger";

export default {
  name: "promptInput",
  data() {
    return {
      input: "",
      index: 0,
      showSuggestions: false,
    };
  },
  props: {
    termSuggestions: Array
  },
  components: {
    suggestions
  },
  methods: {
    onSubmit(command) {
      this.$emit("submit", $('input[name="cmd"]').val());
      $('input[name="cmd"]').val("");

      //this.input = ''
    },
    onInput(event) {
      this.$emit("input", $('input[name="cmd"]').val());
      this.index = -1;
      //this.currentSuggestion = this.suggestions[0].slice(this.input.length);
    },
    next(event) {
      if(this.termSuggestions.length == 0) return
      if(!this.showSuggestions) {
        this.showSuggestions = true;
        this.index =0;
      } else {
        if(this.termSuggestions.length == 1) {
          this.enter(event);
        }
      this.index = (this.index + 1) % this.termSuggestions.length;
      }
    },
    enter(event) {
      if (this.index == -1) {
        this.$emit("submit", $('input[name="cmd"]').val());
        $('input[name="cmd"]').val("");
      } else {
        var completed_input = this.getCompletedInput(this.input);
        this.input = completed_input.concat(this.termSuggestions[this.index]);
        if(completed_input.length > 0) {
          this.input = this.input.concat("/");
        } else {
          this.input = this.input.concat(" ");
        }
        this.$emit("input", this.input);

        this.index = -1;
        this.showSuggestions = false;
      }
      },
      getCompletedInput(input) {
        var space_ind = input.lastIndexOf(" ");
        var sep_ind = input.lastIndexOf("/");
        var last = space_ind > sep_ind ? space_ind : sep_ind;
        if(last == -1) {
          return ""
        } else {
          return input.substring(0, last+1);
        }
      }

  },
  mounted: function() {},
  computed: {
    input_value: function() {
      return $('input[name="cmd"]').val();
    }
  },
  watch: {
    termSuggestions: function() {
      //this.sugg_obj.suggestions = this.suggestions;
    }
  }
};
</script>

<style>
.form-wrapper {
  width: auto;
  overflow: hidden;
}

#input_field {
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
