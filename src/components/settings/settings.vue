<template>
  <div class="settings-wrapper">
    <div class="tab">
      <button id="button-view" v-on:click="openTab('submenu-view')" class="tablinks tab-active">
        View
      </button>
      <button id="button-term" v-on:click="openTab('submenu-term')" class="tablinks">
        Terminal
      </button>
      <button id="button-fm" v-on:click="openTab('submenu-fm')" class="tablinks">
        File Manager
      </button>
      <button id="button-colors" v-on:click="openTab('submenu-colors')" class="tablinks">
        Colors
      </button>
    </div>
    <div id="submenu-view" class="tabcontent">
      <div class="row mb-2">
        <div class="col">
          <h3>Applications</h3>
            <label>
              <input
                type="checkbox"
                id="term"
                value="term"
                v-model="activeApps"
              />
              <span class="app-icon"><i class="fas fa-terminal"></i></span>
            </label>
            <label>
              <input type="checkbox" id="fm" value="fm" v-model="activeApps" />
              <span class="app-icon"><i class="far fa-hdd"></i></span>
            </label>
            <label>
              <input type="checkbox" id="weather" value="weather" v-model="activeApps" />
              <span class="app-icon"><i class="fas fa-smog"></i></span>
            </label>
        </div>
      </div>
    </div>
    <div id="submenu-term" class="tabcontent"></div>
    <div id="submenu-fm" class="tabcontent"></div>
    <div id="submenu-colors" class="tabcontent"></div>
  </div>
</template>

<script>
import { log } from "../logger";

export default {
  name: "settings",
  data: function() {
    return {
      activeApps: [],
      activeTab: 'submenu-view',
    };
  },
  props: {},
  watch: {
    activeTab: function(newActive, prevActive) {
      $(`#${prevActive}`).toggle();
      $(`#${newActive}`).toggle();
      log('test',prevActive.substr(prevActive.indexOf('-')+1) )
       $(`#button-${prevActive.substr(prevActive.indexOf('-')+1)}`).toggleClass('tab-active');
       $(`#button-${newActive.substr(newActive.indexOf('-')+1)}`).toggleClass('tab-active');

    },
    activeApps: function(newList, oldList) {
      log('new active apps', newList)
      this.$emit('appsChanged', newList)
    }
  },
  methods: {
    openTab: function(value) {
      log('open tab', value);
      this.activeTab = value;
    },
    updateTerminal: function(value) {
      log("updateTerm", value);
    },
    updateFm: function(value) {
      log("updateFm", value);
    }
  },
  computed: {}
};
</script>

<style>
.mb-2 {
  margin-bottom: 2rem;
}
.mb-0 {
  margin-bottom: 0;
}
.m-0 {
  margin-left: 0;
  margin-right: 0;
}

input[type="checkbox"] {
  display: none;
}

.app-icon {
  margin-right: 1rem;
  margin-bottom: 2rem;
  background-color: var(--white);
  padding: 1rem;
  border-radius: 5px;
}

.app-icon i {
  color: var(--red);

}
[type="checkbox"]:checked +  .app-icon i {
  color: var(--green);

}

.settings-wrapper {
  padding: 1rem;
  width: 100%;
  background-color: var(--dark);
}

.tab {
  overflow: hidden;
  background-color: var(--dark);
  margin-bottom: 1rem;
}

.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
  border-bottom: 1px solid var(--cyan);
  margin-right: 1rem;
}

.tab button:hover {
  background-color: #ddd;
}

.tab button.active {
  background-color: #ccc;
}

.tab-active {
  display: block;
  border-bottom: 1px solid var(--yellow) !important;

}


.tab-content {
  display: none;
}
</style>
