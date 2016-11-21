/* @flow */

import { loadModule } from '@helpers/app'

export const messenger = loadModule(
  require('./messenger/index.js').default,
  { page: 'messenger' }
)
