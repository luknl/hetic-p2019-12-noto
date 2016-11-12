document.addEventListener('DOMContentLoaded', () => {
  const body        = document.querySelector('body'),
        tofuTitle   = document.querySelector('.tofu__title'),
        tofuInput   = document.querySelector('.tofu__input'),
        tofuSpan    = document.querySelector('.tofu__span'),
        tofuButton  = document.querySelector('.tofu__button'),
        tofu        = [],
        word        = []
  // incrementator for each character
  let i = 0

  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode == 32){
      // no more tofu button appears
      tofuSpan.style.display   = 'none'
      tofuTitle.style.display  = 'none'
      tofuButton.style.display = 'block'
      // Add a tofy character for each key press
      tofu.push(`<span class="tofu__character tofu__character__${i}">□</span>`)
      // Add pressed key character in "word" array
      word.push(e.key.toUpperCase())
      tofuInput.innerHTML += tofu[i]
      i++
    }
    // if backspace, then remove last value of array and last tofu
    else if (e.keyCode == 8){
      tofu.pop()
      word.pop()
      tofuInput.innerHTML = tofu.join('')
    }
  })

  tofuButton.addEventListener('click', () => {
    for (let i in word) {
      const characters = document.querySelector(`.tofu__character__${i}`)
      setTimeout(() => {
        characters.innerHTML = word[i]
        characters.className += " tofu__animation";
      }, i * 400)
    }
  })

})
