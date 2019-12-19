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
      <td><span v-for="(tag) in task.tags">{{tag}}</span></td>
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
    };
  },
  props: {},
  watch: {},
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

table {
    width: 100%;
}
</style>
