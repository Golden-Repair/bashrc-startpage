<template>
  <div id="app">
    <terminal
      class="floating"
      v-bind:fs="this.fs"
    />
  </div>
</template>

<script>
import terminal from "./components/terminal/terminal";
import { getFileSystem } from "./components/filesystem/filesystem.js";
import { newResponse } from "./components/response";
import { log } from "./components/logger";

export default {
  name: "app",
  data() {
    return {
      fs: getFileSystem(),
    };
  },
  props: {},
  components: {
    terminal
  },
  methods: {
    suggest: function(input) {
      
    },

  }
};
</script>

<style lang="scss">
.floating {
  height: 400px;
  width: 600px;
  margin: auto;
  margin-top: 10%;
}

.fullscreen {
  height: 100%;
  width: 100%;
}
</style>
