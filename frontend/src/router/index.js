import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ExtensionConfig from '@/components/ExtensionConfig'
Vue.use(Router)

export default new Router({
  //default mode : hash
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/config.html',
      name: 'ExtensionConfig',
      component: ExtensionConfig
    }
  ]
})
