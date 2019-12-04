/*
 * @Author: eamiear
 * @Date: 2018-11-27 11:32:42
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-12-04 11:07:20
 */

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? './' : '/',
  devServer: {
    proxy: {
      '/oauth': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.254',
        // target: 'http://192.168.200.101',
        // target: 'http://192.168.200.102:9999',
        ws: true,
        changeOrigin: true
      },
      '/consumer': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.155:8401',
        // target: 'https://192.168.200.254',
        ws: true,
        changeOrigin: true
      },
      '/image': {
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.254',
        ws: true,
        changeOrigin: true
      },
      '/facade': {
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.254',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => ({
    devtool: 'source-map',
    // externals: {
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex'
    // },
    resolve: {
      alias: {
        'views': '@/views',
        'images': '@/assets/images'
      }
    }
  }),
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
