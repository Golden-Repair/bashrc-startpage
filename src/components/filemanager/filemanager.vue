<template>
  <div
    id="filemanager"
    tabindex="0"
    ref="filemanager"
    v-on:keydown.37.prevent="leave"
    v-on:keydown.40.prevent="down"
    v-on:keydown.38.prevent="up"
    v-on:keydown.39.prevent="enter"
    v-on:keydown.13.prevent="enter"
    v-on:keydown.191.prevent=""
    v-on:keyup.70="onInput('touch')"
    v-on:keyup.78="onInput('mkdir')"
    v-on:keyup.191="onInput('search')"
    v-on:keyup.59="onInput('cd')"
    v-on:keydown.68="remove"
    v-on:keydown.80="paste"
    v-on:keydown.27.prevent="cancel"
  >
    <div class="wrapper">
      <ul>
        <li
          v-for="(node, index) in content"
          v-bind:key="index"
          v-on:click="enterClicked(node)"
          v-bind:class="{
            selected: index == selected,
            marked: markedRemove.indexOf(index) != -1,
            directory: node.type == 'directory',
            file: node.type == 'file'
          }"
        >
          {{ node.name }}
        </li>
      </ul>
      <div class="fm-prompt-wrapper" v-if="promptActive">
        <prompt
          v-bind:label="type"
          type="text"
          v-bind:placeholder="placeholders[type]"
          v-on:submit="onSubmit"
          v-model="input"
          ref="filePrompt"
        ></prompt>
      </div>
      <div class="status-bar">
        <span class="position">{{ selected + 1 }}/{{ content.length }}</span>
        <span class="wd">{{ dirname }}</span>
        <span class='filter'
        v-if='filter.length > 0'
        >filter: {{filter}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { log } from "../logger";
import prompt from "./prompt";

export default {
  name: "filemanager",
  data: function() {
    return {
      wd: {},
      selected: 0,
      promptActive: false,
      picked: "directory",
      type: "",
      filter: '',
      placeholders: {
        touch: "filename url",
        mkdir: "name",
        search: "string",
        cd: "directory"
      },
      input: "",
      modelCache: { type: "", name: "" },
      markedRemove: []
    };
  },
  components: {
    prompt
  },
  props: {
    fs: Object
  },
  watch: {},
  mounted: function() {
    this.wd = this.fs.getRoot();
    this.$refs.filemanager.focus();
  },
  methods: {
    open: function(url) {
      if (this.promptActive) return;
      window.open(url, "_blank");
    },
    leave: function() {
      if (this.promptActive) return;
      var res = this.fs.cd(this.wd, "..");
      if (res.directory) {
        this.wd = res.directory;
      }
      this.selected = 0;
    },
    enter: function() {
      if (this.promptActive) return;
      var node = this.content[this.selected];
      if (node.type == "directory") {
        var res = this.fs.cd(this.wd, node.name);
        if (res.directory) {
          this.wd = res.directory;
          this.selected = 0;
        }
      } else if (node.type == "file") {
        window.open(node.url, "_blank");
      }
    },
    enterClicked: function(node) {
      if (node.type == "directory") {
        var res = this.fs.cd(this.wd, node.name);
        if (res.directory) {
          this.wd = res.directory;
          this.selected = 0;
        }
      } else if (node.type == "file") {
        window.open(node.url, "_blank");
      }
    },
    down: function() {
      if (this.promptActive) return;
      this.selected = (this.selected + 1) % this.content.length;
    },
    up: function() {
      if (this.promptActive) return;
      this.selected =
        this.selected > 0 ? this.selected - 1 : this.content.length - 1;
    },
    onInput: function(type) {

      if(this.promptActive) return;
      this.type = type;
      this.promptActive = true;
    },
    remove: function() {
      if (this.promptActive) return;

      if (this.markedRemove.indexOf(this.selected) == -1) {
        this.markedRemove.push(this.selected);
      } else {
        this.markedRemove.splice(this.markedRemove.indexOf(this.selected), 1);
      }
    },
    cancel: function() {
      this.promptActive = false;
      this.filter = ''
      this.$refs.filemanager.focus();
    },
    paste: function() {
      for (var i = 0; i < this.markedRemove.length; i++) {
        var index = this.markedRemove[i];
        var node = this.content[index];
        if (node.type == "file") {
          this.fs.rm(this.wd, node.name);
        } else if (node.type == "directory") {
          this.fs.rmdir(this.wd, node.name);
        }
      }
      this.markedRemove = [];
      this.selected = 0;
    },
    onSubmit: function(value) {
      switch (this.type) {
        case "touch":
          this.fs.touch(this.wd, value.split(" "));
          break;
        case "mkdir":
          this.fs.mkdir(this.wd, value);
          break;
        case "search":
          this.filter = value
          break;
        case "cd":
        var node = this.content.filter(n => n.name == value)[0];
        this.enterClicked(node);
          break;
      }
      this.type = ''
      this.promptActive = false;
      this.$refs.filemanager.focus();


    },
    nextStage: function() {
      this.dialogStage += 1;
    }
  },
  computed: {
    content: function() {
      var content = [];
      if (!this.wd.getChildren) {
        return content;
      }
      content = content.concat(
        this.wd.getChildren().map(c => ({
          name: c.getName(),
          type: "directory"
        }))
      );
      content = content.concat(
        this.wd.getFiles().map(f => ({
          name: f.getName(),
          type: "file",
          url: f.getUrl()
        }))
      );
      if (this.filter.length > 0) {
        return content.filter(n => n.name.indexOf(this.filter) != -1)
      }
      return content;
    },
    dirname: function() {
      if (!this.wd.getPath) {
        return "";
      }
      return this.wd.getPath();
    }
  }
};
</script>

<style>
#arrow-capture {
  display: none;
}

#filemanager {
  background-color: var(--dark);
  opacity: 0.95;
}

.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.directory {
  cursor: pointer;
  color: var(--cyan);
}
.file {
  cursor: pointer;
  color: var(--yellow);
}

.directory.selected {
  background-color: var(--cyan);
  color: var(--dark);
}
.file.selected {
    background-color: var(--yellow);
  color: var(--dark);
}

.status-bar {
  position: absolute;
  bottom: 0;
  height: 22px;
  width: 100%;
  color: var(--dark);
  background-color: var(--red);
}

.filter {
  float: right;
}


.marked {
  background-color: var(--red);
  color: var(--dark);
}
.wd {
  margin-left: 1rem;
}
.fm-prompt-wrapper {
  position: absolute;
  bottom: 22px;
  width: 100%;
  height: 22px;
  margin: auto;
  overflow: hidden;
}
.down {
  color: var(--pink);
  margin: auto;
}
</style>
