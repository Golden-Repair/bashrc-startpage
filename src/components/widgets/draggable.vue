<template>
  <div class="draggable"
    v-on:mousedown="dragStart"
    v-on:mouseup="dragEnd"
  >
  <slot name='application'></slot>
  </div>
</template>

<script>
import { log } from "../logger";

export default {
  name: "draggable",
  data: function() {
    return {
            active: false,
            startX: 0,
            startY: 0,
        
    }

  },
  props: {
    component: String,
  },
  watch: {
   
  },
  methods: {
   dragStart: function(e) {
       if(!e.shiftKey) return;
       this.startX = e.clientX;
       this.startY = e.clientY;
       this.$emit('dragStart', {x: this.startX, y: this.startY})    
       var wm = this;
       window.onmousemove = function (event) {
            wm.$emit('input', {left: event.movementX, top: event.movementY, component: wm.component})
       }

   },
   dragEnd: function(e) {
               window.onmousemove = function (event) {
       }
   },
   
  },
  computed: {},
  mounted: function(){
  }
};
</script>

<style>

</style>
