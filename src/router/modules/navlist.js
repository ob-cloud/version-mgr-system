/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-12-03 17:01:01
 */

export default [
  {
    name: '/system/version.html',
    path: '/system/version.html',
    desc: '版本管理',
    meta: {title: 'version'},
    component: () => import('views/system/version.vue')
  }
]
