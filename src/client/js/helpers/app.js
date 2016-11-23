/* @flow */

type Module = {
  page: string,
  module: Function,
}

type Page = string

export const run = (modules: Array<Module>, page: Page) => {
  Object.keys(modules).forEach((key) => {
    if (module.page === page) modules[key].module()
  })
}

export const getPage = (document: Document): ?string => {
  return document.body.classList[0]
}

export const loadModule = (module: Function, options: { page: Page }): Module => {
  return { ...options, module }
}
