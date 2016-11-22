/* @flow */

import type { Room } from '@shared/modules/notoSpace/types'

export default class MessengerUI {

  static $login: HTMLElement = document.querySelector('.login')
  static $loginForm: HTMLElement = document.querySelector('.login__form')
  static $loginInput: HTMLInputElement = document.querySelector('.login__input')
  static $loginError: HTMLElement = document.querySelector('.login__error')
  static $messageForm: HTMLElement = document.querySelector('.popup__form--message')
  static $messageInput: HTMLInputElement = document.querySelector('.popup__form--message input')
  static $controllerButton: HTMLCollection<HTMLElement> = document.querySelectorAll('.controller__button')
  static $rooms: HTMLElement = document.querySelector('.rooms')

  static onLogin(callback: (userId: number) => void): void {
    this.$loginForm.addEventListener('submit', (e: Event) => {
      e.preventDefault()
      const userId = parseInt(this.$loginInput.value)
      callback(userId)
    })
  }

  static displayLoginError(message: string) {
    this.$loginError.innerHTML = message
  }

  static removeLoginForm() {
    this.$login.classList.add('is-hidden')
  }

  static addRoom(room: Room) {
    this.$rooms.innerHTML += `
      <div class="room" id="${room.id}">
        ${room.name}
      </div>
    `
  }

  static addRooms(rooms: Array<Room>) {
    rooms.forEach((room) => this.addRoom(room))
  }

  static onPressController(callback: (id: string) => void) {
    [...this.$controllerButton].forEach((el) => {
      el.addEventListener('click', () => {
        const { id } = el
        callback(id)
      })
    })
  }

  static openPopup(name: string) {
    const el = document.querySelector('.popup--' + name)
    if (!el) return
    el.classList.remove('is-hidden')
  }

  static onSendMessage(callback: (value: string) => void) {
    this.$messageForm.addEventListener('submit', (e: Event) => {
      e.preventDefault()
      const { value } = this.$messageInput
      callback(value)
    })
  }

  static resetMessageInput() {
    this.$messageInput.value = ''
  }


}
