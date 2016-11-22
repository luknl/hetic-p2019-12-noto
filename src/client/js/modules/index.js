/* @flow */

import { loadModule } from '@helpers/app'

export const homepage = loadModule(
  require('./homepage/index.js').default,
  { page: 'homepage' }
)
