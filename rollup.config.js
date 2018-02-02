import babel from 'rollup-plugin-babel'
import license from 'rollup-plugin-license'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

const defaultConfig = {
  entry: 'src/fetch-inject.js',
  plugins: []
}

const activeConfigs = [{
  format: 'iife',
  moduleName: 'fetchInject',
  dest: 'dist/fetch-inject.js'
}, {
  format: 'es',
  dest: 'dist/fetch-inject.es.js'
}, {
  format: 'umd',
  moduleName: 'fetchInject',
  dest: 'dist/fetch-inject.umd.js'
}]

activeConfigs.forEach(activeConfig => {
  Object.assign(activeConfig, defaultConfig)
})

const minifiedConfigs = activeConfigs.reduce(
  (minifiedConfigs, activeConfig) => minifiedConfigs.concat(
    Object.assign({}, activeConfig, {
      plugins: [
        babel({ presets: ['es2015-rollup'], exclude: 'node_modules/**' }),
        uglify({}, minify),
        license({ banner: `/*! Fetch Inject v<%= pkg.version %> | © <%= moment().format('YYYY') %>, 13AMDq9isKtQTxMQG4w7Yo7cEhqKAqQ4Lz | @license BTC */` }),
        ...activeConfig.plugins
      ],
      dest: activeConfig.dest.replace('js', 'min.js')
    })
  ),
  []
)

export default activeConfigs.concat(minifiedConfigs)
