import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import vueLazyload from 'vue-lazyload'
Vue.config.productionTip = false

import "./assets/css/base.css";
import "./assets/css/product.css";
import "./assets/css/login.css";
import "./assets/css/checkout.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {currency} from "./currency";

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(Vuex);
Vue.filter('currency',currency);
Vue.use(infiniteScroll)

Vue.use(vueLazyload,{
  loading: "/static/loading/loading-spokes.svg"
});
/* eslint-disable no-new */

const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCountNum: 0
  },
  mutations: {
    updateName(state, nickName) {
      state.nickName = nickName
    },
    updateCartCount(state, num) {
      state.cartCountNum += num;
    },
    initCartCount(state, num) {
      state.cartCountNum = num;
    }
  }
});
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
