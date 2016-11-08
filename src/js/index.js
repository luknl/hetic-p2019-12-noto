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
      console.log(value);
    }
  })

  // users click on "no more tofu" button
  tofuButton.addEventListener('click', () => {
    tofuInput.innerHTML = ''
    const $characters = document.querySelectorAll('.tofu__character')
    const tofuCharacter = document.querySelector('.tofu__character')
    for (let i = 0; i < value.length; i++) {
      tofuInput.innerHTML += `<span class="tofu__character tofu__animation tofu__character__${i}">${value[i]}</span>`
      setTimeout(() => {
        const $char = document.querySelector(`.tofu__character__${i}`)
        $char.style.opacity = 1
        $char.style.animation = 'fadeIn 2s ease'
      }, i * 200)
    }
  })

})
