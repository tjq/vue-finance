// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
	
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';

import loadStock from 'highcharts/modules/stock';
import loadMap from 'highcharts/modules/map';
import 'element-ui/lib/theme-chalk/index.css'

loadStock(Highcharts);
loadMap(Highcharts);

Vue.use(VueHighcharts, { Highcharts });

Vue.use(Element)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
