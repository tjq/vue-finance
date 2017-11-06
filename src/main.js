// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import firebase from 'firebase'
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
import Hello from './components/Hello';
import Portfolio from './components/Portfolio';

import loadStock from 'highcharts/modules/stock';
import loadMap from 'highcharts/modules/map';
import 'element-ui/lib/theme-chalk/index.css'

loadStock(Highcharts);
loadMap(Highcharts);

Vue.use(VueHighcharts, { Highcharts });

Vue.use(Element)
Vue.use(VueRouter)
Vue.config.productionTip = false


const routes = [
    { path: '/', component: Hello },
    { path: '/portfolio/:uid', component: Portfolio, props: true }
];

const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
	router: router
})
