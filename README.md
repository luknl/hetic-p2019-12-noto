# Noto
:100: Noto Font by Google | School Project

[![Build Status](https://travis-ci.org/luknl/hetic-p2019-12-noto.svg?branch=master)](https://travis-ci.org/luknl/hetic-p2019-12-noto)

## Requirements
- [Node.js](https://nodejs.org/en/) `5.0 or newer`
- [Yarn](https://yarnpkg.com/)
- [Babel CLI](https://babeljs.io/docs/usage/cli/)

## Stack
- [Babel](http://babeljs.io/) `^6.0.0` ES6+ support
- [Sass](http://sass-lang.com/) CSS with superpowers
- [Imagemin](https://github.com/imagemin/imagemin) minify images seamlessly
- [Browsersync](http://www.browsersync.io/) time-saving synchronised browser testing
- [Gulp](http://gulpjs.com/) streaming build system
- [Webpack](https://webpack.github.io/) module loader and bundler

## Make the awesome

### Install
Just clone the repo and start :

```shell
$ git clone https://github.com/luknl/hetic-p2019-12-noto.git
$ cd hetic-p2019-12-noto
$ yarn                          # Install Node.js components listed in ./package.json
```
Think to install gulp in global on your desktop : `yarn global add gulp`, if this has not been done before.

### Getting started
```shell
$ yarn run server
```
This will start a Node.js server with sockets support. You can change config in the following directory : `src/shared/config`.

### Run dev mode
```shell
$ yarn start
```
This will start a lightweight development server (browsersync dev server) with live reloading.

You need to run server in background to enable sockets support by launching following script :
```shell
$ yarn run server
```
