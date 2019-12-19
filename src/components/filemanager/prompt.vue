<template>
    <div v-on:submit="onSubmit">
        <span class='label'>{{label}}</span>
        <input ref="input" v-model="input" 
                v-on:keydown.13.prevent="onSubmit" :type="type" :placeholder="placeholder" id="value"/>
    </div>
</template>

<script>

import { log } from "../logger";


export default {
  name: "prompt",
  data: function() {
    return {
        input: ''
    };
  },
  props: {
      label: String,
      type: String,
      placeholder: String,
  },
  watch: {
      inputs: function(newVal, oldVal) {
      }
  },
  methods: {
      onSubmit: function(){
          this.$emit('submit', this.input);
          this.input = '';
      }
  },
  computed: {
      elements: function() {
          return this.inputs;
      }
    },
    mounted: function(){
        this.$refs.input.focus();
    }
}
</script>

<style>

.row {
    width: 100%;
}

.prompt {
    margin: auto;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    background-color: var(--dark);
    border: 2px solid var(--pink);
    border:
}

.label {
    width: 50px;
    background-color: var(--green);
    color: var(--dark);

}
input {
    background-color: var(--dark);
    border: none;
    margin-left: 0;
    color: var(--white);
}
.title {
    height: 40px;
    width: 100%;
    margin-bottom: 0.3rem;
    text-align: center;
    background-color: var(--pink);
    color: var(--dark);
    font-size: 2rem; 
}
#text {
    display : none;
}

</style>