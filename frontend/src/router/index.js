import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ExtensionConfig from '@/components/ExtensionConfig'
import ExtensionViewer from '@/components/ExtensionViewer'
import ExtensionLiveConfig from '@/components/ExtensionLiveConfig'

Vue.use(Router)

export default new Router({
  //default mode : hash
  //express로 통합할때 history 모드로 빌드
  mode: 'history', 
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '*/config.html',
      name: 'ExtensionConfig',
      component: ExtensionConfig
    },
    {
      path: '*/viewer.html',
      name: 'ExtensionViewer',
      component: ExtensionViewer
    },
    {
      path: '*/live_config.html',
      name: 'ExtensionLiveConfig',
      component: ExtensionLiveConfig
    }
  ]
})
