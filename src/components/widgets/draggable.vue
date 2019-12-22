<template>
  <div class="draggable"
    v-on:mousedown="dragStart"
    v-on:mouseup="dragEnd"
    :class="active ? 'active' : 'inactive'"
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
            startX: 0,
            startY: 0,
        
    }

  },
  props: {
    component: String,
    active: Boolean,
  },
  watch: {
   
  },
  methods: {
   dragStart: function(e) {
     if (!this.active) return;
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
          if (!this.active) return;

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

.inactive {
  position: relative;
}

.active {

}

</style>
