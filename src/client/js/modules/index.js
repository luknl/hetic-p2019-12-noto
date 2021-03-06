/* @flow */

import { loadModule } from '@helpers/app'

export const homepage = loadModule(
  require('./homepage/index.js').default,
  { page: 'homepage' }
)

export const messenger = loadModule(
  require('./messenger/index.js').default,
  { page: 'messenger' }
)

export const space = loadModule(
  require('./space/index.js').default,
  { page: 'space' }
)
