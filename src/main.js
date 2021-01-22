import Vue from 'vue'
import App from './App.vue'
import store from './store';

var data = {};


new Vue({
  el: '#app',
  store,
  data : data,
  render: h => h(App)
})

