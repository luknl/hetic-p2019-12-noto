import 'vendors/classList-polyfill.js'

/**
 * Select a DOM element
 *
 * @param {array} elements
 * @return {array} response
 */
export function select(...elements) {
  if(typeof elements[0] === 'object') {
    return elements
  }
  let response = []
  elements.forEach(element => {
    response = [
      ...response,
      // "...document.querySelectorAll" don't work on IE so:
      ...[].slice.call(document.querySelectorAll(element))
    ]
  })
  return response
}



/**
 * Find a DOM element in the context
 *
 * @param {array} elements
 * @return {array} response
 */
export function find(element) {
  return [].slice.call(this[0].querySelectorAll(element))
}



/**
 * Filter a NodeList
 *
 * @param {array} classNames
 * @return {array} response
 */
export function filter(...classNames) {
  return this.filter((element) => element.classList.contains(
    classNames.map((className) => className.substring('1')).join('')
  ))
}



/**
 * Get a DOM element with aspecific
 * index
 *
 * @param {int} index
 * @return {array}
 */
export function get(index = 0) {
  return this.filter((element, i) => i === index)
}



/**
 * Add a className
 * on a DOM element
 *
 * @param {string} className
 * @return {array} this
 */
export function addClass(className) {
  this.forEach((element) => element.classList.add(className))
  return this
}



/**
 * Return a className of DOM elements
 *
 * @return {array}
 */
export function getClass() {
  return this[0].className
}



/**
 * Get a DOM element with a specific
 * className
 *
 * @param {string} className
 * @return {array}
 */
export function hasClass(className) {
  return this[0].classList.contains(className)
}



/**
 * Remove a className of a DOM element
 *
 * @param {string} className
 * @return {array} this
 */
export function removeClass(className) {
  this.forEach((element) => element.classList.remove(className))
  return this
}



/**
 * Toogle a className of a DOM element
 *
 * @param {string} className
 * @return {array} this
 */
export function toogleClass(className) {
  this.forEach((element) => {
    if(element.classList.contains(className))
      element.classList.remove(className)
    else
      element.classList.add(className)
  })
  return this
}



/**
 * Add an event listener to a DOM element
 *
 * @param {string} type
 * @param {func} listener
 * @return {array}
 */
export function on(type, listener, capture = false) {
  this.forEach((element) => {
    element.addEventListener(type, (e) => {
      listener(element, e)
    }, capture)
  })
  return this
}



/**
 * Get/Change the value of an input
 * DOM element
 *
 *
 * @return {string} value
 */
export function value(value) {
  if(value === undefined)
    return this[0].value
  return this.forEach(element => {
    element.value = value
  })
}



/**
 * Change text value of a DOM element
 *
 * @return {string} value
 */
export function html(value) {
  this.forEach((element) => {
    element.innerHTML = value
  })
  return this
}



/**
 * Get data attribute of a DOM elemen
 *
 * @return {string} name
 * @return {string}
 */
export function getData(name) {
  return this[0].getAttribute(`data-${name}`) // dataset don't work on IE9
}



/**
 * Return the parent of a DOM element
 *
 * @return {array}
 */
export function parent() {
  return this.map((element) => element.parentNode)
}
