<template>
  <div id="app" :class="config.state">
    <filemanager
      class="application"
      id="filemanager"
      v-if="this.config.activeApps.indexOf('fm') != -1"
      v-bind:fs="this.fs"
    />
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
    />
    <settingsIcon
      v-on:click="toggleSettings"
      id="settingsIcon"
      ref="settingsIcon"
    ></settingsIcon>
    <settings
      v-on:appsChanged="buildApps"
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
import settings from "./components/settings/settings";
import settingsIcon from "./components/settings/settingsIcon";
import { getFileSystem } from "./components/filesystem/filesystem.js";
import { newResponse } from "./components/response";
import { log } from "./components/logger";


/*
TODO: 
- set city via settings applet and store to local storage (1)
- implement todo (2)
- implement filetree (9)
- implement colorscheme framework (3)
- implement colorscheme selection & generation (4)
- implement drag & drop in floating state (5)
- save window positions in floating state to config (5)
- implement split layouts other than just vertical split (5)
*/



export default {
  name: "app",
  data() {
    return {
      fs: getFileSystem(),
      settingsOpen: false,
      config: {
        activeApps: [],
        state: 'floating'
      }
    };
  },
  props: {},
  components: {
    terminal,
    filemanager,
    settings,
    settingsIcon,
    weather
  },
  mounted: function() {
    this.getConfig();
  },
  watch: {},
  methods: {
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
    getConfig: function() {
      var config = JSON.parse(window.localStorage.getItem("config"));
      log("got config", config.activeApps);
      if (config.activeApps) {
        this.config.activeApps = config.activeApps;
        this.config.state = config.state;
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

.floating .application{
  position:absolute;
}

.floating #weather {
  width:300px;
  height:200px;
  top:20px;
  left:900px;
}
.floating #terminal {
  width:900px;
  height:220px;
  top:500px;
  left:100px;
}
.floating #filemanager {
  width:300px;
  height:250px;
  top:20px;
  left:50px;
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
