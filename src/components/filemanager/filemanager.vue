<template>
  <div id="filemanager" tabindex=0 autofocus ref='filemanager'
        v-on:keydown.37.prevent="leave"
        v-on:keydown.40.prevent="down"
        v-on:keydown.38.prevent="up"
        v-on:keydown.39.prevent="enter"
        v-on:keydown.13.prevent="enter"
        v-on:keyup.65='add'
        v-on:keydown.68='remove'
        v-on:keydown.80='paste'
        v-on:keydown.27.prevent='cancel'
  >
    <div class="wrapper">
      <ul>
        <li
          v-for="(node, index) in content"
          v-bind:key="index"
          v-on:click="enter"
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
      <div class="fm-prompt-wrapper" v-if="dialogStage !=0">
        <prompt 
        v-bind:label="dialog[dialogStage].label"
        v-bind:type="dialog[dialogStage].type"
        v-bind:placeholder="dialog[dialogStage].placeholder"
        v-on:submit="onSubmit"
        v-model="input"
        ref="filePrompt"></prompt>
      </div>
      <div class="status-bar">
        <span class="position">{{selected+1}}/{{content.length}}</span>
        <span class="wd">{{ dirname }}</span>
      </div>
    </div>
  </div>
</template>

<script>

import { log } from "../logger";
import prompt from './prompt'

export default {
  name: "filemanager",
  data: function() {
    return {
      wd: {},
      selected: 0,
      dialogStage : 0,
      picked: 'directory',
      dialog: {
          0: {type: '', label: '', placeholder: ''},
          1: {type: 'text', label: 'add', placeholder: 'directory/file (d/f)'},
          2: {type: 'text', label: 'name', placeholder: 'name'},
          3: {type: 'text', label: 'url', placeholder: 'url'},
        },
        input: "", 
        modelCache: {type: '', name: ''},
        markedRemove: [],
    }
  },
  components: {
      prompt,
  },
  props: {
    fs: Object
  },
  watch: {},
  mounted: function() {
    this.wd = this.fs.getRoot();
    this.$refs.filemanager.focus()
  },
  methods: {
    open: function(url) {
        if(this.dialogStage != 0) return;
      window.open(url, "_blank");
    },
    leave: function() {
        if(this.dialogStage != 0) return;
        var res = this.fs.cd(this.wd, '..')
        if (res.directory){
            this.wd = res.directory;
        }
        this.selected = 0;
    },
    enter: function() {
        if(this.dialogStage != 0) return;
        var node = this.content[this.selected]
    if (node.type == "directory") {
        var res = this.fs.cd(this.wd, node.name);
        if (res.directory){
            this.wd = res.directory;
            this.selected = 0;
        }
      } else if (node.type == "file") {
        window.open(node.url, "_blank");
      }

        
    },
    down: function() {
        if(this.dialogStage != 0) return;
        this.selected = (this.selected + 1) % this.content.length
    },
    up: function() {
        if(this.dialogStage != 0) return;
        this.selected = this.selected > 0 ? this.selected -1 : this.content.length-1;
    },
    add: function() {
        if(this.dialogStage == 0){
        this.dialogStage = 1;
        }
    },
    remove: function(){
        if(this.dialogStage != 0) return

        if(this.markedRemove.indexOf(this.selected) == -1){
            this.markedRemove.push(this.selected);
        } else {
            this.markedRemove.splice(this.markedRemove.indexOf(this.selected),1);
        }
    },
    cancel: function(){
        this.dialogStage = 0;
        this.$refs.filemanager.focus()
    },
    paste: function() {
        for(var i= 0; i<this.markedRemove.length;i++){
            var index = this.markedRemove[i];
            var node = this.content[index];
            if(node.type == 'file') {
                this.fs.rm(this.wd, node.name)
            } else if (node.type == 'directory') {
                this.fs.rmdir(this.wd, node.name)
            }
        }
        this.markedRemove = []
        this.selected = 0;
    },
    onSubmit: function(value){
        if (this.dialogStage == 1) {
            if (value != 'd' && value != 'f') {
                return;
            }
                this.modelCache.type = value;
                this.nextStage()
        } else if (this.dialogStage == 2) {
            this.modelCache.name = value;
            if (this.modelCache.type == 'd'){
                this.fs.mkdir(this.wd, this.modelCache.name);
                this.dialogStage =0;
                this.modelCache = {type: '', name: ''}
            } else {
                this.nextStage();
            }
        } else if (this.dialogStage == 3) {
            this.fs.touch(this.wd, [this.modelCache.name, value])
            this.dialogStage =0;
            this.modelCache = {type: '', name: ''}
        }
        
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
  color: var(--cyan);
}
.file {
  color: var(--green);
}

.status-bar {
  position: absolute;
  bottom: 0;
  height: 22px;
  width: 100%;
  color: var(--dark);
  background-color: var(--red);
}

.selected {
  background-color: var(--blue);
  color: var(--dark);
}
.marked {
    background-color: var(--red);
    color: var(--dark);
}
.wd {
    margin-left: 1rem;
}
.fm-prompt-wrapper {
    position:absolute;
    bottom:22px;
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
