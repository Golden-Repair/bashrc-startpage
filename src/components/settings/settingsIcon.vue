<template>
  <div class="settings-button" :class="{ open: open }">
    <span v-on:click="$emit('click')" class="settings-icon"
      ><i class="fas fa-cog"></i
    ></span>
  </div>
</template>

<script>
export default {
  name: "settingsIcon",
  data: function () {
    return {};
  },
  props: {
    open: Boolean,
  },
  watch: {},
  methods: {},
  computed: {},
};
</script>

<style>
.settings-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  display: flex;
  cursor: pointer;

  transition: 0.3s ease-in-out;
}
.settings-button.open .settings-icon i {
  transform: rotate(180deg);
}
.settings-icon i {
  transition: 0.3s ease-in-out;
}
.settings-icon {
  border-radius: 50%;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  font-size: 1rem;
  padding: 1rem;
  background-color: var(--bg);
  color: var(--fg);
  align-items: center;
  transition: 0.3s ease-in-out;
}
</style>
