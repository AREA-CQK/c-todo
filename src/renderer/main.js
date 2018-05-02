import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import db from '../datastore/datastore'

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import { Layout, Sider, Menu, MenuItem, Icon, Content,
    Button, Card, ButtonGroup, Input, Modal, Tag,
    DropdownMenu, Dropdown,DropdownItem, Message }  from 'iview';
Vue.component('Layout', Layout);
Vue.component('Sider', Sider);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Icon', Icon);
Vue.component('Content', Content);
Vue.component('Button', Button);
Vue.component('Card', Card);
Vue.component('ButtonGroup', ButtonGroup);
Vue.component('Input', Input);
Vue.component('Modal', Modal);
Vue.component('Tag', Tag);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Message', Message);

// Vue.use(iView);
Vue.prototype.$db = db
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
