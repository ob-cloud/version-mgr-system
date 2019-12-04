/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:37:25
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-12-04 16:49:05
 */

import {
  SET_TOKEN,
  SET_UID,
  SET_INTRODUCTION,
  SET_NAME,
  SET_AVATAR,
  SET_USER_INFO,
  SET_PWD
} from '../mutation-types'
import Storage, {cacher} from '@/common/cache'
import md5 from 'md5'

const user = {
  state: {
    user: '',
    token: Storage.getToken(),
    name: cacher.setStrategy('localStorage').get('name'),
    avatar: '',
    introduction: '',
    userInfo: null,
    pwd: cacher.setStrategy('localStorage').get('pk')
  },
  mutations: {
    [SET_TOKEN] (state, token) {
      state.token = token
    },
    [SET_UID] (state, uid) {
      state.uid = uid
    },
    [SET_INTRODUCTION] (state, introduction) {
      state.introduction = introduction
    },
    [SET_NAME] (state, name) {
      state.name = name
    },
    [SET_AVATAR] (state, avatar) {
      state.avatar = avatar
    },
    [SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    },
    [SET_PWD] (state, pwd) {
      state.pwd = pwd
    }
  },
  actions: {
    loginByAccount ({ commit }, userInfo) {
      return new Promise(resolve => {
        const password = md5(btoa(userInfo.password) + userInfo.password)
        cacher.setStrategy('localStorage').set('pk', password)
        cacher.setStrategy('localStorage').set('name', userInfo.account.trim())
        Storage.setToken(password)
        commit('SET_TOKEN', password)
        commit('SET_NAME', userInfo.account.trim())
        commit('SET_PWD', password)
        resolve(password)
      })
    },
    // 登出
    logOut ({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', null)
        commit('SET_NAME', '')
        commit('SET_PWD', '')
        cacher.remove('permission')
        Storage.removeToken()
        cacher.setStrategy('localStorage').remove('pk')
        cacher.setStrategy('localStorage').remove('name')
        resolve()
      })
    }
  }
}

export default user
