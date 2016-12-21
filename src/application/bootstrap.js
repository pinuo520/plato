import Vue from 'vue'
import { use, run } from 'system'

import { log } from 'utils/console'

import i18n from 'modules/i18n'
import validator from 'modules/validator'
import config from 'modules/config'
import faq from 'modules/faq'
import demo from 'modules/demo'
import about from 'modules/about'
import user from 'modules/user'
import core from 'modules/core'

import tap from './directives/tap'
import drag from './directives/drag'

import Root from './views/root'

/**
 * Use Modules
 */

/**
 * 被依赖的模块，移除可能会影响部分功能
 */
use(i18n)
use(validator)

/**
 * 普通模块
 */
use(config, { prefix: 'config' })
use(user)
use(faq)
use(demo, { prefix: 'demo' })
use(about, { prefix: 'about' })

/**
 * 核心模块，不能移除
 */
use(core)

/**
 * Run Modules
 */

run(({ router, store }) => {
  log('%c[PLATO] %cLet\'s go!', 'font-weight: bold', 'color: green; font-weight: bold')

  /**
   * Directives
   */

  // tap event
  Vue.directive('tap', tap)
  // drag event
  Vue.directive('drag', drag)

  /**
   * Let's go!
   */

  // router hooks
  // 此处需要优化 action type 获取方法
  // 此处需要优化 getters key 获取方法
  router.beforeEach((to, from, next) => {
    store.dispatch('config/setProgress', 80)
    if (to.matched.some(m => m.meta.auth) && !store.getters['core/authorized']) {
      next('/')
    } else {
      next()
    }
  })
  router.afterEach(() => {
    if (document.activeElement && document.activeElement.nodeName !== 'BODY') {
      document.activeElement.blur()
    }
    store.dispatch('config/setProgress', 100)
  })

  // mounting
  new Vue({ router, store, ...Root }).$mount('#app')
})
