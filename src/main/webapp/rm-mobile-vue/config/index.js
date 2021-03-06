// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/rm-mobile-vue/dist/',
    assetsPublicHome: '../../webapp/WEB-INF/views/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  sit: {
    env: require('./sit.env'),
    index: path.resolve(__dirname, '../sit/index.html'),
    assetsRoot: path.resolve(__dirname, '../sit/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/rm-mobile-vue/sit/',
    assetsPublicHome: '../../webapp/WEB-INF/views/',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8092,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/internal': {
        target: 'http://dev.vkrms.vanke.com:8080',
        pathRewrite: {
          '^/internal': '/internal'
        },
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
