/* @flow */

import type { User, Room } from '@shared/modules/notoSpace/types'

export default class MessengerUI {

  static $login: HTMLElement = document.querySelector('.login')
  static $loginForm: HTMLElement = document.querySelector('.login__form')
  static $loginInput: HTMLInputElement = document.querySelector('.login__input')
  static $loginError: HTMLElement = document.querySelector('.login__error')
  static $messageForm: HTMLElement = document.querySelector('.popup__form--message')
  static $messageInput: HTMLInputElement = document.querySelector('.popup__form--message input')
  static $controllerButton: HTMLCollection<HTMLElement> = document.querySelectorAll('.controller__button')
  static $roomForm: HTMLElement = document.querySelector('.popup__form--room')
  static $roomInput: HTMLInputElement = document.querySelector('.popup__form--room input')
  static $closeButtonPopup: HTMLElement = document.querySelectorAll('.popup__close')
  static $rooms: HTMLElement = document.querySelector('.rooms')
  static $roomsList: HTMLElement = document.querySelector('.rooms div')
  static $room: HTMLCollection<HTMLElement> = document.querySelectorAll('.room')

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

  static addRoom(user: ?User, room: Room) {
    this.$roomsList.innerHTML = `
      <div class="room ${(user && room.id === user.roomId) ? 'is-active' : ''}" id="room-${room.id}">
        ${room.name}
      </div>
    ${this.$roomsList.innerHTML}`
  }

  static addRooms(user: ?User, rooms: Array<Room>) {
    rooms.forEach((room) => this.addRoom(user, room))
  }

  static onPressController(callback: (id: string) => void) {
    [...this.$controllerButton].forEach((el) => {
      el.addEventListener('click', () => {
        const { id } = el
        callback(id)
      })
    })
  }

  static runPopup() {
    this.$closeButtonPopup.forEach((el) => {
      el.addEventListener('click', ({ target }: Event) => {
        const $popup = target.parentNode.parentNode
        if (!$popup.classList.contains('popup')) return
        $popup.classList.add('is-hidden')
      })
    })
  }

  static openPopup(name: string) {
    const el = document.querySelector('.popup--' + name)
    if (!el) return
    el.classList.remove('is-hidden')
  }

  static closePopup(name: string): void {
    const el = document.querySelector('.popup--' + name)
    if (!el) return
    el.classList.add('is-hidden')
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

  static onCreateRoom(callback: (value: string) => void) {
    this.$roomForm.addEventListener('submit', (e: Event) => {
      e.preventDefault()
      const { value } = this.$roomInput
      this.$roomInput.value = ''
      callback(value)
    })
  }

  static activeRoom(roomId: number) {
    const $room = this.$roomsList.querySelector(`#room-${roomId}`)
    const $activedRoom = this.$roomsList.querySelector('.is-active')
    if ($activedRoom) $activedRoom.classList.remove('is-active')
    if ($room) $room.classList.add('is-active')
  }

  static onJoinRoom(callback: (roomId: number) => void) {
    this.$rooms.addEventListener('click', (e: Event) => {
      e.preventDefault()
      if (!e.target || !e.target.id || typeof e.target.id !== 'string') return
      const roomId = parseInt(e.target.id.slice(5))
      callback(roomId)
    })
  }

  static onTypeMessage(callback: (value: string) => void) {
    this.$messageInput.addEventListener('keyup', (e: KeyboardEvent) => {
      const { value } = e.target
      callback(value)
    })
  }

}
