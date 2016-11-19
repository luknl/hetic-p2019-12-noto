/* @flow */

type Page = {

}

export function run(page: Page, modules: Array<Module>): void {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded')
  })
}

export function getPage(): Page {}
