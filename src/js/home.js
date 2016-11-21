document.addEventListener('DOMContentLoaded', () => {
  const body         = document.querySelector('body'),
        tofuContent  = document.querySelector('.tofu'),
        tofuTitle    = document.querySelector('.tofu__title h2'),
        tofuInput    = document.querySelector('.tofu__input'),
        tofuInputVal = document.querySelector('.tofu__input input'),
        tofuTypeBar    = document.querySelector('.tofu__input__typebar'),
        tofuSpaceBar   = document.querySelector('.tofu__spacebar'),
        tofuSpaceBarBtn    = document.querySelector('.tofu__spacebar__button'),
        tofuSpaceBarDown   = document.querySelector('.tofu__spacebar__button--down'),
        tofuSpaceBarFill   = document.querySelector('.tofu__spacebar__button_fill'),
        tofuSpaceBarCircle = document.querySelector('.tofu__spacebar__circle'),
        svgCircle   = document.querySelector('animateTransform'),
        letterContent = document.querySelector('.letter'),
        letterMain = document.querySelector('.letter__main'),
        tofu        = [],
        word        = [],
        notoLetters = ['あ', 'S', 'ノ'],
        colors      = ['#FF1407','#FFBE00','#00B156','#4179F7'],
        audio = new Audio('../sounds/loading.aif.m4a'),
        mobile = body.clientWidth < 500
  let   i        = 0, // incrementator for each character
        revealed = false, // check if all characters have been revealed
        fired    = false

  // animating title when page has loaded
  tofuTitle.style.letterSpacing = '0px'
  tofuTitle.style.opacity = '1'
  tofuTitle.style.transition = 'all 2.7s ease'

  // when user starts typing
  addEventListeners([body, tofuTypeBar],['keyup', 'touchstart'], (e) => {
    // for android chrome keycode fix
    let androidKey = e.keyCode
    if (androidKey == 0 || androidKey == 229) { // between 29 and 54 for android
        androidKey = getKeyCode(tofuInputVal.value)
    }
    // user is only allowed to type letters
    const onlyLetters = mobile ? androidKey >= 65 && androidKey <= 90 : e.keyCode >= 65 && e.keyCode <= 90
    if (onlyLetters) {

      // remove type bar and add bottom space bar
      tofuTypeBar.style.display   = 'none'
      tofuSpaceBar.style.visibility = 'visible'
      tofuSpaceBarFill.innerText = 'Press space to noto'
      // Add a tofu character for each key pressed in "tofu" array
      tofu.push(`<span class="tofu__input__characters tofu__input__character__${i}">□</span>`)
      // Add pressed key character in "word" array
      word.push(String.fromCharCode(androidKey))
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
  addEventListeners(mobile ? tofuSpaceBarFill : body, [mobile ? 'touchstart' : 'keydown'], (e) => {
    // only if space key is pressed and at least a characters has been typed
    if (e.keyCode === 32 && (i != 0) || mobile) {

      // triger following events only once while pressing spacebar
      if(!fired) {
        console.log('space down!')
        fired = true
        // play the audio while space bar is down
        audio.play()
        audio.volume = 0.3
        audio.currentTime = 1.4

        // transform one by one each tofu into characters
        for (let i in word) {
          let characters = document.querySelector(`.tofu__input__character__${i}`)
          setTimeout(() => {
            characters.innerHTML = word[i]
            // change color of characters by random colors of the google logo
            let randomColor = Math.floor(Math.random()*colors.length)
            characters.style.color = colors[randomColor]
            // add class to animte the transformation from tofu to character
            characters.className += ` tofu__animation`
          }, i * 400)
        }

        tofuSpaceBarDown.className = 'tofu__spacebar__button'
        tofuSpaceBarBtn.style.marginTop = '10px'
        tofuSpaceBarFill.innerText = 'reveal in progress...'
        // add class fillAnimation to fill button as characters are revealed
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill fillAnimation'
        tofuSpaceBarFill.style.transitionDuration = (i * .4)+'s'

        // when all characters have been revealed
        setTimeout(() => {
          revealed = true
          tofuSpaceBarFill.innerText = 'ta-dah! now release.'
          // tofuInput.innerHTML = ''
        }, i * 400)

      }
    }

    // when user relase the spacebar
      addEventListeners(mobile ? tofuSpaceBarFill : body, [mobile ? 'touchend' : 'keyup'], (e) => {
      if (e.keyCode === 32 || mobile) {
        console.log('space up')
        fired = false

        // restore dom in the initial state
        tofuSpaceBarDown.className = 'tofu__spacebar__button tofu__spacebar__button--down'
        tofuSpaceBarBtn.style.marginTop = '0px'
        tofuSpaceBarFill.innerText = 'Press space to noto'
        tofuSpaceBarFill.className = 'tofu__spacebar__button_fill'
        tofuInput.innerHTML = tofu.join('')

        // if all letters have been revealed
        if (revealed) circleGrowth() // function to animate a growing circle in svg
        else audio.pause()
      }
    })
  })


  // Functions //

  // function to listen to multiple events on multiple selects
  // used here to have event listeners make the same function in desktop and mobile
  function addEventListeners(select, events, callback) {
    events.forEach((event, index) => {
      if (Array.isArray(select)) select[index].addEventListener(event, callback)
      else select.addEventListener(event, callback)
    })
  }

  // convert keycode for Android
  function getKeyCode(str) {
    return str.charCodeAt(str.length - 1);
  }

  // svg circle animation function
  function circleGrowth() {
    body.style.overflow = 'hidden'
    tofuSpaceBarCircle.style.display = 'block'
    tofuSpaceBarCircle.style.opacity = '1'
    // release sound
    audio.currentTime = 4.73
    // launch svg animation
    svgCircle.beginElement()

    // clean dom when animation is complete
    setTimeout(() => {
      tofuContent.remove()
      letterContent.style.display = 'flex'
      if(letterMain.innerHTML == ''){
        // add all letters in dom
        for (let j in notoLetters) {
          letterMain.innerHTML += `<div class="letter__main__letters letter__main__letter__${j}">${notoLetters[j]}</div>`
        }
        // animate each letter
        for (let j in notoLetters) {
          let letters = document.querySelector(`.letter__main__letter__${j}`)
          setTimeout(() => {
            letters.style.display = 'flex';
            // alternate animations each 2 letters in [notoLetters]
            (j % 2 == 0) ? letters.className += ' letter__animation-down' : letters.className += ' letter__animation-up'
          }, j * 4000)
        }
        // when all letters animations are done
        setTimeout(() => {
          letterContent.remove()
          body.innerHTML = 'NEXT PART'
        }, notoLetters.length * 4000)

      }

    }, 800)
  }

})
