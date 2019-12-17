<template> 
<ul>
<li v-for:"(task, index) in todos.active">
</li>
</ul>
</template>

<script>

import { log } from "./logger";


export default {
  name: "todo",
  data: function() {
    return {
        todos: {}
    };
  },
  props: {},
  watch: {},
  methods: {
      loadFromLocalStorage: function() {
        let json_obj = JSON.parse(window.localStorage.getItem("todo"));
        if(!json_obj) {
            this.todos = {}
        } else {
            this.todos = json_obj;
        }

      },
      storeToLocalStorage: function() {
        localStorage.setItem("todo", JSON.stringify(this.todos));
      },
      addTask: function(name, description, opts) {
          var task = {name: name,
                        description: description}
        if (opts.due) {
            task.due = opts.due;
        }
        if (opts.tags) {
            task.tags = opts.tags;
        }
        this.todos.active.push(task);
      },
      addTag: function(name) {
          if(this.todos.tags.indexOf(name) == -1) {
              this.todos.tags.push(name)
          }
      },
      completeTask: function(name) {
          var index = this.todos.active.map(t => t.name).indexOf(name)
          if( index != -1){
              var task = this.todos.splice(index, 1);
              this.todos.archive.push(task);
          }
      },

  },
  mounted: function(){
      this.loadFromLocalStorage();
  }
  computed: {}
</script>

<style></style>
