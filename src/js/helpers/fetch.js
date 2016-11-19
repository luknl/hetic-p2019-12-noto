/**
 * XMLHttpRequest micro helper
 * @flow
 */

type Options = {
  method?: 'GET' | 'POST',
  body?: any,
  headers?: Object,
}

export default function fetch(
  url: string,
  { method = 'GET', body = null, headers = {} }: Options = {}
): Promise<any> {
  const xhr = new XMLHttpRequest()
  return new Promise((resolve) => {
    xhr.open(method, url, true)
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key.toLowerCase(), headers[key])
    })
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4 && xhr.status !== 0 && xhr.statusText !== 'abort') {
        resolve(JSON.parse(xhr.response))
      }
    }
    xhr.send(body)
  })
}
