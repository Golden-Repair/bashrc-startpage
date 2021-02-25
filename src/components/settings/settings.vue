<template>
  <div class="settings-wrapper" :class="{ open: open }">
    <div id="submenu-view" class="settings-section">
      <div class="apps">
        <div
          class="app-icon"
          :class="{ active: terminalActive }"
          @click="toggleApp('terminal')"
        >
          <i class="fas fa-terminal"></i>
        </div>
        <div
          class="app-icon"
          :class="{ active: fmActive }"
          @click="toggleApp('filemanager')"
        >
          <i class="far fa-hdd"></i>
        </div>
        <div
          class="app-icon"
          :class="{ active: weatherActive }"
          @click="toggleApp('weather')"
        >
          <i class="fas fa-smog"></i>
        </div>
        <div
          class="app-icon"
          :class="{ active: todoActive }"
          @click="toggleApp('todo')"
        >
          <i class="fas fa-clipboard-list"></i>
        </div>
      </div>
    </div>
    <div class="settings-section toggle">
      <div class="label">tile</div>
      <div
        class="layout-toggle"
        @click="toggleLayout"
        :class="{ active: config.windowState === 'tiled' }"
      >
        <div class="toggle-button"></div>
      </div>
    </div>
    <div class="settings-section">
      <span>City</span>
      <input type="text" id="city" v-model="config.city" @input="setCity" />
    </div>
  </div>
</template>

<script>
export default {
  name: "settings",
  data: function () {
    return {
      config: {},
      activeTab: "submenu-view",
    };
  },
  props: {
    activeApps: Array,
    wmState: String,
    open: Boolean,
  },
  created() {
    this.config = this.$store.state.config;
  },
  watch: {
    wmState: function (newState, oldState) {
      this.$emit("stateChanged", newState);
    },
    city: function (newCity, oldCity) {
      this.$emit("cityChanged", newCity);
    },
  },
  methods: {
    toggleLayout() {
      this.config.windowState === "floating"
        ? (this.config.windowState = "tiled")
        : (this.config.windowState = "floating");
      this.$store.dispatch("updateConfig", this.config);
    },
    setCity() {
      this.$store.dispatch("updateConfig", this.config);
    },
    toggleApp(name) {
      let app = this.config.apps.find((a) => a.name === name);
      app.visible = !app.visible;
      this.$store.dispatch("updateConfig", this.config);
    },
    openTab: function (value) {
      this.activeTab = value;
    },
    updateTerminal: function (value) {},
    updateFm: function (value) {},
  },
  computed: {
    terminalActive() {
      return this.$store.state.config.apps.find((a) => a.name === "terminal")
        .visible;
    },
    fmActive() {
      return this.$store.state.config.apps.find((a) => a.name === "filemanager")
        .visible;
    },
    weatherActive() {
      return this.$store.state.config.apps.find((a) => a.name === "weather")
        .visible;
    },
    todoActive() {
      return this.$store.state.config.apps.find((a) => a.name === "todo")
        .visible;
    },
  },
};
</script>

<style>
.layout-toggle {
  width: 40px;
  height: 20px;
  overflow: hidden;
  background-color: var(--dark);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}
.layout-toggle.active {
  background-color: var(--white);
}
.toggle-button {
  width: 20px;
  height: 20px;
  background-color: var(--red);
  border-radius: 50%;
  transition: 0.3s ease-in-out;
}
.layout-toggle.active .toggle-button {
  transform: translateX(100%);
  background-color: var(--green);
}
.apps {
  display: flex;
}
.app-icon {
  margin-right: 8px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  background-color: var(--white);
  transition: 0.3s ease-in-out;
}
.app-icon i {
  transition: 0.3s ease-in-out;
  color: var(--red);
}
.app-icon.active {
  background-color: var(--green);
}
.app-icon.active i {
  color: var(--white);
}

.settings-wrapper {
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--dark);
  position: absolute;
  right: 0;
  transform: translateX(100%);
  transition: 0.3s ease-in-out;
  display: grid;
}
.settings-section {
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
}
.settings-section .label {
  margin-right: 1rem;
}
.settings-section.toggle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.settings-wrapper.open {
  transform: translateX(0);
}

input {
  background-color: var(--dark);
  border: none;
  margin-left: 0;
  color: var(--white);
}
</style>
