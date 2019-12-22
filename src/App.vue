<template>
  <div id="app" :class="config.state">
    <draggable
      ref="fmDrag"
      v-bind:style="{ opacity: this.ready ? 1 : 0 }"
      v-bind:active="this.config.state == 'floating' ? true : false"
      id="fmDrag"
      component="fmDrag"
      v-model="drag"
      v-on:dragStart="setClickPos"
      v-if="this.config.activeApps.indexOf('fm') != -1"
    >
      <div slot="application" class="application-wrapper">
        <filemanager
          class="application"
          id="filemanager"
          v-bind:fs="this.fs"
        ></filemanager>
      </div>
    </draggable>

    <draggable
      v-bind:style="{ opacity: this.ready ? 1 : 0 }"
            v-bind:active="this.config.state == 'floating' ? true : false"

      id="termDrag"
      component="termDrag"
      v-model="drag"
      v-on:dragStart="setClickPos"
      v-if="this.config.activeApps.indexOf('term') != -1"
    >
      <div slot="application" class="application-wrapper">
        <terminal class="application" id="terminal" v-bind:fs="this.fs" />
      </div>
    </draggable>
    <draggable
      v-bind:style="{ opacity: this.ready ? 1 : 0 }"
            v-bind:active="this.config.state == 'floating' ? true : false"

      id="weatherDrag"
      component="weatherDrag"
      v-model="drag"
      v-on:dragStart="setClickPos"
      v-if="this.config.activeApps.indexOf('weather') != -1"
    >
      <div slot="application" class="application-wrapper">
        <weather
          class="application"
          id="weather"
          v-bind:city="this.config.city"
        />
      </div>
    </draggable>
    <draggable
      v-bind:style="{ opacity: this.ready ? 1 : 0 }"
            v-bind:active="this.config.state == 'floating' ? true : false"

      id="todoDrag"
      component="todoDrag"
      v-model="drag"
      v-on:dragStart="setClickPos"
      v-if="this.config.activeApps.indexOf('todo') != -1"
    >
      <div slot="application" class="application-wrapper">
        <todo class="application" id="todo"> </todo>
      </div>
    </draggable>
    <settingsIcon
      v-on:click="toggleSettings"
      id="settingsIcon"
      ref="settingsIcon"
    ></settingsIcon>
    <settings
      v-on:appsChanged="buildApps"
      v-on:cityChanged="setCity"
      v-on:stateChanged="setState"
      id="settings"
      ref="settings"
    ></settings>
  </div>
</template>

<script>
import $ from "jquery";
import terminal from "./components/terminal/terminal";
import filemanager from "./components/filemanager/filemanager";
import weather from "./components/widgets/weather";
import todo from "./components/widgets/todo";
import draggable from "./components/widgets/draggable";
import settings from "./components/settings/settings";
import settingsIcon from "./components/settings/settingsIcon";
import { getFileSystem } from "./components/filesystem/filesystem.js";
import { newResponse } from "./components/response";
import { log } from "./components/logger";

export default {
  name: "app",
  data() {
    return {
      fm: "filemanager",
      fs: getFileSystem(),
      settingsOpen: false,
      config: {
        activeApps: [],
        city: "",
        state: "floating",
        appPositions: {
          fmDrag: { left: 50, top: 20, width: 300, height: 200 },
          termDrag: { left: 100, top: 500, width: 300, height: 200 },
          todoDrag: { left: 900, top: 420, width: 500, height: 220 },
          weatherDrag: { left: 900, top: 20, width: 300, height: 250 }
        }
      },
      drag: { left: 0, top: 0, component: "" },
      clickPos: { x: 0, y: 0 },
      ready: false
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
    draggable
  },
  created: function() {
    this.getConfig();
    var wm = this;
    setTimeout(function() {
      wm.restoreApplicationDimensions();
      wm.ready = true;
    }, 100);
  },
  mounted: function() {},
  watch: {
    drag: function(drag, oldPos) {
      if (this.config.state == 'floating');
      log("component", drag.component, "blue");
      var prevOffset = $(`#${drag.component}`).offset();
      $(`#${drag.component}`).offset({
        left: prevOffset.left + drag.left,
        top: prevOffset.top + drag.top
      });
      this.config.appPositions[drag.component].left =
        prevOffset.left + drag.left;
      this.config.appPositions[drag.component].top = prevOffset.top + drag.top;
      this.storeConfig();
    },
    config: function(newConfig, oldConfig) {
      if (newConfig.activeApps.length != oldConfig.activeApps.length) {
      }
    }
  },
  methods: {
    restoreApplicationDimensions: function() {
      var wm = this;
      for (var app in this.config.appPositions) {
        this.setDimensions(app);
      }
    },
    setDimensions: function(element) {
      log("element", element);
      if (this.config.state == "floating") {
        console.log($("#termDrag").offset());
        log("stored offset", this.config.appPositions[element].left);
        $(`#${element}`).offset({
          left: this.config.appPositions[element].left,
          top: this.config.appPositions[element].top
        });
        $(`#${element}`).css(
          "height",
          this.config.appPositions[element].height
        );
        $(`#${element}`).css(
          "width",
          this.config.appPositions[element].width
        );
      } else {
        log('state','tiled', 'red')
        $(`#${element}`).offset({
          left: '0',
          top: '0',
        });
        $(`.tiled #${element}`).css(
          "height", 'unset');
        $(`.tiled #${element}`).css(
          "width",'unset');
      }
    },
    blendIn: function(element) {
      $(`#${element}`).css("opacity", 1);
    },
    setClickPos: function(pos) {
      this.clickPos = pos;
    },
    toggleSettings: function() {
      this.settingsOpen = !this.settingsOpen;
      log("settings open", this.settingsOpen);
      var settings_height = 0;
      if (this.settingsOpen) {
        this.openSettings();
      } else {
        this.closeSettings();
      }
    },
    openSettings: function() {
      $("#settings").slideToggle(function() {
        $("#settingsIcon")
          .css("bottom", $(".settings-wrapper").outerHeight())
          .addClass("open");
      });
    },
    closeSettings: function() {
      $("#settings").slideToggle();
      $("#settingsIcon")
        .css("bottom", 0)
        .removeClass("open");
    },
    buildApps: function(apps) {
      log("new apps", apps, "red");
      var wm = this;
      this.config.activeApps = apps;
      setTimeout(function() {
        wm.restoreApplicationDimensions();
        wm.ready = true;
      }, 100);

      this.storeConfig();
    },
    setCity: function(city) {
      this.config.city = city;
      this.storeConfig();
    },
    setState: function(state) {
      log('setting state', state, 'blue')
      this.config.state = state;
      this.restoreApplicationDimensions()
      this.storeConfig();
    },
    getConfig: function() {
      var config = JSON.parse(window.localStorage.getItem("config"));
      if (!config) return;
      log("got config", config.activeApps);
      if (config.activeApps) {
        this.config.activeApps = config.activeApps;
        this.config.state = config.state;
        this.config.city = config.city;
        this.config.appPositions = config.appPositions;
      }
    },
    storeConfig: function() {
      localStorage.setItem("config", JSON.stringify(this.config));
    }
  }
};
</script>

<style lang="scss">
#app {
  flex-grow: 1;
  margin: 1rem;
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

  opacity: 0;
  transition: opacity 1s;
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
