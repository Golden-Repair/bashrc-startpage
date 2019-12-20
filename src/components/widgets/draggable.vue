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
  },
  watch: {
   
  },
  methods: {
   dragStart: function(e) {
       log('dragstart', e.shiftKey)
       if(!e.shiftKey) return;
       this.startX = e.clientX;
       this.startY = e.clientY;
       this.$emit('dragStart', {x: this.startX, y: this.startY})    
       var wm = this;
       window.onmousemove = function (event) {
           log('x drag', event.clientX - wm.startX)
            wm.$emit('input', {left: event.clientX - wm.startX, top: event.clientY - wm.startY})
       }

   },
   dragEnd: function(e) {
        log('dragend', e.shiftKey)
               window.onmousemove = function (event) {
       }

        if(!e.shiftKey) return;
   },
   
  },
  computed: {},
  mounted: function(){
  }
};
</script>

<style>

</style>
