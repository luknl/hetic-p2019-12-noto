/**
 * Return if it's a touch device
 *
 * @return {boolean}
 */
export default function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints
};
