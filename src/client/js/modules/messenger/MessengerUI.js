/* @flow */

import type { Room } from '@shared/modules/notoSpace/types'

export default class MessengerUI {

  static $login: HTMLElement = document.querySelector('.login')
  static $loginForm: HTMLElement = document.querySelector('.login__form')
  static $loginInput: HTMLInputElement = document.querySelector('.login__input')
  static $loginError: HTMLElement = document.querySelector('.login__error')
  static $messageForm: HTMLElement = document.querySelector('.message')
  static $messageInput: HTMLInputElement = document.querySelector('.message__input')
  static $roomForm: HTMLElement = document.querySelector('.room__form')
  static $roomInput: HTMLInputElement = document.querySelector('.room__input')
  static $user: HTMLElement = document.querySelector('.user')
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
    if (!this.$login.parentNode) return
    this.$login.parentNode.removeChild(this.$login)
  }

  static addRoom(room: Room) {
    this.$rooms.innerHTML += `
      <div class"room id="${room.id}">
        ${room.name}
      </div>
    `
  }

  static addRooms(rooms: Array<Room>) {
    rooms.forEach((room) => this.addRoom(room))
  }

}
