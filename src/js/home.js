document.addEventListener('DOMContentLoaded', () => {
  const body        = document.querySelector('body'),
        tofuTitle   = document.querySelector('.tofu__title h2'),
        tofuInput   = document.querySelector('.tofu__input'),
        tofuTypeBar    = document.querySelector('.tofu__input__typebar'),
        tofuSpaceBar  = document.querySelector('.tofu__spacebar'),
        tofuSpaceBarBtn  = document.querySelector('.tofu__spacebar__button'),
        tofuSpaceBarDown  = document.querySelector('.tofu__spacebar__button--down'),
        tofuSpaceBarFill  = document.querySelector('.tofu__spacebar__button_fill'),
        tofu        = [],
        word        = []
  // incrementator for each character
  let i        = 0,
  // check if all characters have been revealed
      revealed = false

  // when user starts typing
  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90){ //  || e.keyCode === 32
      // no more tofu button appears
      tofuTypeBar.style.display   = 'none'
      // tofuSpaceBar.style.display = 'block'
      tofuSpaceBar.style.display = 'flex'
      tofuSpaceBarBtn.innerText = 'Press space to noto'
      // Add a tofy character for each key press
      tofu.push(`<span class="tofu__input__characters tofu__input__character__${i}">□</span>`)
      // Add pressed key character in "word" array
      word.push(e.key.toUpperCase())
      tofuInput.innerHTML += tofu[i]
      i++
    }
    // if backspace, then remove last value of array and last tofu
    else if (e.keyCode === 8){
      tofu.pop()
      word.pop()
      tofuInput.innerHTML = tofu.join('')
      i--
    }
  })

  // when user press spacebar
  body.addEventListener('keydown', (e) => {

    // if(!revealed){ // PAS SUR

      if (e.keyCode === 32) {
        console.log('space down!')
        tofuSpaceBarDown.className = 'tofu__spacebar__button'
        tofuSpaceBarBtn.style.marginTop = '10px'
        tofuSpaceBarBtn.innerText = 'reveal in progress...'
        // add class fillAnimation to fill button as characters are revealed
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill fillAnimation'
        tofuSpaceBarFill.style.transitionDuration = (i * .4)+'s'

        // transform one by one each tofu into characters
        for (let i in word) {
          const characters = document.querySelector(`.tofu__input__character__${i}`)
          setTimeout(() => {
            characters.innerHTML = word[i]
            characters.className += " tofu__animation"
          }, i * 400)
        }
        // after all letters have been revealed
        // setTimeout(() => {
        //   console.log('yes!')
        //   tofuSpaceBarBtn.innerText = 'ta-dah! now release.'
        //   revealed = true
        //   tofuInput.innerHTML = ''
        //
        //   body.addEventListener('keyup', (e) => { // PAS SUR
        //     if (e.keyCode === 32) {
        //       // tofuSpaceBar.display = 'none'
        //     }
        //   })
        //
        // }, i * 400)
      }

  // }

    // when user relase the spacebar
    body.addEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        console.log('space up')
        tofuSpaceBarDown.className += ' tofu__spacebar__button--down'
        tofuSpaceBarBtn.innerText = 'Press space to noto'
        tofuSpaceBarBtn.style.marginTop = '0px'
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill'
        tofuInput.innerHTML = tofu.join('')
      }
    })
  })
})
