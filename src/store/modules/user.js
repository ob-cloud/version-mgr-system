/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:37:25
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-12-09 15:53:18
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
import SystemAPI from '@/api/system'
import Storage, {cacher} from '@/common/cache'
import md5 from 'md5'

const user = {
  state: {
    user: '',
    token: Storage.getToken(),
    name: cacher.setStrategy('localStorage').get('vms.name'),
    avatar: '',
    introduction: '',
    userInfo: null,
    pwd: cacher.setStrategy('localStorage').get('vms.pk')
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
      return new Promise((resolve, reject) => {
        const password = md5(btoa(userInfo.password) + userInfo.password)
        SystemAPI.login(userInfo.account.trim(), password).then(data => {
          if (data) {
            const token = data.access_token
            Storage.setToken(token)
            cacher.setStrategy('localStorage').set('vms.pk', password)
            cacher.setStrategy('localStorage').set('vms.name', userInfo.account.trim())
            commit('SET_TOKEN', token)
            commit('SET_NAME', userInfo.account.trim())
            commit('SET_USER_INFO', data)
            commit('SET_PWD', password)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    logOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        SystemAPI.logout(state.token).then(res => {
          if (res.message.includes('success')) {
            commit('SET_TOKEN', '')
            commit('SET_USER_INFO', null)
            commit('SET_NAME', '')
            commit('SET_PWD', '')
            Storage.removeToken()
            cacher.setStrategy('localStorage').remove('vms.pk')
            cacher.setStrategy('localStorage').remove('vms.name')
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
