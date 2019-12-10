import Vue from 'vue'
import App from './App.vue'
import VMap from './plugin'

Vue.use(VMap, {
  key: '9cf962e0e3aad4218e41a8c833d0b3fa',
  loadMapUI: false
}, () => {
  new Vue({
    el: '#app',
    render: h => h(App)
  })
})
