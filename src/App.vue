<template>
  <div id="app" :class="config.state" 
  >
    <draggable id='fm'
    v-bind:component="fm"
    v-model='fmposition'
    v-on:dragStart='setClickPos'
    >
    <div slot='application'>
    <filemanager 
      class="application"
      id="filemanager"
      v-if="this.config.activeApps.indexOf('fm') != -1"
      v-bind:fs="this.fs"
    ></filemanager>
    </div>
    </draggable>
    
    <terminal
      class="application"
      id="terminal"
      v-if="this.config.activeApps.indexOf('term') != -1"
      v-bind:fs="this.fs"
    />
    <weather
      class="application"
      id="weather"
      v-if="this.config.activeApps.indexOf('weather') != -1"
      v-bind:city="this.config.city"
    />
    <todo
      class="application"
      id="todo"
      v-if="this.config.activeApps.indexOf('todo') != -1"
    >
    </todo>
    <settingsIcon
      v-on:click="toggleSettings"
      id="settingsIcon"
      ref="settingsIcon"
    ></settingsIcon>
    <settings
      v-on:appsChanged="buildApps"
      v-on:cityChanged="setCity"
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
import draggable from './components/widgets/draggable'
import settings from "./components/settings/settings";
import settingsIcon from "./components/settings/settingsIcon";
import { getFileSystem } from "./components/filesystem/filesystem.js";
import { newResponse } from "./components/response";
import { log } from "./components/logger";






export default {
  name: "app",
  data() {
    return {
      fm: 'filemanager',
      fs: getFileSystem(),
      settingsOpen: false,
      config: {
        activeApps: [],
        city: '',
        state: 'floating',
      },
        dragmode: false,
        fmposition: {left: 50, top:20},
        clickPos: {x: 0,y:0},

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
  mounted: function() {
    this.getConfig();
  },
  watch: {
    dragmode: function(dragmodeNew, dragmodeOld) {
      log('dragmode changed', dragmodeNew)
    },
    fmposition: function(newPos, oldPos) {
      log('setting fm to y', newPos.top)
      var prevOffset = $(`#filemanager`).offset();
      $(`#filemanager`).offset({left: this.clickPos.x + newPos.left, top: this.clickPos.y + newPos.top});
    }
  },
  methods: {
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
    setState: function() {
      $('#app').class(this.config.state)
    },
    buildApps: function(apps) {
      log("new apps", apps, "red");
      this.config.activeApps = apps;
      this.storeConfig();
    },
    setCity: function(city) {
      this.config.city = city;
      this.storeConfig();
    },
    getConfig: function() {
      var config = JSON.parse(window.localStorage.getItem("config"));
      log("got config", config.activeApps);
      if (config.activeApps) {
        this.config.activeApps = config.activeApps;
        this.config.state = config.state;
        this.config.city = config.city;
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

.floating {
}

.floating .application {
  position: absolute;
}

.floating #weather {
  width: 300px;
  height: 200px;
  top: 20px;
  left: 900px;
}

.floating #todo {
  width: 300px;
  height: 200px;
  top: 420px;
  left: 900px;
}

.floating #terminal {
  width: 500px;
  height: 220px;
  top: 500px;
  left: 100px;
}
.floating #fm {
  width: 300px;
  height: 250px;
  top: 20px;
  left: 50px;
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
  transition: 1s ease-in;
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
