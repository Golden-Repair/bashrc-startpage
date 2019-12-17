import Vue from 'vue'
import App from './App.vue'
import {jQuery} from 'jquery';

var data = {};

import 'expose-loader?$!expose-loader?jQuery!jquery'

new Vue({
  el: '#app',
  data : data,
  render: h => h(App)
})
