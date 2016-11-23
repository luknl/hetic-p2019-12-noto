/* @flow */

const fonts = {
  ar: 'Noto Naskh Arabic',
  hb: 'Noto Naskh Hebrew',
  ja: 'Noto Sans CJKjp',
  cy: 'Noto Sans Cypriot',
}

export const getFontFamily = (country: string) => {
  return fonts[country] || 'Noto Sans'
}
