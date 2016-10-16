# Noto
:100: Noto Font by Google | School Project

## Requirements
- Node.js `5.0 or newer`

## Stack
- [Babel](http://babeljs.io/) `^6.0.0` ES6+ support
- [Sass](http://sass-lang.com/) CSS with superpowers
- [Imagemin](https://github.com/imagemin/imagemin) minify images seamlessly
- [Browsersync](http://www.browsersync.io/) time-saving synchronised browser testing
- [Gulp](http://gulpjs.com/) streaming build system
- [Webpack](https://webpack.github.io/) module loader and bundler


## Getting started

### Install

Just clone the repo and start :

```shell
$ git clone https://github.com/luknl/hetic-p2019-12-noto.git
$ cd hetic-p2019-12-noto
$ yarn                          # Install Node.js components listed in ./package.json
```
Think to install gulp in global on your desktop : `yarn global add gulp`, if this has not been done before.

#### How to start the dev mode ?

```shell
$ yarn start                    # or: gulp dev --watch
```

This will start a lightweight development server (browsersync dev server) with live reloading.

#### How to build for production ?

```shell
$ yarn run build               # or: gulp build --prod
```
