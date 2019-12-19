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



/*
TODO: 
- implement todo (2)
- implement filetree (9)
- implement colorscheme framework (3)
- implement colorscheme selection & generation (4)
- implement drag & drop in floating state (5)
- save window positions in floating state to config (5)
- implement split layouts other than just vertical split (5)
*/