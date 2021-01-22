<template>
  <div class="draggable"
    v-on:mousedown.left="dragStart"
    v-on:mouseup.left="dragEnd"
      @contextmenu.prevent.stop
    v-on:mousedown.right="resizeStart"
    v-on:mouseup.right="resizeEnd"
    :class="draggable ? 'active' : 'inactive'"
  >
  <slot name='application'></slot>
  </div>
</template>

<script>

export default {
  name: "window",
  data: function() {
    return {
            startX: 0,
            startY: 0,
    }

  },
  props: {
    draggable: Boolean,
  },
  watch: {
   
  },
  methods: {
   dragStart: function(e) {
     if (!this.draggable) return;
       if(!e.ctrlKey) return;
       this.startX = e.clientX;
       this.startY = e.clientY;
       this.$emit('dragStart', {x: this.startX, y: this.startY})    
       var wm = this;
       window.onmousemove = function (event) {
            wm.$emit('input', {left: event.movementX, top: event.movementY, component: wm.component, type: 'drag'})
       }
   },
   dragEnd: function(e) {
          if (!this.draggable) return;
               window.onmousemove = function (event) {
       }
   },
   resizeStart: function(e) {
    if(!this.draggable || !e.ctrlKey) return;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.$emit('resizeStart', {x: this.startX, y: this.startY})    
    var wm = this;
    window.onmousemove = function (event) {
        wm.$emit('input', {left: event.movementX, top: event.movementY, component: wm.component, type: 'resize'})
    }
  },
  resizeEnd: function(e) {
    if (!this.draggable) return;
    window.onmousemove = function (event) {
       }
  },
   
  },
};
</script>

<style>

.inactive {
  position: relative;
}

.active {

}

</style>
