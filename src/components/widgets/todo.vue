<template>
  <div class="todo-wrapper" 
  >
    <div class='todo-title'>todo</div>
    <div class="todo-list">
    <div class='todo-entry'
    v-for="(task, index) in todos.active" v-bind:key="index"
    >
    <div class='todo-name'>> {{task.name}}</div>
    <div class='todo-tags'>
    <span class="tag"
            v-for="(tag, index) in task.tags"
            v-bind:key="tag+index"
            v-bind:style="{'background-color': getTagColor(tag)}"
            v-on:click='showColorPicker(tag)'>
            {{tag}}
            </span>
    </div>
    <div class="todo-complete"
    v-on:click='completeTask(task.name)'
    ><i class="material-icons">backspace</i></div>
    <div class='todo-text'>{{task.description}}</div>
    </div>

    <br>
        </div>

    <form class='todo-prompt'>

        <span class='todo-prompt-label'>{{label}}</span>
        <input ref="input" v-model="input" 
                v-on:keydown.13.prevent="addTask" 
                :placeholder="placeholder" 
                id="value"/>
    </form>

    <div class='color-picker'>
    <span class='color'
    v-for='(color, index) in colors'
    v-bind:key="color+index"
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
      input: '',
      inputActive: false,
      label: 'add',
      placeholder: 'task [tag, tog]: Do this thing finally',
      priority: 0,
      duedate: null,
      desc: '',
      showForm: true,
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
      $('.color-picker').css('opacity', 1);
      } else {
              $('.color-picker').css('opacity', 0);

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
      return this.todos.tags[this.todos.tags.map(t => t.name).indexOf(tag)].color;
    },
    setTagColor: function(color) {
      this.todos.tags[this.todos.tags.map(t => t.name).indexOf(this.selectedTag)].color = color;
      this.storeToLocalStorage()
          this.colorPickerActive = false;

    },
    showColorPicker: function(tag) {
      this.selectedTag = tag;
      this.colorPickerActive = true;
    },
    addTask: function() {
        var input_both = this.input.split(":");
        var name = input_both[0].split(' ')[0]
        var task = { name: name, description: input_both[1], tags: []};

        var tags = input_both[0].split('[')[1];
        if (tags){
            tags = tags.substr(0, tags.length-1);

            tags = tags.split(/,\s*/);
            task.tags = tags;
            this.addTagsIfNew(task.tags)
        }
      this.todos.active.push(task);
      this.input ='';
      this.storeToLocalStorage();
    },
    addTagsIfNew: function(tags) {
        var newTags = tags.filter(t => this.todos.tags.map(g => g.name).indexOf(t) == -1)
        this.todos.tags = this.todos.tags.concat(newTags.map(t => ({name: t, color: 'white'})))
    },
    completeTask: function(name) {
      var index = this.todos.active.map(t => t.name).indexOf(name);
      if (index != -1) {
        var task = this.todos.active.splice(index, 1);
        this.todos.completed.push(task);
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

tr {
  border-bottom: 1px solid var(--white);
}

th {
  border-bottom:  1px solid var(--white);
}

.todo-name, .todo-tags, .todo-complete {
  display: inline;
}

.todo-complete {
  float: right;
  cursor: pointer;

}

.todo-wrapper {
  opacity: 0.95;

}

.todo-list {
    overflow: auto;
  scrollbar-width: none;
  max-height:calc(100% - 3rem);
}                                    

.todo-title {
  text-transform: uppercase;
    margin-bottom:1.5rem;

}

.table-header {
  margin-bottom: 0.5rem;
}


.tag {
  color: var(--dark);
  font-size: 0.8rem;
  padding: 0.1rem;
  cursor: pointer;
  margin-right: 0.3rem;
  border-radius: 3px;
}

.todo-prompt {
    position:absolute;
    bottom:22px;
    width: 70%;
    height: 22px;
    margin: auto;
    overflow: hidden;
    display:flex;

}

.color-picker {
  display:flex;
  opacity: 0;
  position: absolute;
  bottom:0;
  left:0;
  width: 100%;
  transition: opacity 0.6s;
}

.color {
  height: 20px;
  width: 40px;
  display: inline-block;
  cursor: pointer;
  flex-grow:1;
}

.todo-prompt-label {
    margin-right: 0.2rem;
    padding: 0;
    background-color: var(--green);
    color: var(--dark);
}
input {
    background-color: var(--dark);
    border: none;
    margin-left: 0;
    color: var(--white);
    flex-grow:1;
}

</style>
