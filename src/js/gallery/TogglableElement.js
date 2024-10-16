export class TogglableElement {
  #element;

  constructor(selector) {
    this.#element = document.querySelector(selector);
  }

  getElement() {
    return this.#element;
  }

  show() {
    this.#element.disabled = false;
    this.#element.classList.remove('hidden');
  }

  hide() {
    this.#element.disabled = true;
    this.#element.classList.add('hidden');
  }
}
