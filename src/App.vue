<template>
  <div id="app" :class="$store.state.config.windowState">
    <Window
      v-for="app in $store.state.config.apps.filter((a) => a.visible)"
      :key="app.name"
      :id="app.name"
      :style="getPositionStyle(app)"
      :draggable="config.windowState === 'floating'"
      :name="app.name"
      v-on:input="setDrag"
      v-on:dragEnd="dragEnd"
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
    </Window>

    <settingsIcon id="settingsIcon" ref="settingsIcon"></settingsIcon>
    <settings></settings>
  </div>
</template>

<script>
import terminal from "./components/terminal/terminal";
import filemanager from "./components/filemanager/filemanager";
import weather from "./components/widgets/weather";
import todo from "./components/widgets/todo";
import Window from "./components/widgets/window";
import settings from "./components/settings/settings";
import settingsIcon from "./components/settings/settingsIcon";

export default {
  name: "app",
  data() {
    return {
      config: {},
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
    Window,
  },
  created: async function () {
    await this.$store.dispatch("loadConfig");
    this.config = this.$store.state.config;
    await this.$store.dispatch("loadFileTree");
    console.log(this.$store.state.config.apps.filter((a) => a.visible));
  },
  computed: {},
  mounted: function () {},
  watch: {
    drag: function (drag) {
      if (this.config.windowState != "floating") return;
      if (drag.type == "resize") {
        let app = this.config.apps.find((a) => a.name === drag.component);
        app.dimensions.width += drag.left;
        app.dimensions.height += drag.top;
        $(`#${drag.component}`).css("width", app.dimensions.width);
        $(`#${drag.component}`).css("height", app.dimensions.height);
      } else {
        console.log("updating position for: " + drag.component);
        let app = this.config.apps.find((a) => a.name === drag.component);
        var prevOffset = $(`#${drag.component}`).offset();
        let new_x = Math.min(
          Math.max(0, prevOffset.left + drag.left),
          window.innerWidth - app.dimensions.width
        );
        let new_y = Math.min(
          Math.max(0, prevOffset.top + drag.top),
          window.innerHeight - app.dimensions.height
        );
        app.position = {
          top: new_y,
          left: new_x,
        };
        //this.config.apps.find()[drag.component].left =
        //his.config.appPositions[drag.component].top =
        $(`#${drag.component}`).offset({
          left: new_x,
          top: new_y,
        });
      }
    },
  },
  methods: {
    getPositionStyle(app) {
      return `top: ${app.position.top}px; left: ${app.position.left}px; height: ${app.dimensions.height}px; width: ${app.dimensions.width}px`;
    },
    setClickPos: function (pos) {
      this.clickPos = pos;
    },
    setDrag(drag) {
      console.log(drag);
      this.drag = drag;
    },
    dragEnd() {
      this.$store.dispatch("updateConfig", this.config);
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
