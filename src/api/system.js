/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-12-04 11:21:14
 */

import {request} from '@/common/request'
import qs from 'qs'

const SystemAPI = {
  login (username, password) {
    return request.post('/oauth/token', qs.stringify({password, username, grant_type: 'password'}), {
      Authorization: 'Basic d2ViQXBwOndlYkFwcA==',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'cache-control': 'no-cache'
    })
  },
  logout (accessToken) {
    return request.delete('/oauth/token/' + accessToken)
  },
  getVersionList (firmware = {}) {
    return request.get('/consumer/facade/getFirmWare', {
      firmware: JSON.stringify(firmware)
    })
  },
  deleteVersion (id) {
    return request.postForm('/consumer/image/deleteFirmWare', {
      id
    })
  }
}
export default SystemAPI
