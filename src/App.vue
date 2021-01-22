<template>
  <div id="app" :class="$store.state.config.windowState">
    <window
      v-for="app in $store.state.config.apps.filter((a) => a.visible)"
      :key="app.name"
      :style="getPositionStyle(app)"
    >
      <div slot="application" class="application-wrapper">
        <filemanager
          class="application"
          v-if="app.name === 'filemanager'"
        ></filemanager>
        <terminal class="application" v-if="app.name === 'terminal'"></terminal>
        <weather class="application" v-if="app.name === 'weather'" />
        <todo class="application" v-if="app.name === 'todo'"> </todo>
      </div>
    </window>
    <!--
    <settingsIcon
      id="settingsIcon"
      ref="settingsIcon"
    ></settingsIcon>
    <settings
    ></settings>
    -->
  </div>
</template>

<script>
import terminal from "./components/terminal/terminal";
import filemanager from "./components/filemanager/filemanager";
import weather from "./components/widgets/weather";
import todo from "./components/widgets/todo";
import window from "./components/widgets/window";
import settings from "./components/settings/settings";
import settingsIcon from "./components/settings/settingsIcon";
import { log } from "./components/logger";

export default {
  name: "app",
  data() {
    return {
      settingsOpen: false,
      drag: { left: 0, top: 0, component: "" },
      clickPos: { x: 0, y: 0 },
    };
  },
  props: {},
  components: {
    terminal,
    filemanager,
    settings,
    settingsIcon,
    weather,
    todo,
    window,
  },
  created: async function () {
    await this.$store.dispatch("loadConfig");
    await this.$store.dispatch("loadFileTree");
    console.log(this.$store.state.config.apps.filter(a => a.visible));
  },
  mounted: function () {},
  watch: {
    drag: function (drag) {
      if (this.config.state != "floating") return;
      if (drag.type == "resize") {
        this.config.appPositions[drag.component].width += drag.left;
        this.config.appPositions[drag.component].height += drag.top;
        $(`#${drag.component}`).css(
          "width",
          this.config.appPositions[drag.component].width
        );
        $(`#${drag.component}`).css(
          "height",
          this.config.appPositions[drag.component].height
        );
      } else {
        var prevOffset = $(`#${drag.component}`).offset();

        this.config.appPositions[drag.component].left = Math.max(
          0,
          prevOffset.left + drag.left
        );
        this.config.appPositions[drag.component].top = Math.max(
          0,
          prevOffset.top + drag.top
        );
        $(`#${drag.component}`).offset({
          left: this.config.appPositions[drag.component].left,
          top: this.config.appPositions[drag.component].top,
        });
      }
      this.storeConfig();
    },
  },
  methods: {
    getPositionStyle(app) {
      return `top: ${app.position.top}px; left: ${app.position.left}px; height: ${app.dimensions.height}px; width: ${app.dimensions.width}px`;
    },
    setClickPos: function (pos) {
      this.clickPos = pos;
    },
  },
};
</script>

<style lang="scss">
#app {
  flex-grow: 1;
  margin: 1rem;
  grid-template-rows: repeat(auto-fit, minmax(400px, 1fr));
}

*:focus {
  outline: none;
}

.application-wrapper {
  width: 100%;
  height: 100%;
}

.application {
  width: 100%;
  height: 100%;
}

.floating .draggable {
  position: absolute;
}

.draggable {
  padding: 5rem;
  background-color: var(--dark);
}

.fullscreen {
  height: 100%;
  width: 100%;
}

.tiled {
  display: grid;
  grid-gap: 1rem;
}

#settingsIcon {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  transition: 1s ease-in-out;
  z-index: 1;
}

#settingsIcon i {
  transition: 0.1s ease-in;
}

.open i {
  transform: rotate(360deg);
}

#settings {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
