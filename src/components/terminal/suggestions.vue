<template>
  <ul id="suggestions" v-if="show">
    <li
    v-for="(sug, index) in this.suggestions"
    v-bind:class="{active: index == suggestionIndex}" 
    v-bind:key=index 
    v-on:click="$emit('select', sug)" 
    class="suggestion"
    >{{sug}}</li>
  </ul>
</template>

<script>

import { $, jQuery } from "jquery";
import { log } from "../logger";

export default {
  name: "suggestions",
  data() {
    return {
    };
  },
  props: {
    suggestions: Array,
    suggestionIndex: Number,
    show: Boolean
  },
  components: {},
  methods: {
      next: function (){
          this.suggestionIndex += 1
      }
  },
  mounted: function() {},
  computed: {},
  watch: {
    suggestions: function(newVal, oldVal) {
      log("suggestions: got new suggestions", this.suggestions, 'blue');
    },
    suggestionIndex: function (newVal, oldVal) {
        log('suggestions: next suggestion', this.suggestionIndex, 'blue')
    }
  }
};
</script>

<style>

li {
    list-style: none;
}

#suggestions {
      /* Old Chrome, Safari, Opera */
  -webkit-column-count: 3; 
  -webkit-column-width: 100px;
    
  /* Old Firefox */
  -moz-column-count: 3;
  -moz-column-width: 100px;

  /* Statndard syntax */
  column-count: 3;
  column-width: 100px;

  padding-left: 0;
}

.active {
    background-color: var(--pink);
    color: var(--dark)
}

</style>
