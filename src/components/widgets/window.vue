<template>
  <div class="draggable">
    <div class="drag-bar"></div>
    <div class="center">
      <div class="drag-bar h"></div>
      <div class="application">
        <slot name="application"></slot>
      </div>
      <div class="drag-bar h"></div>
    </div>

    <div class="drag-bar"></div>
  </div>
</template>

<script>
export default {
  name: "window",
  components: {},
  data: function () {
    return {
      startX: 0,
      startY: 0,
      updatedPosition: this.position,
      updatedDimensions: this.dimensions,
    };
  },
  props: {
    draggable: Boolean,
    dimensions: Object,
    position: Object,
    name: String,
    applicationName: String,
  },
  methods: {},
};
</script>

<style>
.application {
  width: calc(100% - 4rem);
  height: 100%;
}

.active {
}
.drag-bar {
  height: 2rem;
  width: 100%;
}
.center {
  display: flex;
  height: calc(100% - 4rem);
}
.drag-bar.h {
  width: 2rem;
  height: 100%;
}
.draggable {
  background-color: var(--bg-opaque);
  transition: 0.3s ease-in-out;
  width: calc(100%);
  height: calc(100%);
  box-sizing: border-box;
}
.draggable.border {
  border: 3px solid var(--accent_1);
}
</style>
