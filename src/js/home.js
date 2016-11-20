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
        word        = [],
        colors      = ['#FF1407','#FFBE00','#00B156','#4179F7'],
        audio = new Audio('../sounds/loading.aif.m4a')
  let i        = 0, // incrementator for each character
      revealed = false, // check if all characters have been revealed
      fired = false

  // when user starts typing
  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      // remove type bar and add bottom space bar
      tofuTypeBar.style.display   = 'none'
      tofuSpaceBar.style.display = 'flex'
      tofuSpaceBarFill.innerText = 'Press space to noto'
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
    // only if space key is pressed and at least a characters has been typed
    if (e.keyCode === 32 && (i != 0)) {

      // triger following events only once while pressing spacebar
      if(!fired) {
        console.log('space down!')
        fired = true
        // play the audio while space bar is down
        audio.play()
        audio.volume=0.3
        audio.currentTime = 1.4

        // transform one by one each tofu into characters
        for (let i in word) {
          let characters = document.querySelector(`.tofu__input__character__${i}`)
          setTimeout(() => {
            characters.innerHTML = word[i]
            // add class to animte the transformation from tofu to character
            characters.className += ` tofu__animation`
          }, i * 400)
        }

        tofuSpaceBarDown.className = 'tofu__spacebar__button'
        tofuSpaceBarBtn.style.marginTop = '10px'
        tofuSpaceBarFill.innerText = 'reveal in progress...'
        // tofuSpaceBarFill.style.color = 'white'
        // add class fillAnimation to fill button as characters are revealed
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill fillAnimation'
        tofuSpaceBarFill.style.transitionDuration = (i * .4)+'s'

        // when all characters have been revealed
        setTimeout(() => {
          revealed = true

          // change color of characters by random colors of the google logo
          for (let i in word) {
            let characters = document.querySelector(`.tofu__input__character__${i}`)
            let randomColor = Math.floor(Math.random()*colors.length)
            characters.style.color = colors[randomColor]
          }
          tofuSpaceBarFill.innerText = 'ta-dah! now release.'
          // tofuInput.innerHTML = ''
        }, i * 400)

      }
    }

    // when user relase the spacebar
    body.addEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        console.log('space up')
        fired = false

        // restore dom in the initial state
        tofuSpaceBarDown.className = 'tofu__spacebar__button tofu__spacebar__button--down'
        tofuSpaceBarBtn.style.marginTop = '0px'
        tofuSpaceBarFill.innerText = 'Press space to noto'
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill'
        tofuInput.innerHTML = tofu.join('')

        // if all all letters have been revealed
        if(revealed) {

          // function to animate a growing circle in svg
          circleGrowth()

          // release sound
          audio.currentTime = 4.73
        }
        else{
          audio.pause()
        }
      }
    })
  })

  // Functions //

  function circleGrowth() {
    body.style.overflow = 'hidden'
    tofuSpaceBarCircle.style.display = 'block'
    tofuSpaceBarFill.innerHTML = 'Wouhou'
    // launch svg animation
    svgCircle.beginElement()
  }

})
