export default {
  server: {
    port: 8000,
  },
  dir: {
    srcDir: __dirname + '/src/client/',
    buildDir: __dirname + '/__build__/',
    distDir: __dirname + '/dist/',
    cssDir: 'css/',
    imgDir: 'img/',
    jsDir: 'js/',
    sassDir: 'sass/',
    fontsDir: 'fonts/',
  },
  fonts: {
    formats: 'woff woff2',
    custom: {
      'Noto Sans': [400, 700],
    },
  },
  css: {
    autoprefixer: ['last 10 versions'],
  },
  javascript: {
    babel: { presets: ['es2015', 'stage-2'] },
  },
}
