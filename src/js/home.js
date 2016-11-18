document.addEventListener('DOMContentLoaded', () => {
  const body        = document.querySelector('body'),
        tofuTitle   = document.querySelector('.tofu__title h2'),
        tofuInput   = document.querySelector('.tofu__input'),
        tofuTypeBar    = document.querySelector('.tofu__input__typebar'),
        tofuSpaceBar   = document.querySelector('.tofu__spacebar'),
        tofuSpaceBarBtn    = document.querySelector('.tofu__spacebar__button'),
        tofuSpaceBarDown   = document.querySelector('.tofu__spacebar__button--down'),
        tofuSpaceBarFill   = document.querySelector('.tofu__spacebar__button_fill'),
        tofuSpaceBarCircle = document.querySelector('.tofu__spacebar__circle'),
        svgCircle   = document.querySelector('animateTransform'),
        tofu        = [],
        word        = []
  let i        = 0, // incrementator for each character
      revealed = false // check if all characters have been revealed

  // when user starts typing
  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      // remove type bar and add bottom space bar
      tofuTypeBar.style.display   = 'none'
      tofuSpaceBar.style.display = 'flex'
      tofuSpaceBarBtn.innerText = 'Press space to noto'
      // Add a tofu character for each key pressed in "tofu" array
      tofu.push(`<span class="tofu__input__characters tofu__input__character__${i}">□</span>`)
      // Add pressed key character in "word" array
      word.push(e.key.toUpperCase())
      // display characters in the dom
      tofuInput.innerHTML += tofu[i]
      i++
    }
    // if backspace, then remove last value of array and last tofu
    else if (e.keyCode === 8) {
      tofu.pop()
      word.pop()
      tofuInput.innerHTML = tofu.join('')
      i--
    }
  })

  // when user press spacebar
  body.addEventListener('keydown', (e) => {

      if (e.keyCode === 32) {
        // revealed = false
        console.log('space down!')

        // transform one by one each tofu into characters
        for (let i in word) {
          const characters = document.querySelector(`.tofu__input__character__${i}`)
          setTimeout(() => {
            characters.innerHTML = word[i]
            // add class to animte the transformation from tofu to character
            characters.className += ` tofu__animation`
          }, i * 400)
        }

        // set revealed to true when all letters are revelead
        setTimeout(() => {
          revealed = true
        }, i * 400)

        tofuSpaceBarDown.className = 'tofu__spacebar__button'
        tofuSpaceBarBtn.style.marginTop = '10px'
        tofuSpaceBarBtn.innerText = 'reveal in progress...'
        // add class fillAnimation to fill button as characters are revealed
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill fillAnimation'
        tofuSpaceBarFill.style.transitionDuration = (i * .4)+'s'
      }

    // when user relase the spacebar
    body.addEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        console.log('space up')

        // if all all letters have been revealed
        if(revealed) {
          console.log('revealed');
          // function to animate a growing circle in svg
          circleGrowth()
        }
        // restore dom in the initial state
        tofuSpaceBarDown.className = 'tofu__spacebar__button tofu__spacebar__button--down'
        tofuSpaceBarBtn.innerText = 'Press space to noto'
        tofuSpaceBarBtn.style.marginTop = '0px'
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill'
        tofuInput.innerHTML = tofu.join('')
      }
    })
  })

  // Functions //

  function circleGrowth() {
    body.style.overflow = 'hidden'
    tofuSpaceBarBtn.innerText = 'ta-dah! now release.'
    tofuSpaceBarCircle.style.display = 'block'
    // launch svg animation
    svgCircle.beginElement()
    tofuInput.innerHTML = ''
  }

})
