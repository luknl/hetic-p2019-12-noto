document.addEventListener('DOMContentLoaded', () => {
  const body        = document.querySelector('body'),
        tofuTitle   = document.querySelector('.tofu__title'),
        tofuInput   = document.querySelector('.tofu__input'),
        tofuSpan    = document.querySelector('.tofu__span'),
        tofuButton  = document.querySelector('.tofu__button'),
        tofuButtons  = document.querySelector('.tofu__buttons'),
        tofuButton2  = document.querySelector('.tofu__button2__up'),
        tofuButton3  = document.querySelector('.tofu__button2__bottom'),
        tofuButtonFill  = document.querySelector('.tofu__button2__fill'),
        output = document.querySelector('.lol'),
        tofu        = [],
        word        = []
  // incrementator for each character
  let i        = 0,
  // check if all characters have been revealed
      revealed = false

  body.addEventListener('keyup', (e) => {
    // user is only allowed to type letters
    if (e.keyCode >= 65 && e.keyCode <= 90){ //  || e.keyCode === 32
      // no more tofu button appears
      tofuSpan.style.display   = 'none'
      tofuTitle.style.display  = 'none'
      // tofuButton.style.display = 'block'
      tofuButtons.style.display = 'block'
      tofuButton2.innerText = 'Press space to noto'
      // Add a tofy character for each key press
      tofu.push(`<span class="tofu__character tofu__character__${i}">□</span>`)
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
    }
  })

  // tofuButton.addEventListener('click', () => {
  //   for (let i in word) {
  //     const characters = document.querySelector(`.tofu__character__${i}`)
  //     setTimeout(() => {
  //       characters.innerHTML = word[i]
  //       characters.className += " tofu__animation"
  //     }, i * 400)
  //   }
  // })



  body.addEventListener('keydown', (e) => {

    if(!revealed){ // PAS SUR

      if (e.keyCode === 32) {
        console.log('space down!')
        tofuButton3.style.display = 'none'
        tofuButton2.innerText = 'reveal in progress...'
        // add class animation to fill button
        tofuButtonFill.className = 'tofu__button2__fill animation'
        tofuButtonFill.style.transitionDuration = (i * .4)+'s'

        // if (e in pressed) return
        // pressed[e] = e.timeStamp

        // transform one by one each tofu into characters
        for (let i in word) {
          const characters = document.querySelector(`.tofu__character__${i}`)
          setTimeout(() => {
            characters.innerHTML = word[i]
            characters.className += " tofu__animation"
          }, i * 400)
        }
        // after all letters have been revealed
        setTimeout(() => {
          console.log('yes!')
          tofuButton2.innerText = 'ta-dah! now release.'
          revealed = true
          tofuInput.innerHTML = ''

          body.addEventListener('keyup', (e) => { // PAS SUR
            if (e.keyCode === 32) {
              // tofuButtons.display = 'none'
            }
          })

        }, i * 400)
      }

  }

    // releasing the spacebar
    body.addEventListener('keyup', (e) => {
      if (e.keyCode === 32) {
        console.log('space up')
        tofuButton3.style.display = 'flex'
        tofuButton2.innerText = 'Press space to noto'
        tofuButtonFill.className = 'tofu__button2__fill'
        tofuInput.innerHTML = tofu.join('')
      }
        // calculate how long the key was pressed
        // if (!(e in pressed)) return;
        // let duration = ( e.timeStamp - pressed[e] );
        // console.log(duration);
        // test.splice(0);
        // test.push(duration)
        // delete pressed[e];
    })
  })
})
