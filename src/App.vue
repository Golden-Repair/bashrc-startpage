<template>
  <div id="app" :style="userStyle">
    <div id="screen" :class="$store.state.config.windowState">
      <vue-resizable
        :dragSelector="'.drag-bar'"
        :width="app.dimensions.width"
        :height="app.dimensions.height"
        :left="app.position.left"
        :top="app.position.top"
        v-for="app in this.config.apps.filter((a) => a.visible)"
        :key="app.name"
        :handlers="['r', 'rb', 'b', 'lb', 'l', 'lt', 't', 'rt']"
        @resize:end="handleDragEnd(app.name, $event)"
        @drag:end="handleDragEnd(app.name, $event)"
      >
        <Window
          :id="app.name"
          :ref="app.name"
          :position="app.position"
          :dimensions="app.dimensions"
          :applicationName="app.name"
          :draggable="config.windowState === 'floating'"
          :name="app.name"
          :class="{ border: config.windowBorders }"
        >
          <div slot="application" class="application-wrapper">
            <filemanager
              class="application"
              v-if="app.name === 'filemanager'"
            ></filemanager>
            <terminal
              class="application"
              v-if="app.name === 'terminal'"
            ></terminal>
            <weather
              :city="config.city"
              class="application"
              v-if="app.name === 'weather'"
            />
            <todo class="application" v-if="app.name === 'todo'"> </todo>
          </div>
        </Window>
      </vue-resizable>

      <settingsIcon
        v-on:click="settingsOpen = !settingsOpen"
        :open="settingsOpen"
      ></settingsIcon>
      <settings :open="settingsOpen"> </settings>
    </div>
  </div>
</template>

<script>
import VueResizable from "vue-resizable";

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
      config: {
        apps: [],
        city: "Zurich",
        windowState: "floating",
        windowBorders: false,
        backgroundImage: "",
        colors: {
          fg: "#d8dee9",
          bg: "#1a1e21",
          accent_1: "#8fbcbb",
          accent_2: "#bf616a",
          accent_3: "#ebcb8b",
        },
        opacity: 1,
        numCols: 1,
      },
      settingsOpen: false,
      clickPos: { x: 0, y: 0 },
      settingsOpen: false,
    };
  },
  props: {},
  components: {
    VueResizable,

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
    this.config.apps.forEach((app) => {
      app.position.left = Math.min(
        Math.max(0, app.position.left),
        window.innerWidth - app.dimensions.width
      );
      app.position.top = Math.min(
        Math.max(0, app.position.top),
        window.innerHeight - app.dimensions.height
      );
    });
    await this.$store.dispatch("updateConfig", this.config);
    this.$root.$emit("configReady");

    await this.$store.dispatch("loadFileTree");
    console.log(this.$store.state.config.apps.filter((a) => a.visible));
  },
  computed: {
    userStyle() {
      return this.config.colors
        ? {
            "--fg": this.config.colors.fg,
            "--bg": this.config.colors.bg,
            "--accent_1": this.config.colors.accent_1,
            "--accent_2": this.config.colors.accent_2,
            "--accent_3": this.config.colors.accent_3,
            "--bg-opaque": this.buildRGBA(
              this.config.colors.bg,
              this.config.opacity
            ),
            "background-image": `url(${this.config.backgroundImage})`,
          }
        : {};
    },
  },
  mounted: function () {},
  watch: {
    config() {},
  },
  methods: {
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },
    buildRGBA(hex, opacity) {
      let rgb = this.hexToRgb(hex);
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
    },
    handleDragEnd(appName, event) {
      let app = this.config.apps.find((app) => app.name === appName);
      app.position = {
        top: event.top,
        left: event.left,
      };
      app.dimensions = {
        height: event.height,
        width: event.width,
      };
      this.$store.dispatch("updateConfig", this.config);
    },
    setClickPos: function (pos) {
      this.clickPos = pos;
    },
  },
};
</script>

<style lang="scss">
#app {
  height: calc(100% - 2rem);
  width: calc(100% - 2rem);
  color: var(--fg);
  padding: 1rem;
}
#screen {
  height: 100%;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fit, minmax(250px, 1fr));
}

#screen.tiled {
  display: grid;
  grid-gap: 1rem;
}
#screen.tiled .resizable-component {
  position: relative;
  top: unset !important;
  left: unset !important;
  width: unset !important;
  height: unset !important;
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

.fullscreen {
  height: 100%;
  width: 100%;
}
</style>
