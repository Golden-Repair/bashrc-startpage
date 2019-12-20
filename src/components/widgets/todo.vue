<template>
  <div class="todo-wrapper">
    <span class='todo-title'>todo</span>
    <table>
    <tr class='table-header'>
    <th>name</th>
    <th>prio</th>
    <th>due</th>
    <th>tags</th>
    </tr>
      <tr class='table-entry' v-for="(task, index) in todos.active" v-bind:key="index">
      <td>{{task.name}}</td>
      <td>{{task.priority}}</td>
      <td>{{task.duedate}}</td>
      <td><span class="tag"
            v-for="(tag) in task.tags"
            v-bind:style="{'background-color': getTagColor(tag)}"
            v-on:click='showColorPicker(tag)'>
            {{tag}}
            </span>
      </td>
      </tr>
    </tr>
    </table>
    <button v-on:click='showForm = !showForm'>add</button>
    <br>
    <form v-if='showForm' v-on:keydown.13.prevent='addTask'>
    <label for='title'>title</label><input v-model='title' id='title' type='text'></input>
    <label for='priority'>priority</label><input v-model='priority' id='priority' type='text' number></input>
    <label for='duedate'>due</label><input v-model='duedate' id='duedate' type='date'></input>

    </form>
    <div class='color-picker'>
    <span class='color'
    v-for='(color) in colors'
    v-bind:style="{'background-color': color}"
    v-on:click='setTagColor(color)'
    ></span>
    </div>
  </div>
</template>

<script>
import { log } from "../logger";

export default {
  name: "todo",
  data: function() {
    return {
      todos: {
          active: [],
          completed: [],
          tags: [],
      },
      title: '',
      priority: 0,
      duedate: null,
      showForm: false,
      colorPickerActive: false,
      colors: [
        'var(--cyan)',
        'var(--blue)',
        'var(--darkblue)',
        'var(--orange)',
        'var(--yellow)',
        'var(--pink)',
        'var(--green)',
        'var(--red)',
        'var(--white)',
      ]
    };
  },
  props: {},
  watch: {
    colorPickerActive: function(newVal, oldVal) {
      if (newVal) {
      $('.color-picker').slideToggle();
      }
    }
  },
  methods: {
    loadFromLocalStorage: function() {
      let json_obj = JSON.parse(window.localStorage.getItem("todo"));
      if (json_obj) {
        this.todos = json_obj;
      } 
    },
    storeToLocalStorage: function() {
      localStorage.setItem("todo", JSON.stringify(this.todos));
    },
    getTagColor: function(tag) {
      log('gettagcolor', tag, 'red')
      return this.todos.tags[this.todos.tags.map(t => t.name).indexOf(tag)].color;
    },
    setTagColor: function(color) {
      log('settagcolor', color, 'red')
      this.todos.tags[this.todos.tags.map(t => t.name).indexOf(this.selectedTag)].color = color;
          $('.color-picker').slideToggle();
          this.colorPickerActive = false;

    },
    showColorPicker: function(tag) {
      this.selectedTag = tag;
      this.colorPickerActive = true;
    },
    addTask: function() {
        log('addTask', this.title, 'red')
        var name = this.title.split(' ')[0]
        var task = { name: name, priority: this.priority, tags: [], duedate: '' };
        if (this.duedate) {
            task.duedate = this.duedate;
        }
        var tags = this.title.split('[')[1];
        if (tags){
            tags = tags.substr(0, tags.length-1);
            tags = tags.split('/,\s*/');
            task.tags = tags;
            this.addTagsIfNew(task.tags)
        }
      this.todos.active.push(task);
      this.storeToLocalStorage();
    },
    addTagsIfNew: function(tags) {
        var newTags = tags.filter(t => this.todos.tags.map(g => g.name).indexOf(t) == -1)
        this.todos.tags = this.todos.tags.concat(newTags.map(t => ({name: t, color: 'white'})))
    },
    completeTask: function(name) {
      var index = this.todos.active.map(t => t.name).indexOf(name);
      if (index != -1) {
        var task = this.todos.splice(index, 1);
        this.todos.archive.push(task);
      }
    }
  },
  mounted: function() {
    this.loadFromLocalStorage();
  },
  computed: {}
};
</script>

<style>
.todo-wrapper {
  padding: 5rem;
  background-color: var(--dark);
  opacity: 0.95;
}

.todo-title {
  text-transform: uppercase;
}

.table-header {
  margin-bottom: 0.5rem;
}

table {
    width: 100%;
    margin-top: 1rem;
}

.tag {
  color: var(--dark);
  font-size: 0.8rem;
  padding: 0.1rem;
  cursor: pointer;
}

.color-picker {
  display:none;
  position: absolute;
  bottom:0;
  left:0;
}

.color {
  height: 20px;
  width: 40px;
  display: inline-block;
  cursor: pointer;
}

</style>
