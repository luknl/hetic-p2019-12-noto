document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body')
  const tofuTitle = document.querySelector('.tofu__title')
  const tofuInput = document.querySelector('.tofu__input')
  const tofuButton = document.querySelector('.tofu__button')
  const value = []
  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90){
      // no more tofu button appears
      tofuButton.style.display = 'inline-block'
      tofuTitle.style.display = 'none'

      // @TODO if backspace(keycode 8), then remove last value of array and last tofu

      value.push(e.key.toUpperCase())
      tofuInput.innerHTML += '<span class="tofu__character">□</span>'
    }

    // users click on "no more tofu" button
    tofuButton.addEventListener('click', () => {
      tofuInput.innerHTML = value.join('<span class="tofu__character"></span>')
    })
  })
})
