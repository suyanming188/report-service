// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')
env.NODE_ENV = 'sittest'

var path = require('path')
var config = require('../config')
var fs = require('fs')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.sit.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.sit.assetsRoot, config.sit.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  var jspDocType = '<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>'
  var jspContent = jspDocType + fs.readFileSync(config.sit.index)
  fs.writeFileSync(path.resolve(config.sit.assetsPublicHome, 'rm-vue.jsp'), jspContent)

  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
})
