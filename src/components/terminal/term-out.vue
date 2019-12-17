<template>
  <!-- Terminal Output -->
  <div id="console_out" class="console-out">
    <a v-for="(dir, index) in this.out.dirs" v-bind:key=index v-on:click="$emit('cd', `cd ${dir}`)" class="directory" >{{dir}}</a>
    <a v-for="(file, index) in this.out.files" v-bind:key=index class="file" :href="file.url">{{file.name}}</a>
    <a v-for="(msg, index) in this.out.messages" v-bind:key=index :class="msg.type" :style="msg.css">{{msg.value}}</a>
  </div>
</template>

<script>
export default {
  name: "termOut",
  data: function() {
    return {};
  },
  props: {
    out: Object
  },
  watch: {
    out: function(newVal, oldVal) {
      console.log("got new out values: "+newVal)
    }
  }
};
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.console-out::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE and Edge and firefox */
.console-out {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.console-out {
  max-height: 100%;
  overflow: scroll;
}

.console-out a {
  display: block;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.console-out .error {
  color: var(--red);
}
.console-out .success {
  color: var(--green);
}
.console-out .file {
  color: var(--yellow);
}
.console-out .directory {
  color: var(--cyan);
}
</style>