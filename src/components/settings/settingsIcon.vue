<template>
  <div>
    <span v-on:click="$emit('click')" class="settings-icon"
      ><i class="fas fa-cog"></i
    ></span>
  </div>
</template>

<script>
import { log } from "../logger";

export default {
  name: "settingsIcon",
  data: function() {
    return {};
  },
  props: {},
  watch: {},
  methods: {},
  computed: {}
};
</script>

<style>
.settings-icon {
  font-size: 1rem;
  padding: 1rem;
  background-color: var(--dark);
  color: var(--white);
  align-items: center;
border-radius: 0 6px 0 0;

}
</style>
